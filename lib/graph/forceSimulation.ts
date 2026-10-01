import { HUB_ID, type Graph, type Vec3 } from './types';

export interface ForceSimulationOptions {
  iterations?: number;
  springLength?: number;
  springStrength?: number;
  repulsionStrength?: number;
  damping?: number;
}

const DEFAULTS: Required<ForceSimulationOptions> = {
  iterations: 300,
  springLength: 5,
  springStrength: 0.02,
  repulsionStrength: 12,
  damping: 0.85,
};

function subtract(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function scale(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function length(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 0.0001;
}

/**
 * Settles graph node positions via spring attraction (along edges) plus
 * repulsion (between every pair of nodes), with damping. The hub is pinned
 * at the origin every step. Operates on plain {x,y,z} objects so it has no
 * rendering dependency and is trivially unit-testable.
 */
export function runForceSimulation(
  graph: Graph,
  options: ForceSimulationOptions = {},
): Record<string, Vec3> {
  const opts = { ...DEFAULTS, ...options };

  const positions: Record<string, Vec3> = {};
  const velocities: Record<string, Vec3> = {};
  for (const node of graph.nodes) {
    positions[node.id] = { ...node.position };
    velocities[node.id] = { x: 0, y: 0, z: 0 };
  }

  for (let step = 0; step < opts.iterations; step++) {
    const forces: Record<string, Vec3> = {};
    for (const node of graph.nodes) {
      forces[node.id] = { x: 0, y: 0, z: 0 };
    }

    for (let i = 0; i < graph.nodes.length; i++) {
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const a = graph.nodes[i];
        const b = graph.nodes[j];
        const delta = subtract(positions[a.id], positions[b.id]);
        const dist = length(delta);
        const repulsion = opts.repulsionStrength / (dist * dist);
        const direction = scale(delta, repulsion / dist);
        forces[a.id] = add(forces[a.id], direction);
        forces[b.id] = add(forces[b.id], scale(direction, -1));
      }
    }

    for (const edge of graph.edges) {
      const from = positions[edge.sourceId];
      const to = positions[edge.targetId];
      const delta = subtract(to, from);
      const dist = length(delta);
      const displacement = dist - opts.springLength;
      const direction = scale(delta, (opts.springStrength * displacement) / dist);
      forces[edge.sourceId] = add(forces[edge.sourceId], direction);
      forces[edge.targetId] = add(forces[edge.targetId], scale(direction, -1));
    }

    for (const node of graph.nodes) {
      if (node.id === HUB_ID) {
        positions[node.id] = { x: 0, y: 0, z: 0 };
        continue;
      }
      velocities[node.id] = scale(add(velocities[node.id], forces[node.id]), opts.damping);
      positions[node.id] = add(positions[node.id], velocities[node.id]);
    }
  }

  return positions;
}
