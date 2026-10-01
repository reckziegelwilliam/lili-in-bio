import { describe, it, expect } from 'vitest';
import { buildGraph } from './buildGraph';
import type { Project } from '@/data/projects';

const sample: Project[] = [
  { name: 'a', href: 'https://a.test', enabled: true, category: 'Writing' },
  { name: 'b', href: 'https://b.test', enabled: true, category: 'Writing' },
  { name: 'c', href: 'https://c.test', enabled: true, category: 'Tools' },
  { name: 'd', href: 'https://d.test', enabled: false, category: 'Tools' },
];

describe('buildGraph', () => {
  it('includes one hub node plus one node per enabled project', () => {
    const graph = buildGraph(sample);
    const projectNodes = graph.nodes.filter((n) => n.kind === 'project');
    expect(graph.nodes.find((n) => n.kind === 'hub')).toBeDefined();
    expect(projectNodes).toHaveLength(3);
    expect(projectNodes.map((n) => n.id).sort()).toEqual(['a', 'b', 'c']);
  });

  it('excludes disabled projects entirely', () => {
    const graph = buildGraph(sample);
    expect(graph.nodes.find((n) => n.id === 'd')).toBeUndefined();
  });

  it('connects every project node to the hub with a spoke edge', () => {
    const graph = buildGraph(sample);
    const spokes = graph.edges.filter((e) => e.kind === 'spoke');
    expect(spokes).toHaveLength(3);
    expect(spokes.every((e) => e.sourceId === 'hub')).toBe(true);
  });

  it('connects same-category projects with a relationship edge, and does not cross categories', () => {
    const graph = buildGraph(sample);
    const relationships = graph.edges.filter((e) => e.kind === 'relationship');
    expect(relationships).toHaveLength(1);
    expect(relationships[0]).toMatchObject({ sourceId: 'a', targetId: 'b' });
  });

  it('gives nodes in different categories different colors', () => {
    const graph = buildGraph(sample);
    const nodeA = graph.nodes.find((n) => n.id === 'a')!;
    const nodeC = graph.nodes.find((n) => n.id === 'c')!;
    expect(nodeA.color).not.toBe(nodeC.color);
  });
});
