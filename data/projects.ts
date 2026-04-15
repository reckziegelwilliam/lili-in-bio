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
  thumbnail?: string;
  recentImprovements?: ProjectImprovement[];
}

export const projects: Project[] = [
  {
    name: 'oesis',
    href: 'https://infreeformation.com',
    enabled: true,
    description: 'of all these projects, this is the only one that matters to me',
  },
  {
    name: 'ready for the wild',
    href: 'https://readyforthewild.app',
    enabled: true,
    description: 'post la wildfire development -- thank you to those who submitted/sent form',
  },
  {
    name: 'liams.log',
    href: 'https://liamslog.com',
    enabled: true,
    description: 'exploring community based IOT and governance\n(＾▽＾)',
    thumbnail: '/thumbnails/liamslog.png',
    recentImprovements: [
      { text: 'New Systemics View', date: '2026-02-20', type: 'upcoming' },
    ],
  },
  {
    name: 'wefrigerator',
    href: 'https://comm-fridge.vercel.app/',
    enabled: true,
    description: 'find & support community fridges near you\n(✦ ‿ ✦)',
    thumbnail: '/thumbnails/wefrigerator.png',
  },
  {
    name: 'drip-e',
    href: 'https://drip-e.com',
    enabled: true,
    description: 'serialized chapterbook writing by me\n٩(＾◡＾)۶',
    thumbnail: '/thumbnails/dripe.png',
    recentImprovements: [
      { text: 'Submitted Check In to Publisher', date: '2026-02-14', type: 'upcoming' },
      { text: 'Check In Chapter 10', date: '2026-03-28', type: 'update' },
      { text: 'Check In Chapter 9', date: '2026-02-13', type: 'update' },
    ],
  },
];
