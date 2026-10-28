import type { Project } from '@/data/projectTypes';
import {
  AFFINITIES,
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

export function affinityOf(category: string): Affinity {
  return CATEGORY_AFFINITY[category] ?? DEFAULT_AFFINITY;
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
    const affinity = affinityOf(project.category);
    const featured = project.slug ? FEATURED_EXPERIENCE[project.slug] ?? null : null;
    if (featured) {
      stars.push({ id: project.name, project, affinity, color: featured.color, position: featured.position, featured });
      continue;
    }
    const [a, b, c] = hash3(project.name.toLowerCase());
    const [ax, ay, az] = anchor.get(affinity) ?? [0, 0, 0];
    const angle = a * Math.PI * 2;
    const radius = 1.4 + b * 2.2;
    stars.push({
      id: project.name,
      project,
      affinity,
      color: groupColor.get(affinity) ?? '#9BB9D2',
      position: [ax + Math.cos(angle) * radius, ay + Math.sin(angle) * radius * 0.7, az + (c - 0.5) * 3],
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
