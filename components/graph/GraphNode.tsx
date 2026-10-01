'use client';

import '@react-three/fiber';
import type { GraphNode as GraphNodeData } from '@/lib/graph/types';

interface GraphNodeMeshProps {
  node: GraphNodeData;
  scaleMultiplier: number;
  emissiveMultiplier: number;
  baseEmissiveIntensity: number;
  segments: number;
  onSelect: (node: GraphNodeData) => void;
}

export function GraphNodeMesh({
  node,
  scaleMultiplier,
  emissiveMultiplier,
  baseEmissiveIntensity,
  segments,
  onSelect,
}: GraphNodeMeshProps) {
  const radius = node.baseRadius * scaleMultiplier;

  return (
    <mesh
      position={[node.position.x, node.position.y, node.position.z]}
      onClick={(event: any) => {
        event.stopPropagation();
        onSelect(node);
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
    </mesh>
  );
}
