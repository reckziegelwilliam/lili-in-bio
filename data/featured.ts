// The projects Liam is working on now, written by hand in this repo. data/projects.json is rewritten by Project Pulse,
// so these live apart from it and data/projects.ts puts them in front of that list.
import type { Project } from './projectTypes';

export const featuredProjects: Project[] = [
  {
    id: 'longsignal',
    slug: 'longsignal',
    name: 'Longsignal',
    href: 'https://longsignal.app',
    enabled: true,
    category: 'Tools',
    description: 'Indie business data for early-stage founders.',
    stage: 'in progress',
    featuredOrder: 1,
    audience: [],
  },
  {
    id: 'terratrace',
    slug: 'terratrace',
    name: 'TerraTrace',
    // No public site yet: the page that explains it is /projects/terratrace.
    href: '/projects/terratrace',
    enabled: true,
    category: 'Climate & Environment',
    description: '3D climate insights for field research.',
    stage: 'in progress',
    featuredOrder: 2,
    audience: [],
  },
  {
    id: 'ashwake',
    slug: 'ashwake',
    name: 'Ashwake',
    // No public site yet: the page that explains it is /projects/ashwake.
    href: '/projects/ashwake',
    enabled: true,
    category: 'Games',
    description: 'A dark-fantasy horror RPG.',
    stage: 'in progress',
    featuredOrder: 3,
    audience: [],
  },
];
