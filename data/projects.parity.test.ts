import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CATEGORY_ORDER, projects, projectsByCategory } from './projects';
import {
  CATEGORY_ORDER as LEGACY_ORDER,
  projects as legacyProjects,
  projectsByCategory as legacyByCategory,
} from './legacy-projects';
import type { Project } from './projectTypes';
import { buildGraph } from '@/lib/graph/buildGraph';
import { canonicalStringify } from '@/lib/projects/canonicalJson';

const root = fileURLToPath(new URL('..', import.meta.url));

const shown = (list: Project[]) =>
  list
    .filter((p) => p.enabled)
    .map((p) => ({ name: p.name, href: p.href, category: p.category, description: p.description, thumbnail: p.thumbnail, subLinks: p.subLinks }));

const groups = (list: { category: string; projects: Project[] }[]) =>
  list
    .map((g) => ({ category: g.category, names: g.projects.filter((p) => p.enabled).map((p) => p.name) }))
    .filter((g) => g.names.length > 0);

describe('seeded data/projects.json', () => {
  it('renders the same project list as the hand-written list it replaced', () => {
    expect(shown(projects)).toEqual(shown(legacyProjects));
  });

  it('keeps the category order and the groups', () => {
    expect(CATEGORY_ORDER).toEqual(LEGACY_ORDER);
    expect(groups(projectsByCategory)).toEqual(groups(legacyByCategory));
  });

  it('gives the graph the same nodes, colours and edges', () => {
    const now = buildGraph(projects);
    const before = buildGraph(legacyProjects);
    expect(now.nodes.map((n) => [n.id, n.color])).toEqual(before.nodes.map((n) => [n.id, n.color]));
    expect(now.edges).toEqual(before.edges);
  });

  it('is exactly what the seed script prints, in canonical form', () => {
    const text = readFileSync(`${root}data/projects.json`, 'utf8');
    expect(canonicalStringify(JSON.parse(text))).toBe(text);
    const printed = execFileSync(process.execPath, ['scripts/pulse-seed.mjs', '--format=projects-json'], { cwd: root, encoding: 'utf8' });
    expect(printed).toBe(text);
  });
});
