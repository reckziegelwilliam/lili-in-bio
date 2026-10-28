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
  /** How much bigger the invisible raycast target is than the visible sphere,
   *  e.g. 2.5 means a hit-radius 2.5x the rendered radius. Pointer accuracy
   *  (mouse vs. finger) should drive this — see HIT_RADIUS_MULTIPLIER below. */
  hitRadiusMultiplier: number;
  /** Touch devices have no hover state, so their labels stay on permanently
   *  instead of only appearing on pointer-over. */
  alwaysShowLabel: boolean;
  /** Another group is highlighted: this node and its label recede. */
  dimmed: boolean;
  /** This node belongs to the highlighted group. */
  inGroup: boolean;
  onHover: (id: string | null) => void;
  onSelect: (node: GraphNodeData) => void;
}

export function GraphNodeMesh({
  node,
  scaleMultiplier,
  emissiveMultiplier,
  baseEmissiveIntensity,
  segments,
  hitRadiusMultiplier,
  alwaysShowLabel,
  dimmed,
  inGroup,
  onHover,
  onSelect,
}: GraphNodeMeshProps) {
  const [hovered, setHovered] = useState(false);
  const radius = node.baseRadius * scaleMultiplier;
  const hitRadius = radius * hitRadiusMultiplier;
  const label = node.project?.name ?? null;
  // Every project point is named, so a visitor can tell what they are without hovering; featured ones read a little stronger.
  const isFeatured = node.project?.featuredOrder !== undefined;
  const showLabel = label !== null;
  const labelOpacity = hovered || inGroup ? 1 : dimmed ? 0.2 : isFeatured ? 0.9 : 0.6;

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      {/* Invisible raycast target, larger than what's drawn. A node's visible
          radius (0.5-0.9 world units) projects to only a handful of pixels on
          screen at the default camera distance — clicking/tapping it reliably
          needs a bigger hit area than its bloom-lit sphere actually is. */}
      <mesh
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onSelect(node);
        }}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHovered(true);
          onHover(node.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[hitRadius, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <mesh raycast={() => null}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={baseEmissiveIntensity * emissiveMultiplier * (dimmed ? 0.25 : 1)}
          metalness={node.kind === 'hub' ? 0.6 : 0.1}
          roughness={node.kind === 'hub' ? 0.25 : 0.4}
        />
      </mesh>

      {showLabel && (
        <Html distanceFactor={80} position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={{ opacity: labelOpacity, transform: `translate(14px, -50%) scale(${hovered ? 1.18 : 1})`, transformOrigin: 'left center' }}
            className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight text-white backdrop-blur-sm transition-[opacity,transform] duration-200 ${
              hovered ? 'bg-black/70 ring-1 ring-white/30' : 'bg-black/30'
            }`}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
