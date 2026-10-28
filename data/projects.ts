// The projects shown on lili-in.bio. The list lives in data/projects.json, which Project Pulse writes when Liam
// presses Publish (he edits it there, not here). It is validated when this module loads, so a bad file fails
// `next build` instead of rendering a wrong page. data/legacy-projects.ts holds the hand-written list it replaced.
import raw from './projects.json';
import { groupByCategory, parseProjectsFile } from '@/lib/projects/loadProjects';
import { featuredNames, stopgapProjects } from './featured';
import type { Project } from './projectTypes';

export type { Project, ProjectCategory, ProjectImprovement, ProjectSubLink, ProjectsFile, ProjectUpdate, NowItem, OutreachItem, About } from './projectTypes';

const file = parseProjectsFile(raw);

// Controls the order sections appear on the page (public-categories.md in Pulse).
const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const featuredRank = new Map(featuredNames.map((name, i) => [name.toLowerCase(), i + 1]));

/** Marks a project as featured (a page of its own, a place at the top) when its name is in data/featured.ts. */
function withFeatured(project: Project): Project {
  const featuredOrder = featuredRank.get(project.name.toLowerCase());
  return featuredOrder === undefined ? project : { ...project, id: slugOf(project.name), slug: slugOf(project.name), featuredOrder };
}

// Pulse's list is the source. A featured name it doesn't have yet (before the first Publish that includes it) is filled
// from the stopgap records; their categories are added to the end of Pulse's list when Pulse doesn't have them.
const pulseNames = new Set(file.projects.map((p) => p.name.toLowerCase()));
const stopgap = stopgapProjects.filter((p) => !pulseNames.has(p.name.toLowerCase()));

export const CATEGORY_ORDER: string[] = [
  ...file.categories,
  ...stopgap.map((p) => p.category).filter((c, i, all) => all.indexOf(c) === i && !file.categories.includes(c)),
];

export const projects: Project[] = [...stopgap, ...file.projects].map(withFeatured);

/** Pulse's site-wide #public updates, newest first (version 2 exports; empty before that). */
export const updates = [...(file.updates ?? [])].sort((a, b) => b.date.localeCompare(a.date));

/** Pulse's Now, Outreach and About (version 2 exports; empty or undefined before that). */
export const now = file.now ?? [];
export const outreach = file.outreach ?? [];
export const about = file.about;

/** The featured projects, in the order data/featured.ts lists them. */
export const featuredProjects: Project[] = projects
  .filter((p) => p.featuredOrder !== undefined)
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

export const projectsByCategory: { category: string; projects: Project[] }[] = groupByCategory({
  categories: CATEGORY_ORDER,
  projects,
});
