# lili-in-bio 3D Force-Graph Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the vertical scrolling card list on lili-in.bio with a real WebGL (react-three-fiber) 3D force-directed node graph, and delete the now-fully-identified dead code left over from the scrapped README features.

**Architecture:** A small set of pure, unit-tested functions (`lib/graph/*`) turn `data/projects.ts` into graph nodes/edges and settle their 3D positions via a custom force simulation. A client-only `react-three-fiber` scene (`components/graph/*`) renders those nodes/edges as real lit meshes with real bloom, with `next/dynamic({ ssr: false })` keeping three.js out of the server-rendered payload. A plain server-rendered link list is the default page content and the accessibility/no-JS/reduced-motion fallback; the canvas, when it mounts, covers it visually via `position: fixed`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, Vitest (new — this repo has no test runner today).

## Global Constraints

- Package manager is npm (`package-lock.json` present) — use `npm install` / `npm run`, not yarn/pnpm.
- Path alias `@/*` resolves to the repo root (see `tsconfig.json`); Vitest config must mirror this alias or imports in tests will fail to resolve.
- Every task that deletes or rewrites an import must be verified with `npx tsc --noEmit` — this repo has no component test suite, so the TypeScript compiler is the fastest real check that nothing else still references a deleted file.
- The scene is dark-only (`#05060a` background) per the approved spec — do not reintroduce light-mode conditionals.
- Preserve exact Plausible event names (`Visit`, `Link click`) and prop keys (`destination`, `source`, `device`, `lang`, `returning`, `browser`) — the Plausible dashboard is already configured around these.
- `data/projects.ts` is not modified by this plan — it stays the single source of truth for project name/href/category/description/thumbnail/subLinks/recentImprovements.

---

## Task 1: Delete already-orphaned dead code

This is safe to do first and independently: every file below has **zero references** anywhere else in the repo (verified via `grep -rl` across `app/`, `components/`, `lib/`, `types/`, excluding the file's own definition). They are leftovers from the README features that were deliberately scrapped (Reading Modes, Text Upgrade Tool, Visitor Snapshot card, Mini Systems Library, Interaction Style Chooser, Beta Signup) plus two components (`Hero.tsx`, `MetaFooter.tsx`) that turned out to be orphaned too once `GlassCard.tsx` (their only other consumer besides the scrapped components) is confirmed unused anywhere live.

**Files:**
- Delete: `components/BetaSignup.tsx`
- Delete: `components/UpgradeTool.tsx`
- Delete: `components/InteractionChooser.tsx`
- Delete: `components/MiniSystemsLibrary.tsx`
- Delete: `components/ReadingModeToggle.tsx`
- Delete: `components/SaveForLater.tsx`
- Delete: `components/TechPeek.tsx`
- Delete: `components/VisitorSnapshotCard.tsx`
- Delete: `components/Hero.tsx`
- Delete: `components/MetaFooter.tsx`
- Delete: `components/GlassCard.tsx`
- Delete: `app/api/upgrade/route.ts`
- Delete: `app/api/beta-signup/route.ts`
- Modify: `types/visitor.ts` (remove `GlassCardProps`, its only consumer was `GlassCard.tsx`)
- Modify: `package.json` (remove `openai` and `resend` dependencies — their only consumers were `app/api/upgrade/route.ts` and `app/api/beta-signup/route.ts`)

**Interfaces:**
- Produces: nothing new — this task only removes code. Later tasks do not depend on anything deleted here.

- [ ] **Step 1: Re-verify zero references right before deleting (repo state may have drifted)**

Run:
```bash
cd ~/Projects/Personal/Active/lili-in-bio
for f in BetaSignup UpgradeTool InteractionChooser MiniSystemsLibrary ReadingModeToggle SaveForLater TechPeek VisitorSnapshotCard Hero MetaFooter GlassCard; do
  echo "=== $f ==="
  grep -rl "$f" app components lib --include="*.tsx" --include="*.ts" | grep -v "components/$f.tsx"
done
```
Expected: every `=== Name ===` block prints nothing underneath it (no other file references it).

- [ ] **Step 2: Delete the orphaned component and route files**

```bash
git rm components/BetaSignup.tsx components/UpgradeTool.tsx components/InteractionChooser.tsx \
  components/MiniSystemsLibrary.tsx components/ReadingModeToggle.tsx components/SaveForLater.tsx \
  components/TechPeek.tsx components/VisitorSnapshotCard.tsx components/Hero.tsx components/MetaFooter.tsx \
  components/GlassCard.tsx
git rm -r app/api/upgrade app/api/beta-signup
```

- [ ] **Step 3: Remove `GlassCardProps` from `types/visitor.ts`**

Delete this block (it was `GlassCard.tsx`'s only consumer, now gone):
```ts
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
}
```

- [ ] **Step 4: Remove `openai` and `resend` from `package.json`, reinstall**

In `package.json`, delete these two lines from `"dependencies"`:
```json
    "openai": "^4.72.0",
    "resend": "^3.5.0",
```

Run:
```bash
npm install
```
Expected: `package-lock.json` updates to drop both packages; no errors.

- [ ] **Step 5: Verify nothing else broke**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors referencing any deleted file or removed type.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Remove dead code from scrapped README features

BetaSignup, UpgradeTool, InteractionChooser, MiniSystemsLibrary,
ReadingModeToggle, SaveForLater, TechPeek, VisitorSnapshotCard, Hero,
MetaFooter, and GlassCard had zero remaining references anywhere in the
app. Drops the openai/resend dependencies their API routes needed.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Graph data layer — types, category colors, buildGraph

Introduces Vitest (this repo has no test runner yet) and the first pure-logic module: turning `data/projects.ts` into a graph of nodes and edges. This is the foundation every later rendering task consumes.

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add `"test": "vitest run"` script, add `vitest` devDependency)
- Create: `lib/graph/types.ts`
- Create: `lib/graph/categoryColors.ts`
- Create: `lib/graph/buildGraph.ts`
- Test: `lib/graph/buildGraph.test.ts`

**Interfaces:**
- Produces:
  - `Vec3 = { x: number; y: number; z: number }` (`lib/graph/types.ts`)
  - `GraphNode = { id: string; kind: 'hub' | 'project'; project: Project | null; color: string; baseRadius: number; position: Vec3 }` (`lib/graph/types.ts`)
  - `GraphEdge = { sourceId: string; targetId: string; kind: 'spoke' | 'relationship' }` (`lib/graph/types.ts`)
  - `Graph = { nodes: GraphNode[]; edges: GraphEdge[] }` (`lib/graph/types.ts`)
  - `getCategoryColor(category: ProjectCategory): string` (`lib/graph/categoryColors.ts`)
  - `buildGraph(sourceProjects?: Project[]): Graph` (`lib/graph/buildGraph.ts`) — defaults to the real `projects` array from `data/projects.ts`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Add Vitest config matching the `@/*` path alias**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'node',
  },
});
```

In `package.json`, add to `"scripts"`:
```json
    "test": "vitest run",
```

- [ ] **Step 3: Write the shared graph types**

Create `lib/graph/types.ts`:
```ts
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
```

- [ ] **Step 4: Write the category color map**

Create `lib/graph/categoryColors.ts`:
```ts
import type { ProjectCategory } from '@/data/projects';

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  'Climate & Environment': '#5fd6a8',
  'Disaster Recovery': '#ffb86b',
  'Directory': '#8fe3ff',
  'Writing': '#ff8fd6',
  'Tools': '#c88fff',
};

export function getCategoryColor(category: ProjectCategory): string {
  return CATEGORY_COLORS[category];
}
```

- [ ] **Step 5: Write the failing test for `buildGraph`**

Create `lib/graph/buildGraph.test.ts`:
```ts
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
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npx vitest run lib/graph/buildGraph.test.ts`
Expected: FAIL — `Cannot find module './buildGraph'`

- [ ] **Step 7: Implement `buildGraph`**

Create `lib/graph/buildGraph.ts`:
```ts
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
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npx vitest run lib/graph/buildGraph.test.ts`
Expected: PASS, all 5 tests green.

- [ ] **Step 9: Commit**

```bash
git add vitest.config.ts package.json package-lock.json lib/graph/types.ts lib/graph/categoryColors.ts lib/graph/buildGraph.ts lib/graph/buildGraph.test.ts
git commit -m "$(cat <<'EOF'
Add graph data layer: types, category colors, buildGraph

Turns data/projects.ts into a hub-and-spoke graph: one node per
enabled project plus a center hub, spoke edges from hub to every
project, and relationship edges between projects sharing a category.
Also introduces Vitest, which this repo didn't have before.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Force simulation

A pure physics function that settles the graph's node positions — spring attraction along edges, repulsion between every pair of nodes, damping, with the hub pinned at the origin. This is what makes the layout "a real force-directed graph" rather than a hand-placed one.

**Files:**
- Create: `lib/graph/forceSimulation.ts`
- Test: `lib/graph/forceSimulation.test.ts`

**Interfaces:**
- Consumes: `Graph`, `Vec3`, `HUB_ID` from `lib/graph/types.ts` (Task 2); `buildGraph` from `lib/graph/buildGraph.ts` (Task 2, test only)
- Produces: `runForceSimulation(graph: Graph, options?: ForceSimulationOptions): Record<string, Vec3>` — a map from node id to settled position

- [ ] **Step 1: Write the failing tests**

Create `lib/graph/forceSimulation.test.ts`:
```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/graph/forceSimulation.test.ts`
Expected: FAIL — `Cannot find module './forceSimulation'`

- [ ] **Step 3: Implement the force simulation**

Create `lib/graph/forceSimulation.ts`:
```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/graph/forceSimulation.test.ts`
Expected: PASS, all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/graph/forceSimulation.ts lib/graph/forceSimulation.test.ts
git commit -m "$(cat <<'EOF'
Add force simulation for graph node layout

Spring attraction along edges + repulsion between every node pair +
damping, hub pinned at the origin. Pure math over plain {x,y,z}
objects, no rendering dependency.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Edge geometry transform

Computes the position/orientation/length needed to render a default Y-axis-aligned `CylinderGeometry` as a line segment between two arbitrary 3D points — the exact technique validated in the browser prototype, reused here as a tested, standalone function instead of inline math in a component.

**Files:**
- Create: `lib/graph/edgeGeometry.ts`
- Test: `lib/graph/edgeGeometry.test.ts`

**Interfaces:**
- Consumes: `Vec3` from `lib/graph/types.ts` (Task 2); `Vector3`, `Quaternion` from `three` (new dependency, installed in this task)
- Produces: `computeEdgeTransform(a: Vec3, b: Vec3): { position: [number, number, number]; quaternion: [number, number, number, number]; length: number }`

- [ ] **Step 1: Install `three`**

```bash
npm install three
npm install -D @types/three
```

- [ ] **Step 2: Write the failing tests**

Create `lib/graph/edgeGeometry.test.ts`:
```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run lib/graph/edgeGeometry.test.ts`
Expected: FAIL — `Cannot find module './edgeGeometry'`

- [ ] **Step 4: Implement `computeEdgeTransform`**

Create `lib/graph/edgeGeometry.ts`:
```ts
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run lib/graph/edgeGeometry.test.ts`
Expected: PASS, all 4 tests green.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json lib/graph/edgeGeometry.ts lib/graph/edgeGeometry.test.ts
git commit -m "$(cat <<'EOF'
Add edge geometry transform for 3D cylinder edges

computeEdgeTransform gives the position/quaternion/length needed to
orient a default Y-axis CylinderGeometry between two arbitrary 3D
points — the exact technique validated in the design-phase prototype,
now a tested standalone function.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Node emphasis

Computes how much a node's size/glow should be boosted based on how recently its project was worked on — reusing the existing freshness curve, replacing the old hardcoded "wildready" callout with a data-driven equivalent.

**Files:**
- Create: `lib/graph/nodeEmphasis.ts`
- Test: `lib/graph/nodeEmphasis.test.ts`

**Interfaces:**
- Consumes: `getCardIntensity` from `lib/utils/freshness.ts` (existing, unchanged); `Project` from `data/projects.ts`
- Produces: `computeNodeEmphasis(project: Project): { scaleMultiplier: number; emissiveMultiplier: number }`

- [ ] **Step 1: Write the failing tests**

Create `lib/graph/nodeEmphasis.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { computeNodeEmphasis } from './nodeEmphasis';
import type { Project } from '@/data/projects';

const base: Project = {
  name: 'test',
  href: 'https://test.example',
  enabled: true,
  category: 'Tools',
};

describe('computeNodeEmphasis', () => {
  it('returns no boost for a project with no recent improvements', () => {
    const emphasis = computeNodeEmphasis(base);
    expect(emphasis.scaleMultiplier).toBe(1);
    expect(emphasis.emissiveMultiplier).toBe(1);
  });

  it('boosts scale and emissive intensity for a project updated today', () => {
    const today = new Date().toISOString().slice(0, 10);
    const fresh: Project = {
      ...base,
      recentImprovements: [{ text: 'shipped', date: today, type: 'update' }],
    };
    const emphasis = computeNodeEmphasis(fresh);
    expect(emphasis.scaleMultiplier).toBeGreaterThan(1);
    expect(emphasis.emissiveMultiplier).toBeGreaterThan(1);
  });

  it('gives a stale update (far outside the 7-day decay window) the baseline multiplier', () => {
    const stale: Project = {
      ...base,
      recentImprovements: [{ text: 'old news', date: '2020-01-01', type: 'update' }],
    };
    const emphasis = computeNodeEmphasis(stale);
    expect(emphasis.scaleMultiplier).toBe(1);
    expect(emphasis.emissiveMultiplier).toBe(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/graph/nodeEmphasis.test.ts`
Expected: FAIL — `Cannot find module './nodeEmphasis'`

- [ ] **Step 3: Implement `computeNodeEmphasis`**

Create `lib/graph/nodeEmphasis.ts`:
```ts
import type { Project } from '@/data/projects';
import { getCardIntensity } from '@/lib/utils/freshness';

export interface NodeEmphasis {
  scaleMultiplier: number;
  emissiveMultiplier: number;
}

const MAX_SCALE_BOOST = 0.35;
const MAX_EMISSIVE_BOOST = 0.6;

/**
 * How much a node's size/glow should be boosted based on how recently its
 * project was worked on. Reuses the same freshness curve that used to
 * drive the old project card glow.
 */
export function computeNodeEmphasis(project: Project): NodeEmphasis {
  const { intensity } = getCardIntensity(project.recentImprovements);
  return {
    scaleMultiplier: 1 + intensity * MAX_SCALE_BOOST,
    emissiveMultiplier: 1 + intensity * MAX_EMISSIVE_BOOST,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/graph/nodeEmphasis.test.ts`
Expected: PASS, all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/graph/nodeEmphasis.ts lib/graph/nodeEmphasis.test.ts
git commit -m "$(cat <<'EOF'
Add node emphasis based on project freshness

Replaces the old hardcoded wildready callout with a data-driven
equivalent: a node's size/glow boost comes from the same freshness
curve (lib/utils/freshness.ts) the old project cards used.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Presentational mesh components

The react-three-fiber primitives: one component rendering a project/hub node as a lit sphere, one rendering an edge as a lit cylinder. No scene assembly yet — that's Task 7.

**Files:**
- Create: `components/graph/GraphNode.tsx`
- Create: `components/graph/GraphEdge.tsx`

**Interfaces:**
- Consumes: `GraphNode as GraphNodeData` from `lib/graph/types.ts` (Task 2); `computeEdgeTransform` from `lib/graph/edgeGeometry.ts` (Task 4); `Vec3` from `lib/graph/types.ts`
- Produces: `GraphNodeMesh` component (props: `node`, `scaleMultiplier`, `emissiveMultiplier`, `baseEmissiveIntensity`, `segments`, `onSelect`); `GraphEdgeMesh` component (props: `from`, `to`, `kind`)

- [ ] **Step 1: Install react-three-fiber and drei**

```bash
npm install @react-three/fiber @react-three/drei
```

- [ ] **Step 2: Write `GraphNodeMesh`**

Create `components/graph/GraphNode.tsx`:
```tsx
'use client';

import type { GraphNode as GraphNodeData } from '@/lib/graph/types';

interface GraphNodeMeshProps {
  node: GraphNodeData;
  scaleMultiplier: number;
  emissiveMultiplier: number;
  baseEmissiveIntensity: number;
  segments: number;
  onSelect: (node: GraphNodeData) => void;
}

export function GraphNodeMesh({
  node,
  scaleMultiplier,
  emissiveMultiplier,
  baseEmissiveIntensity,
  segments,
  onSelect,
}: GraphNodeMeshProps) {
  const radius = node.baseRadius * scaleMultiplier;

  return (
    <mesh
      position={[node.position.x, node.position.y, node.position.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(node);
      }}
    >
      <sphereGeometry args={[radius, segments, segments]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={baseEmissiveIntensity * emissiveMultiplier}
        metalness={node.kind === 'hub' ? 0.6 : 0.1}
        roughness={node.kind === 'hub' ? 0.25 : 0.4}
      />
    </mesh>
  );
}
```

- [ ] **Step 3: Write `GraphEdgeMesh`**

Create `components/graph/GraphEdge.tsx`:
```tsx
'use client';

import { computeEdgeTransform } from '@/lib/graph/edgeGeometry';
import type { Vec3 } from '@/lib/graph/types';

interface GraphEdgeMeshProps {
  from: Vec3;
  to: Vec3;
  kind: 'spoke' | 'relationship';
}

const EDGE_STYLE = {
  spoke: { radius: 0.05, color: '#aac3ff', opacity: 0.85, emissiveIntensity: 0.6 },
  relationship: { radius: 0.03, color: '#ffffff', opacity: 0.35, emissiveIntensity: 0.2 },
} as const;

export function GraphEdgeMesh({ from, to, kind }: GraphEdgeMeshProps) {
  const { position, quaternion, length } = computeEdgeTransform(from, to);
  if (length < 0.0001) return null;
  const style = EDGE_STYLE[kind];

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
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors. (These components aren't wired into a page yet, so there's nothing to visually check until Task 7 — don't skip ahead.)

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/graph/GraphNode.tsx components/graph/GraphEdge.tsx
git commit -m "$(cat <<'EOF'
Add presentational node/edge mesh components

GraphNodeMesh renders a lit sphere (color/emissive/metalness driven by
graph data); GraphEdgeMesh renders a lit cylinder oriented via
computeEdgeTransform. Not wired into a scene yet.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: GraphScene — the full canvas

Assembles everything into the actual WebGL scene: lighting, the settled graph, OrbitControls, real bloom, and the mobile-safe rendering tuning validated during design (touch detection caps pixel ratio/antialiasing/geometry detail/bloom cost).

**Files:**
- Create: `components/graph/GraphScene.tsx`

**Interfaces:**
- Consumes: `buildGraph` (Task 2), `runForceSimulation` (Task 3), `computeNodeEmphasis` (Task 5), `GraphNodeMesh` / `GraphEdgeMesh` (Task 6), `GraphNode` type (Task 2)
- Produces: `GraphScene` component (props: `isCoarsePointer: boolean`, `prefersReducedMotion: boolean`, `onNodeSelect: (node: GraphNode) => void`) — consumed by Task 10 (`GraphCanvasLoader`)

- [ ] **Step 1: Install the postprocessing packages**

```bash
npm install @react-three/postprocessing postprocessing
```

- [ ] **Step 2: Write `GraphScene`**

Create `components/graph/GraphScene.tsx`:
```tsx
'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { buildGraph } from '@/lib/graph/buildGraph';
import { runForceSimulation } from '@/lib/graph/forceSimulation';
import { computeNodeEmphasis } from '@/lib/graph/nodeEmphasis';
import { GraphNodeMesh } from './GraphNode';
import { GraphEdgeMesh } from './GraphEdge';
import type { GraphNode } from '@/lib/graph/types';

interface GraphSceneProps {
  isCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  onNodeSelect: (node: GraphNode) => void;
}

const BASE_HUB_EMISSIVE = 0.5;
const BASE_PROJECT_EMISSIVE = 1.1;
const NEUTRAL_EMPHASIS = { scaleMultiplier: 1, emissiveMultiplier: 1 };

export function GraphScene({ isCoarsePointer, prefersReducedMotion, onNodeSelect }: GraphSceneProps) {
  const graph = useMemo(() => buildGraph(), []);
  const positions = useMemo(() => runForceSimulation(graph), [graph]);
  const segments = isCoarsePointer ? 20 : 32;

  return (
    <Canvas
      dpr={[1, isCoarsePointer ? 1.5 : 2]}
      gl={{ antialias: !isCoarsePointer }}
      camera={{ position: [0, 1.5, 17], fov: 45 }}
    >
      <color attach="background" args={['#05060a']} />
      <fog attach="fog" args={['#05060a', 15, 40]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 8, 10]} intensity={1.4} />
      <pointLight position={[-10, -5, 6]} intensity={0.8} color="#8fe3ff" distance={60} />

      {graph.edges.map((edge) => (
        <GraphEdgeMesh
          key={`${edge.sourceId}-${edge.targetId}`}
          from={positions[edge.sourceId]}
          to={positions[edge.targetId]}
          kind={edge.kind}
        />
      ))}

      {graph.nodes.map((node) => {
        const emphasis = node.project ? computeNodeEmphasis(node.project) : NEUTRAL_EMPHASIS;
        return (
          <GraphNodeMesh
            key={node.id}
            node={{ ...node, position: positions[node.id] }}
            scaleMultiplier={emphasis.scaleMultiplier}
            emissiveMultiplier={emphasis.emissiveMultiplier}
            baseEmissiveIntensity={node.kind === 'hub' ? BASE_HUB_EMISSIVE : BASE_PROJECT_EMISSIVE}
            segments={segments}
            onSelect={onNodeSelect}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={0.6}
        minDistance={8}
        maxDistance={30}
      />

      <EffectComposer>
        <Bloom
          intensity={isCoarsePointer ? 0.9 : 1.2}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.4}
          radius={0.5}
        />
      </EffectComposer>
    </Canvas>
  );
}
```

- [ ] **Step 3: Manually verify in isolation**

This component has no page to mount it yet (that's Task 11). Create a throwaway temporary route to view it:

```bash
mkdir -p app/_graph-preview
cat > app/_graph-preview/page.tsx <<'EOF'
'use client';
import { GraphScene } from '@/components/graph/GraphScene';

export default function GraphPreview() {
  return (
    <div style={{ height: '100vh' }}>
      <GraphScene isCoarsePointer={false} prefersReducedMotion={false} onNodeSelect={() => {}} />
    </div>
  );
}
EOF
npm run dev
```

Open `http://localhost:3000/_graph-preview`. Expected: a hub-and-spoke 3D graph of all 9 real projects, auto-rotating, with visible bloom glow on each node, matching the validated prototype's look. Click a node — confirm no console errors (click handling itself is wired up fully in Task 11; for now just confirm it doesn't throw).

Delete the throwaway route once confirmed:
```bash
rm -rf app/_graph-preview
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/graph/GraphScene.tsx
git commit -m "$(cat <<'EOF'
Add GraphScene: full WebGL canvas with lighting, bloom, mobile tuning

Assembles buildGraph + runForceSimulation + the node/edge mesh
components into a real react-three-fiber scene. Touch devices
(pointer: coarse) get a capped pixel ratio, no antialiasing, lower
sphere segment count, and slightly reduced bloom strength — the exact
settings validated under Chrome DevTools mobile + 4x CPU throttle
emulation during design.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: NodeDetailPanel

The 2D HTML overlay shown when a project node is clicked: description, thumbnail preview (if any), sub-links (if any), and an "Open" link — firing the same Plausible `Link click` event shape the old cards used.

**Files:**
- Create: `components/graph/NodeDetailPanel.tsx`

**Interfaces:**
- Consumes: `Project` from `data/projects.ts`; `trackEvent` from `lib/utils/plausible.ts` (existing, unchanged); `VisitorSnapshot` from `types/visitor.ts`
- Produces: `NodeDetailPanel` component (props: `project: Project`, `snapshot: VisitorSnapshot | null`, `onClose: () => void`) — consumed by Task 11 (`app/page.tsx`)

- [ ] **Step 1: Write `NodeDetailPanel`**

Create `components/graph/NodeDetailPanel.tsx`:
```tsx
'use client';

import Image from 'next/image';
import type { Project } from '@/data/projects';
import { trackEvent } from '@/lib/utils/plausible';
import type { VisitorSnapshot } from '@/types/visitor';

interface NodeDetailPanelProps {
  project: Project;
  snapshot: VisitorSnapshot | null;
  onClose: () => void;
}

export function NodeDetailPanel({ project, snapshot, onClose }: NodeDetailPanelProps) {
  const source = snapshot?.source ?? 'direct';
  const device = snapshot?.deviceType ?? 'desktop';

  const handleOpenClick = () => {
    trackEvent('Link click', { props: { destination: project.name, source, device } });
  };

  const handleSubLinkClick = (subName: string) => {
    trackEvent('Link click', {
      props: { destination: `${project.name} - ${subName}`, source, device },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-2xl border border-white/15 bg-black/70 p-6 backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 text-white/50 hover:text-white"
      >
        ✕
      </button>

      <h2 className="pr-8 text-xl font-black tracking-tight text-white">{project.name}</h2>

      {project.description && <p className="mt-2 text-sm text-white/80">{project.description}</p>}

      {project.thumbnail && (
        <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl">
          <Image
            src={project.thumbnail}
            alt={`${project.name} preview`}
            fill
            className="object-cover object-top"
            sizes="400px"
          />
        </div>
      )}

      {project.subLinks && project.subLinks.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {project.subLinks.map((sub) => (
            <a
              key={sub.href}
              href={sub.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSubLinkClick(sub.name)}
              className="rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-center hover:bg-white/15"
            >
              <span className="block text-xs font-bold text-white">{sub.name}</span>
            </a>
          ))}
        </div>
      )}

      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOpenClick}
        className="mt-4 block w-full rounded-xl bg-white/10 py-3 text-center text-sm font-semibold text-white hover:bg-white/20"
      >
        Open {project.name} →
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors. (Not wired into a page yet — Task 11 does that; visual verification happens there.)

- [ ] **Step 3: Commit**

```bash
git add components/graph/NodeDetailPanel.tsx
git commit -m "$(cat <<'EOF'
Add NodeDetailPanel for project node click-through

2D overlay with description, thumbnail, sub-links, and an Open link —
gives the old embedded-preview and sub-link cards somewhere to live
now that nodes are 3D spheres instead of HTML cards. Preserves the
existing Link click Plausible event shape.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: AccessibleProjectList

The always-rendered, server-renderable semantic fallback: a plain list of real `<a>` tags for every project. This is simultaneously the SEO content, the screen-reader content, the no-JS fallback, and the reduced-motion fallback — one piece of markup serving all four, rather than four separate mechanisms.

**Files:**
- Create: `components/graph/AccessibleProjectList.tsx`

**Interfaces:**
- Consumes: `projects` from `data/projects.ts`; `VisuallyHidden` from `components/AccessibilityUtils.tsx` (existing, unchanged)
- Produces: `AccessibleProjectList` component (no props) — consumed by Task 11 (`app/page.tsx`)

- [ ] **Step 1: Write `AccessibleProjectList`**

Create `components/graph/AccessibleProjectList.tsx`:
```tsx
import { VisuallyHidden } from '@/components/AccessibilityUtils';
import { projects } from '@/data/projects';

export function AccessibleProjectList() {
  const enabled = projects.filter((p) => p.enabled);

  return (
    <nav
      id="main-content"
      aria-label="Projects"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#05060a] px-6 py-16"
    >
      <VisuallyHidden>
        <h1>lili.in.bio</h1>
      </VisuallyHidden>
      <ul className="w-full max-w-md space-y-3">
        {enabled.map((project) => (
          <li key={project.name}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-white transition-colors hover:bg-white/10"
            >
              <span className="block text-lg font-bold">{project.name}</span>
              {project.description && (
                <span className="mt-1 block text-sm text-white/70">{project.description}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/graph/AccessibleProjectList.tsx
git commit -m "$(cat <<'EOF'
Add AccessibleProjectList: SSR'd semantic fallback

A plain list of real <a> tags for every project, rendered by default.
Serves as SEO content, screen-reader content, the no-JS fallback, and
the prefers-reduced-motion fallback all at once — the 3D canvas (once
it mounts) visually covers this rather than replacing it in the DOM.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: GraphCanvasLoader

The client-only progressive-enhancement wrapper: lazy-loads `GraphScene` via `next/dynamic({ ssr: false })` (three.js has no server-rendered equivalent and shouldn't ship in the initial payload), detects touch/reduced-motion, and skips mounting the canvas entirely for visitors who've asked for reduced motion.

**Files:**
- Create: `components/graph/GraphCanvasLoader.tsx`

**Interfaces:**
- Consumes: `GraphScene` from `components/graph/GraphScene.tsx` (Task 7, dynamically imported); `GraphNode` type from `lib/graph/types.ts`
- Produces: `GraphCanvasLoader` component (props: `onNodeSelect: (node: GraphNode) => void`, `onActiveChange: (active: boolean) => void`) — consumed by Task 11 (`app/page.tsx`). `onActiveChange(false)` fires when the canvas is skipped (reduced motion) so the page can keep the accessible list focusable/interactive via `inert`.

- [ ] **Step 1: Write `GraphCanvasLoader`**

Create `components/graph/GraphCanvasLoader.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { GraphNode } from '@/lib/graph/types';

const GraphScene = dynamic(() => import('./GraphScene').then((mod) => mod.GraphScene), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#05060a]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  ),
});

interface GraphCanvasLoaderProps {
  onNodeSelect: (node: GraphNode) => void;
  onActiveChange: (active: boolean) => void;
}

export function GraphCanvasLoader({ onNodeSelect, onActiveChange }: GraphCanvasLoaderProps) {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [skipCanvas, setSkipCanvas] = useState<boolean | null>(null);

  useEffect(() => {
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsCoarsePointer(coarseQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);
    // Visitors who've asked for reduced motion get the accessible list only —
    // no reason to load three.js just to render a static, non-rotating scene.
    setSkipCanvas(motionQuery.matches);
    onActiveChange(!motionQuery.matches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skipCanvas === null || skipCanvas) return null;

  return (
    <GraphScene
      isCoarsePointer={isCoarsePointer}
      prefersReducedMotion={prefersReducedMotion}
      onNodeSelect={onNodeSelect}
    />
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors. (Full end-to-end check happens in Task 11, once this is actually mounted in the page.)

- [ ] **Step 3: Commit**

```bash
git add components/graph/GraphCanvasLoader.tsx
git commit -m "$(cat <<'EOF'
Add GraphCanvasLoader: client-only progressive enhancement

Dynamically imports GraphScene with ssr:false (three.js has no SSR
story and shouldn't ship in the initial payload), detects touch and
prefers-reduced-motion, and skips mounting the canvas entirely for
reduced-motion visitors.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Assemble the new page, simplify layout, remove now-orphaned old page code

Wires everything together in `app/page.tsx`, then deletes the old page's dependencies that only `app/page.tsx` was keeping alive (`ProjectCard`, `ThemeToggle`, `Providers`/`useTheme`, `AuraBackground/*`, `paletteGenerator`, `LoadingStates`), trims `seedGenerator.ts`/`types/visitor.ts`/`useVisitorSnapshot.ts` down to what's still actually used, and simplifies `app/layout.tsx`.

**Files:**
- Modify: `app/page.tsx` (full rewrite)
- Modify: `app/layout.tsx` (remove `<Providers>` wrapper)
- Modify: `lib/hooks/useVisitorSnapshot.ts` (remove reading-mode machinery — part of the scrapped Reading Modes feature)
- Modify: `types/visitor.ts` (trim to `VisitorSnapshot`/`VisitorSource`/`DeviceType` only)
- Modify: `lib/utils/seedGenerator.ts` (trim to `lerp`/`clamp` only, grep-verified)
- Delete: `components/ProjectCard.tsx`
- Delete: `components/ThemeToggle.tsx`
- Delete: `components/Providers.tsx`
- Delete: `lib/hooks/useTheme.tsx`
- Delete: `components/AuraBackground/` (all 4 files)
- Delete: `lib/utils/paletteGenerator.ts`
- Delete: `components/LoadingStates.tsx`

**Interfaces:**
- Consumes: `AccessibleProjectList` (Task 9), `GraphCanvasLoader` (Task 10), `NodeDetailPanel` (Task 8), `GraphNode` type (Task 2), `useVisitorSnapshot` (trimmed, this task), `trackEvent` (unchanged), `SkipToContent` (unchanged, from `components/AccessibilityUtils.tsx`)

- [ ] **Step 1: Rewrite `app/page.tsx`**

Replace the entire contents of `app/page.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { SkipToContent } from '@/components/AccessibilityUtils';
import { AccessibleProjectList } from '@/components/graph/AccessibleProjectList';
import { GraphCanvasLoader } from '@/components/graph/GraphCanvasLoader';
import { NodeDetailPanel } from '@/components/graph/NodeDetailPanel';
import { useVisitorSnapshot } from '@/lib/hooks/useVisitorSnapshot';
import { trackEvent } from '@/lib/utils/plausible';
import type { GraphNode } from '@/lib/graph/types';

export default function Home() {
  const snapshot = useVisitorSnapshot();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [canvasActive, setCanvasActive] = useState(false);
  const visitTracked = useRef(false);

  useEffect(() => {
    if (!snapshot || visitTracked.current) return;
    visitTracked.current = true;
    trackEvent('Visit', {
      props: {
        source: snapshot.source,
        device: snapshot.deviceType,
        lang: snapshot.language?.slice(0, 2) || 'en',
        returning: snapshot.isReturning ? 'yes' : 'no',
        browser: snapshot.browser || 'unknown',
      },
    });
  }, [snapshot]);

  return (
    <main className="relative min-h-screen bg-[#05060a]">
      <SkipToContent />

      {/* Always-rendered semantic content: SEO, screen readers, no-JS, reduced-motion. */}
      <div {...{ inert: canvasActive ? true : undefined }}>
        <AccessibleProjectList />
      </div>

      {/* Progressive enhancement: covers the list above once it mounts. */}
      <div className="fixed inset-0 z-30">
        <GraphCanvasLoader
          onNodeSelect={(node) => node.project && setSelectedNode(node)}
          onActiveChange={setCanvasActive}
        />
      </div>

      {selectedNode?.project && (
        <NodeDetailPanel
          project={selectedNode.project}
          snapshot={snapshot}
          onClose={() => setSelectedNode(null)}
        />
      )}

      <a
        href="https://github.com/reckziegelwilliam"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="fixed bottom-4 right-4 z-40 rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      </a>
    </main>
  );
}
```

Note: `{...{ inert: canvasActive ? true : undefined }}` is spread rather than written as a plain `inert={...}` prop because `@types/react` in this Next.js 14 setup may not yet type `inert` on `div`; the spread bypasses the JSX type check while still setting the real DOM attribute, which modern browsers use to remove the covered list from the tab order and accessibility tree while the canvas is visually on top of it.

- [ ] **Step 2: Simplify `app/layout.tsx`**

In `app/layout.tsx`, remove the `Providers` import and wrapper. Change:
```tsx
import { Providers } from "@/components/Providers";
```
to nothing (delete the line), and change:
```tsx
        <Providers>
          {children}
        </Providers>
```
to:
```tsx
        {children}
```

- [ ] **Step 3: Trim `lib/hooks/useVisitorSnapshot.ts` — remove reading-mode machinery**

Reading Modes was explicitly scrapped. Remove from `lib/hooks/useVisitorSnapshot.ts`:
- The `READING_MODE` entry from `STORAGE_KEYS`
- `getStoredReadingMode()`
- `getDefaultReadingMode()`
- `updateReadingMode()` (exported function)
- The `readingMode` field from the returned `VisitorSnapshot` object, and the `storedMode`/`defaultMode` locals that computed it
- The `ReadingMode` import

The resulting hook body (replacing from `export function useVisitorSnapshot` to the end of file):
```ts
export function useVisitorSnapshot(): VisitorSnapshot | null {
  const [snapshot, setSnapshot] = useState<VisitorSnapshot | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const source = detectSource();
      const deviceType = detectDeviceType();
      const { count, isReturning } = updateVisitCount();

      const visitorSnapshot: VisitorSnapshot = {
        source,
        deviceType,
        localHour: getLocalHour(),
        prefersDark: prefersDarkMode(),
        visitCount: count,
        language: getLanguage(),
        timezone: getTimezone(),
        isReturning,
        os: detectOS(),
        browser: detectBrowser(),
      };

      setSnapshot(visitorSnapshot);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return snapshot;
}
```

And update the import line at the top from:
```ts
import type { VisitorSnapshot, VisitorSource, DeviceType, ReadingMode } from '@/types/visitor';
```
to:
```ts
import type { VisitorSnapshot, VisitorSource, DeviceType } from '@/types/visitor';
```

- [ ] **Step 4: Trim `types/visitor.ts`**

Replace the entire contents of `types/visitor.ts` with just what's still used (`VisitorSnapshot` no longer has a `readingMode` field after Step 3):
```ts
export type VisitorSource = 'instagram' | 'tiktok' | 'twitter' | 'direct' | 'other';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface VisitorSnapshot {
  source: VisitorSource;
  deviceType: DeviceType;
  localHour: number; // 0-23
  prefersDark: boolean;
  visitCount: number;
  language: string;
  timezone: string;
  isReturning: boolean;
  os?: string;
  browser?: string;
}
```

- [ ] **Step 5: Delete the now-orphaned old page dependencies**

```bash
git rm components/ProjectCard.tsx components/ThemeToggle.tsx components/Providers.tsx \
  lib/hooks/useTheme.tsx lib/utils/paletteGenerator.ts components/LoadingStates.tsx
git rm -r components/AuraBackground
```

- [ ] **Step 6: Grep-verify and trim `lib/utils/seedGenerator.ts`**

Run:
```bash
for sym in mapRange hslToHex hslToRgb hslToRgba generateVisualSeed simpleHash lerp clamp; do
  echo "=== $sym ==="
  grep -rl "\b$sym\b" app components lib --include="*.tsx" --include="*.ts" | grep -v "lib/utils/seedGenerator.ts"
done
```
Expected: `lerp` and `clamp` show no remaining external consumers yet (they will, once Tasks 2–5's graph code is the only thing left using them — confirm by checking `lib/graph/`); `mapRange`, `hslToHex`, `hslToRgb`, `hslToRgba`, `generateVisualSeed`, `simpleHash` show **zero** references anywhere, including in `lib/graph/`.

If a symbol other than `lerp`/`clamp` shows a reference you didn't expect, stop and investigate before deleting it — do not delete something still in use.

Replace the entire contents of `lib/utils/seedGenerator.ts` with just the two confirmed-live helpers:
```ts
/**
 * Interpolate between two values based on a factor (0-1)
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

(Neither `lerp` nor `clamp` is actually called by the graph code written in Tasks 2–10 — this plan's force simulation and node emphasis didn't end up needing them. If Step 6's grep confirms zero remaining consumers for `lerp`/`clamp` too, delete `lib/utils/seedGenerator.ts` entirely instead of trimming it, and skip creating the file above.)

- [ ] **Step 7: Verify everything compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Manual end-to-end verification**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected:
- The 3D graph renders, auto-rotating, with bloom, matching the validated prototype.
- Clicking a project node opens `NodeDetailPanel` with its description (and thumbnail/sub-links where applicable); the "Open" link navigates to the project's `href`.
- With browser devtools' "Emulate CSS prefers-reduced-motion: reduce" turned on, reload — the canvas should not mount at all, and `AccessibleProjectList`'s plain link list should be visible and clickable instead.
- View page source (`curl -s http://localhost:3000 | grep -A2 "oesis"` or similar) — confirm the project names/links are present in the server-rendered... note `app/page.tsx` is `'use client'`, so this list is NOT present in the raw server HTML before hydration today. **This is a known limitation of this plan**: because `page.tsx` is a client component (it needs `useState`/`useEffect` for the visitor snapshot and node selection), `AccessibleProjectList` is still client-rendered, not truly present for a crawler that doesn't execute JS. If this matters for your SEO goals, a follow-up task to split `page.tsx` into a server component wrapping a client sub-component would be needed — flagging this now rather than silently claiming full SEO coverage.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Replace card list with the 3D graph in app/page.tsx

Assembles AccessibleProjectList + GraphCanvasLoader + NodeDetailPanel
into the new page. Removes ProjectCard, ThemeToggle, Providers/
useTheme, AuraBackground, paletteGenerator, and LoadingStates — all
now fully orphaned. Strips the scrapped Reading Modes machinery out of
useVisitorSnapshot and trims types/visitor.ts and seedGenerator.ts to
what's actually still used.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Update README and env.example

The README currently describes the original, much larger aspirational feature set (Reading Modes, Text Upgrade Tool, Visitor Snapshot, Mini Systems Library) and `env.example` still asks for an OpenAI key that nothing uses anymore. Bring both in line with reality.

**Files:**
- Modify: `README.md`
- Modify: `env.example`

**Interfaces:**
- None — documentation only.

- [ ] **Step 1: Update `env.example`**

Remove the now-unused `OPENAI_API_KEY` line (keep `RESEND_API_KEY` only if still referenced elsewhere — it isn't, per Task 1's deletions, so remove it too). The file should contain only what the app actually reads at runtime:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=lili-in.bio
```

- [ ] **Step 2: Rewrite the README's feature description**

Replace the `## 🌟 Features` section (and the "Dynamic Aura Background" subsection, and any OpenAI/Resend setup instructions under `## 🚀 Quick Start`) with a description of the actual current page: a 3D force-directed graph of projects (hub + spokes + category relationship edges), real WebGL/bloom via react-three-fiber, click-to-expand project details, an accessible/reduced-motion fallback list, and Plausible analytics. Remove the `OPENAI_API_KEY`/Resend-domain-verification setup steps from Quick Start since nothing in the app calls either service anymore.

- [ ] **Step 3: Commit**

```bash
git add README.md env.example
git commit -m "$(cat <<'EOF'
Update README and env.example to describe the actual current page

The README described the original aspirational feature set (Reading
Modes, Text Upgrade Tool, Mini Systems Library, CSS aura background),
most of which was already gone from the live page before this
redesign. Describes the real 3D force-graph page instead, and drops
the now-unused OPENAI_API_KEY from env.example.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Final verification pass

The spec's testing/verification plan items that can only be checked once everything above is deployed or running together — not a new feature, a checklist.

**Files:** none (verification only)

- [ ] **Step 1: Full build check**

```bash
npm run build
```
Expected: builds successfully with no type errors. Note the production bundle size for the route that includes the three.js chunk (reported in the build output) — this is the number to watch if a future change makes the graph noticeably heavier.

- [ ] **Step 2: Run the full test suite**

```bash
npm run test
```
Expected: all `lib/graph/*.test.ts` suites pass (15 tests across Tasks 2–5).

- [ ] **Step 3: Real-device check**

Deploy to a preview environment (or run `npm run build && npm run start` and tunnel it) and open it on an actual phone, not just emulation. Confirm: the graph renders, bloom is visible, rotation/drag feels reasonable, and tapping a node opens `NodeDetailPanel` without lag.

- [ ] **Step 4: Reduced-motion fallback check**

On the phone or in a desktop browser, enable "reduce motion" in OS accessibility settings, reload the page. Confirm the 3D canvas does not load at all (check Network tab — no three.js chunk requested) and `AccessibleProjectList`'s plain list is what's shown.

- [ ] **Step 5: Plausible dashboard check**

After deploying, visit the live site once, click into a project, and check the Plausible dashboard confirms a `Visit` event and a `Link click` event with the expected `source`/`device`/`destination` props — per the existing portfolio status note to "check Plausible analytics" after changes.

- [ ] **Step 6: Confirm no dangling references to anything deleted in this plan**

```bash
grep -rl "ProjectCard\|ThemeToggle\|AuraBackground\|BetaSignup\|UpgradeTool\|InteractionChooser\|MiniSystemsLibrary\|ReadingModeToggle\|SaveForLater\|TechPeek\|VisitorSnapshotCard\|GlassCard\|components/Hero\|MetaFooter\|paletteGenerator\|components/Providers\|hooks/useTheme" \
  app components lib --include="*.tsx" --include="*.ts"
```
Expected: no output.
