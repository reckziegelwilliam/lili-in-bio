export interface ProjectImprovement {
  text: string;
  date: string; // ISO date string, e.g. '2026-02-13'
  type: 'update' | 'upcoming';
}

export interface Project {
  name: string;
  href: string;
  enabled: boolean;
  description?: string;
  recentImprovements?: ProjectImprovement[];
}

export const projects: Project[] = [
  {
    name: 'drip-e',
    href: 'https://drip-e.com',
    enabled: true,
    description: 'serialized chapterbook writing by me\n٩(＾◡＾)۶',
    recentImprovements: [
      { text: 'Check In Chapter 9', date: '2026-02-13', type: 'update' },
    ],
  },
  {
    name: 'wefrigerator',
    href: 'https://comm-fridge.vercel.app/',
    enabled: true,
    description: 'find & support community fridges near you\n(✦ ‿ ✦)',
    // no recentImprovements -- card will have zero intensity
  },
  {
    name: 'liams.log',
    href: 'https://liamslog.com',
    enabled: true,
    description: 'exploring community based IOT and governance\nfun Windows 95 GUI\n(＾▽＾)',
    recentImprovements: [
      { text: 'New UI coming soon', date: '2026-02-20', type: 'upcoming' },
    ],
  },
  { name: 'Project 4', href: '#', enabled: false },
  { name: 'Project 5', href: '#', enabled: false },
];
