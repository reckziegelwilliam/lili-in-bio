export interface ProjectImprovement {
  text: string;
  date: string; // ISO date string, e.g. '2026-02-13'
  type: 'update' | 'upcoming';
}

export interface ProjectSubLink {
  name: string;
  href: string;
  description?: string;
}

/** Categories this site has a colour for (lib/graph/categoryColors.ts). Any other category gets a neutral colour. */
export const KNOWN_CATEGORIES = [
  'Climate & Environment',
  'Disaster Recovery',
  'Directory',
  'Writing',
  'Tools',
  'Games',
] as const;

export type ProjectCategory = (typeof KNOWN_CATEGORIES)[number];

export interface Project {
  name: string;
  href: string;
  enabled: boolean;
  /** Usually one of KNOWN_CATEGORIES; data/projects.json may name others, which render in a neutral colour. */
  category: string;
  description?: string;
  thumbnail?: string;
  recentImprovements?: ProjectImprovement[];
  subLinks?: ProjectSubLink[];
  /** Visitor sources this project is emphasised for (`x`, `instagram`, `climate`); empty or missing = everyone. */
  audience?: string[];
  /** Featured projects (named in data/featured.ts) only. Stable across renames, so URLs and analytics keep working. */
  id?: string;
  /** Featured projects only: the project's page is /projects/<slug>. */
  slug?: string;
  /** Featured projects only: 1 is shown first. */
  featuredOrder?: number;
}

export interface ProjectsFile {
  categories: string[];
  projects: Project[];
}
