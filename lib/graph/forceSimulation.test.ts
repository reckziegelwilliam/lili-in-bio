import { describe, it, expect } from 'vitest';
import { runForceSimulation } from './forceSimulation';
import { buildGraph } from './buildGraph';
import type { Project } from '@/data/projects';

const sample: Project[] = [
  { name: 'a', href: 'https://a.test', enabled: true, category: 'Writing' },
  { name: 'b', href: 'https://b.test', enabled: true, category: 'Tools' },
];

describe('runForceSimulation', () => {
  it('pins the hub at the origin', () => {
    const graph = buildGraph(sample);
    const positions = runForceSimulation(graph);
    expect(positions['hub']).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('settles connected nodes away from the hub, not collapsed on top of it', () => {
    const graph = buildGraph(sample);
    const positions = runForceSimulation(graph);
    const distA = Math.hypot(positions['a'].x, positions['a'].y, positions['a'].z);
    const distB = Math.hypot(positions['b'].x, positions['b'].y, positions['b'].z);
    expect(distA).toBeGreaterThan(1);
    expect(distB).toBeGreaterThan(1);
  });

  it('is deterministic for the same input graph', () => {
    const posA = runForceSimulation(buildGraph(sample));
    const posB = runForceSimulation(buildGraph(sample));
    expect(posA['a'].x).toBeCloseTo(posB['a'].x, 5);
    expect(posA['a'].y).toBeCloseTo(posB['a'].y, 5);
    expect(posA['a'].z).toBeCloseTo(posB['a'].z, 5);
  });
});
