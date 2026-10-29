import type { Project } from '@/data/projectTypes';
import {
  AFFINITIES,
  AFFINITY_OVERRIDE,
  CATEGORY_AFFINITY,
  DEFAULT_AFFINITY,
  FEATURED_EXPERIENCE,
  type Affinity,
  type FeaturedExperience,
  type Vec3Tuple,
} from '@/data/experience';

export interface SkyStar {
  id: string;
  project: Project;
  affinity: Affinity;
  color: string;
  position: Vec3Tuple;
  /** Set for the featured three; null for the quieter stars. */
  featured: FeaturedExperience | null;
}

export interface SkyLink {
  from: string;
  to: string;
  affinity: Affinity;
}

export interface SkyLayout {
  stars: SkyStar[];
  /** Each quieter star joined to its group's featured star (or nothing, if the group has none). */
  links: SkyLink[];
}

export function affinityOf(category: string, name?: string): Affinity {
  return (name && AFFINITY_OVERRIDE[name.toLowerCase()]) || CATEGORY_AFFINITY[category] || DEFAULT_AFFINITY;
}

/** FNV-1a, so a project keeps its place across reloads and builds; three independent values in [0, 1). */
function hash3(text: string): [number, number, number] {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const a = (h >>> 0) / 2 ** 32;
  const b = (Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0) / 2 ** 32;
  const c = (Math.imul(h ^ (h >>> 13), 0x297a2d39) >>> 0) / 2 ** 32;
  return [a, b, c];
}

/**
 * Places every enabled project: featured ones where data/experience.ts puts them, the rest around their group's
 * anchor at a spot derived from the name. Adding a project never moves the others.
 */
export function layoutSky(projects: Project[]): SkyLayout {
  const stars: SkyStar[] = [];
  const groupColor = new Map(AFFINITIES.map((g) => [g.id, g.color]));
  const anchor = new Map(AFFINITIES.map((g) => [g.id, g.anchor]));

  for (const project of projects.filter((p) => p.enabled)) {
    const affinity = affinityOf(project.category, project.name);
    const featured = project.slug ? FEATURED_EXPERIENCE[project.slug] ?? null : null;
    if (featured) {
      stars.push({ id: project.name, project, affinity, color: featured.color, position: featured.position, featured });
      continue;
    }
    const [a, b, c] = hash3(project.name.toLowerCase());
    const [ax, ay, az] = anchor.get(affinity) ?? [0, 0, 0];
    // A quiet star that lands on another one is swung around its group's anchor until it has room.
    const place = (turn: number): Vec3Tuple => {
      const angle = a * Math.PI * 2 + turn * 0.5;
      const radius = 1.4 + b * 2.2 + turn * 0.15;
      return [ax + Math.cos(angle) * radius, ay + Math.sin(angle) * radius * 0.7, az + (c - 0.5) * 3];
    };
    const crowded = (q: Vec3Tuple) => stars.some((o) => Math.hypot(o.position[0] - q[0], o.position[1] - q[1]) < 0.6);
    let turn = 0;
    while (turn < 8 && crowded(place(turn))) turn++;
    stars.push({
      id: project.name,
      project,
      affinity,
      color: groupColor.get(affinity) ?? '#9BB9D2',
      position: place(turn),
      featured: null,
    });
  }

  const featuredByAffinity = new Map(stars.filter((s) => s.featured).map((s) => [s.affinity, s.id]));
  const links: SkyLink[] = stars
    .filter((s) => !s.featured && featuredByAffinity.has(s.affinity))
    .map((s) => ({ from: featuredByAffinity.get(s.affinity) as string, to: s.id, affinity: s.affinity }));

  return { stars, links };
}

/** 0 on a tall phone screen, 1 on a wide desktop one. */
export function wideness(aspect: number): number {
  return Math.min(1, Math.max(0, (aspect - 0.45) / (1.6 - 0.45)));
}

/**
 * Where a star sits on a screen of this shape. Wide screens use the authored layout; tall ones pull it toward the
 * middle horizontally and stretch it vertically, while the camera steps back (skyCamera) to keep everything in frame.
 */
export function placeForAspect(p: Vec3Tuple, aspect: number): Vec3Tuple {
  const t = wideness(aspect);
  const sx = 0.55 + 0.45 * t;
  const sy = 1 + (1 - t) * 0.2;
  return [(p[0] - 3.2 * (1 - t)) * sx, p[1] * sy, p[2]];
}

/** The camera's resting distance and the height it looks at: further back and aimed lower on tall screens, so the sky sits above the intro text. */
export function skyCamera(aspect: number): { x: number; y: number; z: number } {
  const t = wideness(aspect);
  return { x: 2 * t, y: -1.6 - (1 - t) * 2.8, z: 24 + (1 - t) * 16 };
}

export interface LabelPlan {
  /** Featured labels sit beside their star on wide screens and below it on tall ones; quiet labels take either side. */
  side: 'right' | 'left' | 'below';
  /** Pixels to nudge the label down (negative: up) so it clears its neighbours. */
  dy: number;
}

interface Box { x0: number; y0: number; x1: number; y1: number; weight?: number }

const overlaps = (a: Box, b: Box) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

/**
 * Where each star's name goes, so labels stay on screen and off each other. Works from an approximation of the camera
 * (straight on, at rest) and of text size, which is enough to separate labels on a phone; the sky itself is untouched.
 */
export function planLabels(stars: SkyStar[], aspect: number, size: { width: number; height: number }): Map<string, LabelPlan> {
  const { width: W, height: H } = size;
  const cam = skyCamera(aspect);
  const wide = wideness(aspect);
  const margin = 8;
  const project = (p: Vec3Tuple) => {
    const ppu = H / (2 * Math.tan((40 * Math.PI) / 360) * Math.max(cam.z - p[2], 1));
    return { x: W / 2 + (p[0] - cam.x) * ppu, y: H / 2 - (p[1] - cam.y) * ppu, ppu };
  };

  const plans = new Map<string, LabelPlan>();
  const taken: Box[] = [];
  const placed = stars.map((s) => ({ s, pos: placeForAspect(s.position, aspect) }));

  // Featured first: their rings and names are fixed obstacles for the quieter labels.
  for (const { s, pos } of placed.filter((p) => p.s.featured)) {
    const { x, y, ppu } = project(pos);
    const ring = 1.9 * ppu;
    // The rings are flatter than they are wide.
    taken.push({ x0: x - ring, y0: y - ring * 0.65, x1: x + ring, y1: y + ring * 0.65, weight: 25 });
    const w = s.project.name.length * 8.6;
    if (wide < 0.5) {
      const x0 = Math.min(Math.max(x - w / 2, margin), W - margin - w);
      taken.push({ x0, y0: y + ring * 0.65, x1: x0 + w, y1: y + ring * 0.65 + 28 });
      plans.set(s.id, { side: 'below', dy: 0 });
    } else {
      plans.set(s.id, { side: 'right', dy: 0 });
    }
  }

  for (const { s, pos } of placed.filter((p) => !p.s.featured)) {
    const { x, y } = project(pos);
    const w = s.project.name.length * 5.4 + 6;
    const options: LabelPlan[] = [];
    for (const dy of [0, -14, 14, -28, 28, -42, 42]) options.push({ side: 'right', dy }, { side: 'left', dy });
    const boxOf = (o: LabelPlan): Box => {
      const x0 = o.side === 'right' ? x + 10 : x - 10 - w;
      return { x0, y0: y + o.dy - 8, x1: x0 + w, y1: y + o.dy + 8 };
    };
    // Overlap with what is already placed, plus a heavy penalty for leaving the screen; the least bad option wins.
    const cost = (o: LabelPlan) => {
      const b = boxOf(o);
      let c = taken.reduce((sum, t) => sum + (overlaps(b, t) ? t.weight ?? 100 : 0), 0) + Math.abs(o.dy) * 3;
      if (b.x0 < margin || b.x1 > W - margin) c += 1000;
      return c;
    };
    const chosen = options.reduce((best, o) => (cost(o) < cost(best) ? o : best), options[0]);
    const box = boxOf(chosen);
    plans.set(s.id, chosen);
    // Dot first, so later labels also avoid this one's star.
    taken.push(box);
    taken.push({ x0: x - 6, y0: y - 6, x1: x + 6, y1: y + 6 });
  }
  return plans;
}
