// The projects shown on lili-in.bio. The list lives in data/projects.json, which Project Pulse writes when Liam
// presses Publish (he edits it there, not here). It is validated when this module loads, so a bad file fails
// `next build` instead of rendering a wrong page. data/legacy-projects.ts holds the hand-written list it replaced.
import raw from './projects.json';
import { groupByCategory, parseProjectsFile } from '@/lib/projects/loadProjects';
import { featuredProjects } from './featured';
import type { Project } from './projectTypes';

export type { Project, ProjectCategory, ProjectImprovement, ProjectSubLink, ProjectsFile } from './projectTypes';

const file = parseProjectsFile(raw);

// Controls the order sections appear on the page (public-categories.md in Pulse).
// Featured projects come first; their categories are added to the end of Pulse's list when Pulse doesn't have them.
const pulseNames = new Set(file.projects.map((p) => p.name.toLowerCase()));
const featured = featuredProjects.filter((p) => !pulseNames.has(p.name.toLowerCase()));

export const CATEGORY_ORDER: string[] = [
  ...file.categories,
  ...featured.map((p) => p.category).filter((c, i, all) => all.indexOf(c) === i && !file.categories.includes(c)),
];

export const projects: Project[] = [...featured, ...file.projects];

export const projectsByCategory: { category: string; projects: Project[] }[] = groupByCategory({
  categories: CATEGORY_ORDER,
  projects,
});
