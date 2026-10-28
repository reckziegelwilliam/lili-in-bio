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

/** One dated #public log line from Pulse's version 2 export, across all public projects. */
export interface ProjectUpdate {
  /** The public row's name. */
  project: string;
  href: string;
  date: string; // YYYY-MM-DD
  text: string;
}

/** A current project with its one-line Now text (Pulse: in a focus slot, or building/launched on Liam's move). */
export interface NowItem {
  name: string;
  href: string;
  text: string;
  audience: string[];
}

/** An invitation Liam publishes (collaborate · hire · feedback · other). Link: https, or mailto his own address. */
export interface OutreachItem {
  title: string;
  description: string;
  href: string;
  kind: string;
}

export interface About {
  bio: string;
  links: { name: string; href: string }[];
  contact: string;
}

export interface ProjectsFile {
  categories: string[];
  projects: Project[];
  /** The rest are version 2 only; empty (or undefined, for about) in version 1. */
  updates?: ProjectUpdate[];
  now?: NowItem[];
  outreach?: OutreachItem[];
  about?: About;
}
