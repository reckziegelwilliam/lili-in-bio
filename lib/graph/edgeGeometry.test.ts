import { describe, it, expect } from 'vitest';
import { computeEdgeTransform } from './edgeGeometry';

describe('computeEdgeTransform', () => {
  it('places the transform at the midpoint between the two points', () => {
    const t = computeEdgeTransform({ x: 0, y: 0, z: 0 }, { x: 4, y: 0, z: 0 });
    expect(t.position).toEqual([2, 0, 0]);
  });

  it('reports the exact distance between the two points as length', () => {
    const t = computeEdgeTransform({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 });
    expect(t.length).toBeCloseTo(5, 5);
  });

  it('returns the identity quaternion when the two points coincide', () => {
    const t = computeEdgeTransform({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 });
    expect(t.quaternion).toEqual([0, 0, 0, 1]);
  });

  it('rotates the default +Y axis onto the edge direction', () => {
    const t = computeEdgeTransform({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 5 });
    // Rotating +Y onto +Z: axis = Y×Z = (1,0,0), angle 90° -> (sin45, 0, 0, cos45)
    expect(t.quaternion[0]).toBeCloseTo(Math.SQRT1_2, 5);
    expect(t.quaternion[1]).toBeCloseTo(0, 5);
    expect(t.quaternion[2]).toBeCloseTo(0, 5);
    expect(t.quaternion[3]).toBeCloseTo(Math.SQRT1_2, 5);
  });
});
