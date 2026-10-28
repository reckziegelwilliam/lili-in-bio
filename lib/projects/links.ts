import type { Project } from '@/data/projectTypes';

/** A featured project opens its own page; any other project opens straight to its link. */
export function projectHref(project: Project): string {
  return project.slug ? `/projects/${project.slug}` : project.href;
}

/** The project's own site, or null when its link points back at its page here (a project with no site of its own yet). */
export function outsideLink(project: Project): string | null {
  if (!/^https?:\/\//.test(project.href)) return null;
  if (project.slug && new URL(project.href).pathname.replace(/\/$/, '') === `/projects/${project.slug}`) return null;
  return project.href;
}
