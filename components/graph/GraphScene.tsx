'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { buildGraph } from '@/lib/graph/buildGraph';
import { runForceSimulation } from '@/lib/graph/forceSimulation';
import { computeNodeEmphasis } from '@/lib/graph/nodeEmphasis';
import { GraphNodeMesh } from './GraphNode';
import { GraphEdgeMesh } from './GraphEdge';
import type { GraphNode } from '@/lib/graph/types';

interface GraphSceneProps {
  isCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  onNodeSelect: (node: GraphNode) => void;
}

const BASE_HUB_EMISSIVE = 0.5;
const BASE_PROJECT_EMISSIVE = 1.1;
const NEUTRAL_EMPHASIS = { scaleMultiplier: 1, emissiveMultiplier: 1 };

export function GraphScene({ isCoarsePointer, prefersReducedMotion, onNodeSelect }: GraphSceneProps) {
  const graph = useMemo(() => buildGraph(), []);
  const positions = useMemo(() => runForceSimulation(graph), [graph]);
  const segments = isCoarsePointer ? 20 : 32;

  return (
    <Canvas
      dpr={[1, isCoarsePointer ? 1.5 : 2]}
      gl={{ antialias: !isCoarsePointer }}
      camera={{ position: [0, 1.5, 17], fov: 45 }}
    >
      <color attach="background" args={['#05060a']} />
      <fog attach="fog" args={['#05060a', 15, 40]} />

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
            onSelect={onNodeSelect}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={0.6}
        minDistance={8}
        maxDistance={30}
      />

      <EffectComposer>
        <Bloom
          intensity={isCoarsePointer ? 0.9 : 1.2}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.4}
          radius={0.5}
        />
      </EffectComposer>
    </Canvas>
  );
}
