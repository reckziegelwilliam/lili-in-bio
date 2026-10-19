import type { Project } from '@/data/projectTypes';

/** True when the project lists this visitor source in its audience (set in Pulse's public.md). */
export function matchesAudience(project: Project, source: string | null | undefined): boolean {
  return !!source && (project.audience ?? []).includes(source);
}

/** Projects in category order; within a category, the ones meant for this visitor first, otherwise list order. */
export function orderForVisitor(
  projects: Project[],
  categoryOrder: readonly string[],
  source: string | null | undefined,
): Project[] {
  const rank = new Map(categoryOrder.map((c, i) => [c, i]));
  return projects
    .map((project, index) => ({ project, index }))
    .sort(
      (a, b) =>
        (rank.get(a.project.category) ?? categoryOrder.length) - (rank.get(b.project.category) ?? categoryOrder.length) ||
        Number(matchesAudience(b.project, source)) - Number(matchesAudience(a.project, source)) ||
        a.index - b.index,
    )
    .map(({ project }) => project);
}
