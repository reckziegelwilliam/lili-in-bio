import type { ProjectCategory } from '@/data/projectTypes';

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  'Climate & Environment': '#5fd6a8',
  'Disaster Recovery': '#ffb86b',
  'Directory': '#8fe3ff',
  'Writing': '#ff8fd6',
  'Tools': '#c88fff',
};

/** Used for any category data/projects.json names that is not above. */
export const NEUTRAL_CATEGORY_COLOR = '#b4bcc8';

export function getCategoryColor(category: string): string {
  return Object.hasOwn(CATEGORY_COLORS, category) ? CATEGORY_COLORS[category as ProjectCategory] : NEUTRAL_CATEGORY_COLOR;
}
