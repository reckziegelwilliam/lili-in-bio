// Which projects are featured on lili-in.bio, and in what order. Their words (blurb, link, category) belong to Project
// Pulse and arrive in data/projects.json when Liam presses Publish; only the presentation lives here.
import type { Project } from './projectTypes';

export const featuredNames = ['Longsignal', 'TerraTrace', 'Ashwake'] as const;

// A stopgap for the first Publish: the same rows now in Pulse's public.md, used only while data/projects.json lacks a
// featured name. Once Publish has written them, these are ignored and can be deleted.
export const stopgapProjects: Project[] = [
  {
    name: 'Longsignal',
    href: 'https://longsignal.app',
    enabled: true,
    category: 'Tools',
    description: 'Indie business data for early-stage founders.',
    audience: [],
  },
  {
    name: 'TerraTrace',
    href: 'https://liamrex.world/projects/terratrace',
    enabled: true,
    category: 'Climate & Environment',
    description: '3D climate insights for field research.',
    audience: [],
  },
  {
    name: 'Ashwake',
    href: 'https://liamrex.world/projects/ashwake',
    enabled: true,
    category: 'Games',
    description: 'A dark-fantasy horror RPG in Unreal.',
    audience: [],
  },
];
