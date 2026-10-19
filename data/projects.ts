// The projects shown on lili-in.bio. The list lives in data/projects.json, which Project Pulse writes when Liam
// presses Publish (he edits it there, not here). It is validated when this module loads, so a bad file fails
// `next build` instead of rendering a wrong page. data/legacy-projects.ts holds the hand-written list it replaced.
import raw from './projects.json';
import { groupByCategory, parseProjectsFile } from '@/lib/projects/loadProjects';
import type { Project } from './projectTypes';

export type { Project, ProjectCategory, ProjectImprovement, ProjectSubLink, ProjectsFile } from './projectTypes';

const file = parseProjectsFile(raw);

// Controls the order sections appear on the page (public-categories.md in Pulse).
export const CATEGORY_ORDER: string[] = file.categories;

export const projects: Project[] = file.projects;

export const projectsByCategory: { category: string; projects: Project[] }[] = groupByCategory(file);
