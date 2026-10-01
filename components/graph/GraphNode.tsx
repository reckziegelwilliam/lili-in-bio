'use client';

import { useState } from 'react';
import '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { GraphNode as GraphNodeData } from '@/lib/graph/types';

interface GraphNodeMeshProps {
  node: GraphNodeData;
  scaleMultiplier: number;
  emissiveMultiplier: number;
  baseEmissiveIntensity: number;
  segments: number;
  /** Touch devices have no hover state, so their labels stay on permanently
   *  instead of only appearing on pointer-over. */
  alwaysShowLabel: boolean;
  onSelect: (node: GraphNodeData) => void;
}

export function GraphNodeMesh({
  node,
  scaleMultiplier,
  emissiveMultiplier,
  baseEmissiveIntensity,
  segments,
  alwaysShowLabel,
  onSelect,
}: GraphNodeMeshProps) {
  const [hovered, setHovered] = useState(false);
  const radius = node.baseRadius * scaleMultiplier;
  const label = node.project?.name ?? null;
  const showLabel = label !== null && (alwaysShowLabel || hovered);

  return (
    <mesh
      position={[node.position.x, node.position.y, node.position.z]}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect(node);
      }}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[radius, segments, segments]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={baseEmissiveIntensity * emissiveMultiplier}
        metalness={node.kind === 'hub' ? 0.6 : 0.1}
        roughness={node.kind === 'hub' ? 0.25 : 0.4}
      />
      {showLabel && (
        <Html distanceFactor={10} position={[0, radius + 0.4, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}
