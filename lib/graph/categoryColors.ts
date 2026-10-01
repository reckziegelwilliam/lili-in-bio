import type { ProjectCategory } from '@/data/projects';

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  'Climate & Environment': '#5fd6a8',
  'Disaster Recovery': '#ffb86b',
  'Directory': '#8fe3ff',
  'Writing': '#ff8fd6',
  'Tools': '#c88fff',
};

export function getCategoryColor(category: ProjectCategory): string {
  return CATEGORY_COLORS[category];
}
