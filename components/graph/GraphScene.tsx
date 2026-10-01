'use client';

import { useEffect, useMemo, useRef, useState, type ElementRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Vector3 } from 'three';
import { buildGraph } from '@/lib/graph/buildGraph';
import { runForceSimulation } from '@/lib/graph/forceSimulation';
import { computeNodeEmphasis } from '@/lib/graph/nodeEmphasis';
import { GraphNodeMesh } from './GraphNode';
import { GraphEdgeMesh } from './GraphEdge';
import type { Graph, GraphNode } from '@/lib/graph/types';

interface GraphSceneProps {
  isCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  /** The currently-selected project node's id (NodeDetailPanel is open for it),
   *  or null when nothing is selected. Drives the camera focus animation. */
  focusedNodeId: string | null;
  onNodeSelect: (node: GraphNode) => void;
}

const BASE_HUB_EMISSIVE = 0.5;
const BASE_PROJECT_EMISSIVE = 1.1;
const NEUTRAL_EMPHASIS = { scaleMultiplier: 1, emissiveMultiplier: 1 };

export function GraphScene({ isCoarsePointer, prefersReducedMotion, focusedNodeId, onNodeSelect }: GraphSceneProps) {
  const graph = useMemo(() => buildGraph(), []);
  const positions = useMemo(() => runForceSimulation(graph), [graph]);

  // Derive the camera distance, orbit limits, and fog range from the actual
  // settled bounding radius of the graph, rather than hardcoded constants
  // tuned for a different (smaller) layout. This keeps every node in frame
  // even as the force simulation's real output grows or shrinks.
  const maxRadius = useMemo(
    () => Math.max(...Object.values(positions).map((p) => Math.hypot(p.x, p.y, p.z))),
    [positions],
  );
  // 2.4x the settled bounding radius (the starting formula) still clips several
  // nodes horizontally on narrow/portrait aspect ratios (verified against the
  // real 9-project force-simulation output, which settles at maxRadius ~15.3 —
  // a PerspectiveCamera projection check found nodes landing outside [-1, 1]
  // NDC at 2.4x–4.5x on a 390x844 viewport). 5.5x keeps every node within
  // ~90% of the frame on both a 1280x800 desktop viewport and 390x844 portrait
  // mobile, with margin for the nodes' own radius and fog falloff.
  const cameraDistance = Math.max(17, maxRadius * 5.5);
  const defaultCameraPosition = useMemo<[number, number, number]>(
    () => [0, cameraDistance * 0.1, cameraDistance],
    [cameraDistance],
  );

  return (
    <Canvas
      dpr={[1, isCoarsePointer ? 1.5 : 2]}
      gl={{ antialias: !isCoarsePointer }}
      camera={{ position: defaultCameraPosition, fov: 45 }}
    >
      <SceneContent
        graph={graph}
        positions={positions}
        isCoarsePointer={isCoarsePointer}
        prefersReducedMotion={prefersReducedMotion}
        focusedNodeId={focusedNodeId}
        cameraDistance={cameraDistance}
        onNodeSelect={onNodeSelect}
      />
    </Canvas>
  );
}

interface SceneContentProps {
  graph: Graph;
  positions: Record<string, { x: number; y: number; z: number }>;
  isCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  focusedNodeId: string | null;
  cameraDistance: number;
  onNodeSelect: (node: GraphNode) => void;
}

// How quickly the camera eases toward a new focus point each frame (simple
// per-frame lerp, not delta-time-corrected — fine at typical 60fps+ refresh
// rates for a short, one-off transition like this). Zooming in is snappier;
// zooming back out to the overview is slower and more graceful.
const FOCUS_EASE = 0.12;
const UNFOCUS_EASE = 0.06;
const FLY_DONE_EPSILON = 0.05;

function SceneContent({
  graph,
  positions,
  isCoarsePointer,
  prefersReducedMotion,
  focusedNodeId,
  cameraDistance,
  onNodeSelect,
}: SceneContentProps) {
  const segments = isCoarsePointer ? 20 : 32;
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const { camera } = useThree();
  const flyTarget = useRef<{ position: Vector3; lookAt: Vector3; ease: number } | null>(null);
  const [isFlying, setIsFlying] = useState(false);

  // Comfortably inside [minDistance, maxDistance] below (0.4x–2x) so OrbitControls
  // never yanks the camera back out right after a focus transition completes.
  const focusDistance = cameraDistance * 0.45;

  function flyTo(lookAt: Vector3, distance: number, ease: number) {
    const controls = controlsRef.current;
    if (!controls) return;
    let offset = camera.position.clone().sub(controls.target);
    if (offset.lengthSq() < 1e-6) offset = new Vector3(0, 0.15, 1);
    const position = lookAt.clone().add(offset.normalize().multiplyScalar(distance));
    flyTarget.current = { position, lookAt, ease };
    setIsFlying(true);
  }

  function flyToDefault() {
    flyTo(new Vector3(0, 0, 0), cameraDistance, UNFOCUS_EASE);
  }

  useEffect(() => {
    if (focusedNodeId) {
      const nodePos = positions[focusedNodeId];
      if (nodePos) flyTo(new Vector3(nodePos.x, nodePos.y, nodePos.z), focusDistance, FOCUS_EASE);
    } else {
      flyToDefault();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedNodeId]);

  useFrame(() => {
    const target = flyTarget.current;
    const controls = controlsRef.current;
    if (!target || !controls) return;
    camera.position.lerp(target.position, target.ease);
    controls.target.lerp(target.lookAt, target.ease);
    controls.update();
    if (camera.position.distanceTo(target.position) < FLY_DONE_EPSILON) {
      flyTarget.current = null;
      setIsFlying(false);
    }
  });

  return (
    <>
      <color attach="background" args={['#05060a']} />
      {/* Fog's far plane must stay comfortably beyond OrbitControls' maxDistance
          (2x) — otherwise zooming out fully pushes every node past the fog's far
          plane, and since fog color matches the scene background, the whole
          graph fades to indistinguishable-from-empty. */}
      <fog attach="fog" args={['#05060a', cameraDistance * 0.15, cameraDistance * 2.3]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 8, 10]} intensity={1.4} />
      <pointLight position={[-10, -5, 6]} intensity={0.8} color="#8fe3ff" distance={60} />

      {graph.edges.map((edge) => (
        <GraphEdgeMesh
          key={`${edge.sourceId}-${edge.targetId}`}
          from={positions[edge.sourceId]}
          to={positions[edge.targetId]}
          kind={edge.kind}
        />
      ))}

      {graph.nodes.map((node) => {
        const emphasis = node.project ? computeNodeEmphasis(node.project) : NEUTRAL_EMPHASIS;
        return (
          <GraphNodeMesh
            key={node.id}
            node={{ ...node, position: positions[node.id] }}
            scaleMultiplier={emphasis.scaleMultiplier}
            emissiveMultiplier={emphasis.emissiveMultiplier}
            baseEmissiveIntensity={node.kind === 'hub' ? BASE_HUB_EMISSIVE : BASE_PROJECT_EMISSIVE}
            segments={segments}
            alwaysShowLabel={isCoarsePointer}
            onSelect={onNodeSelect}
          />
        );
      })}

      <OrbitControls
        ref={controlsRef}
        enabled={!isFlying}
        enablePan={false}
        autoRotate={!prefersReducedMotion && !isFlying}
        autoRotateSpeed={0.6}
        minDistance={cameraDistance * 0.4}
        maxDistance={cameraDistance * 2}
      />

      <EffectComposer>
        <Bloom
          intensity={isCoarsePointer ? 0.9 : 1.2}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.4}
          radius={0.5}
        />
      </EffectComposer>
    </>
  );
}
