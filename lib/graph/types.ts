import type { Project } from '@/data/projects';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface GraphNode {
  id: string;
  kind: 'hub' | 'project';
  project: Project | null;
  color: string;
  baseRadius: number;
  position: Vec3;
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
  kind: 'spoke' | 'relationship';
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const HUB_ID = 'hub';
