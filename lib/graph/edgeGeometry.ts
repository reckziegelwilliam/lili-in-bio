import { Vector3, Quaternion } from 'three';
import type { Vec3 } from './types';

export interface EdgeTransform {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  length: number;
}

/**
 * Computes the position, orientation, and length needed to render a
 * default Y-axis-aligned CylinderGeometry as a line segment between
 * two points in 3D space.
 */
export function computeEdgeTransform(a: Vec3, b: Vec3): EdgeTransform {
  const start = new Vector3(a.x, a.y, a.z);
  const end = new Vector3(b.x, b.y, b.z);
  const direction = new Vector3().subVectors(end, start);
  const length = direction.length();

  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
  const quaternion = new Quaternion();
  if (length > 0.00001) {
    const up = new Vector3(0, 1, 0);
    quaternion.setFromUnitVectors(up, direction.clone().normalize());
  }

  return {
    position: [midpoint.x, midpoint.y, midpoint.z],
    quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
    length,
  };
}
