import { projects as allProjects, type Project } from '@/data/projects';
import { getCategoryColor } from './categoryColors';
import { HUB_ID, type Graph, type GraphNode, type GraphEdge, type Vec3 } from './types';

const HUB_RADIUS = 0.9;
const PROJECT_RADIUS = 0.5;
const GOLDEN_ANGLE = 2.399963229728653;

/** Deterministic initial scatter on a sphere — just a starting point for the force simulation. */
function initialScatterPosition(index: number): Vec3 {
  const seed = index + 1;
  const y = 1 - (seed % 10) / 5;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const angle = seed * GOLDEN_ANGLE;
  return {
    x: Math.cos(angle) * radiusAtY * 6,
    y: y * 6,
    z: Math.sin(angle) * radiusAtY * 6,
  };
}

export function buildGraph(sourceProjects: Project[] = allProjects): Graph {
  const enabled = sourceProjects.filter((p) => p.enabled);

  const hub: GraphNode = {
    id: HUB_ID,
    kind: 'hub',
    project: null,
    color: '#ffffff',
    baseRadius: HUB_RADIUS,
    position: { x: 0, y: 0, z: 0 },
  };

  const projectNodes: GraphNode[] = enabled.map((project, index) => ({
    id: project.name,
    kind: 'project',
    project,
    color: getCategoryColor(project.category),
    baseRadius: PROJECT_RADIUS,
    position: initialScatterPosition(index),
  }));

  const edges: GraphEdge[] = enabled.map((project) => ({
    sourceId: HUB_ID,
    targetId: project.name,
    kind: 'spoke' as const,
  }));

  for (let i = 0; i < enabled.length; i++) {
    for (let j = i + 1; j < enabled.length; j++) {
      if (enabled[i].category === enabled[j].category) {
        edges.push({ sourceId: enabled[i].name, targetId: enabled[j].name, kind: 'relationship' });
      }
    }
  }

  return { nodes: [hub, ...projectNodes], edges };
}
