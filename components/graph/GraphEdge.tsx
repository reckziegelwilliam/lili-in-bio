'use client';

import '@react-three/fiber';
import { computeEdgeTransform } from '@/lib/graph/edgeGeometry';
import type { Vec3 } from '@/lib/graph/types';

interface GraphEdgeMeshProps {
  from: Vec3;
  to: Vec3;
  kind: 'spoke' | 'relationship';
  /** A group is highlighted and this edge is not part of it. */
  dimmed?: boolean;
  /** Colour of the highlighted group; set on that group's relationship edges. */
  highlightColor?: string;
}

const EDGE_STYLE = {
  spoke: { radius: 0.05, color: '#aac3ff', opacity: 0.85, emissiveIntensity: 0.6 },
  relationship: { radius: 0.03, color: '#ffffff', opacity: 0.35, emissiveIntensity: 0.2 },
} as const;

export function GraphEdgeMesh({ from, to, kind, dimmed = false, highlightColor }: GraphEdgeMeshProps) {
  const { position, quaternion, length } = computeEdgeTransform(from, to);
  if (length < 0.0001) return null;
  const base = EDGE_STYLE[kind];
  const style = highlightColor
    ? { ...base, color: highlightColor, opacity: 0.9, emissiveIntensity: 0.8 }
    : dimmed
      ? { ...base, opacity: base.opacity * 0.2, emissiveIntensity: base.emissiveIntensity * 0.3 }
      : base;

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
