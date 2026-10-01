'use client';

import '@react-three/fiber';
import { computeEdgeTransform } from '@/lib/graph/edgeGeometry';
import type { Vec3 } from '@/lib/graph/types';

interface GraphEdgeMeshProps {
  from: Vec3;
  to: Vec3;
  kind: 'spoke' | 'relationship';
}

const EDGE_STYLE = {
  spoke: { radius: 0.05, color: '#aac3ff', opacity: 0.85, emissiveIntensity: 0.6 },
  relationship: { radius: 0.03, color: '#ffffff', opacity: 0.35, emissiveIntensity: 0.2 },
} as const;

export function GraphEdgeMesh({ from, to, kind }: GraphEdgeMeshProps) {
  const { position, quaternion, length } = computeEdgeTransform(from, to);
  if (length < 0.0001) return null;
  const style = EDGE_STYLE[kind];

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[style.radius, style.radius, length, 8, 1]} />
      <meshStandardMaterial
        color={style.color}
        emissive={style.color}
        emissiveIntensity={style.emissiveIntensity}
        transparent
        opacity={style.opacity}
        roughness={0.5}
        metalness={0.1}
      />
    </mesh>
  );
}
