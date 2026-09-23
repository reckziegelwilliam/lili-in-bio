export interface ProjectImprovement {
  text: string;
  date: string; // ISO date string, e.g. '2026-02-13'
  type: 'update' | 'upcoming';
}

export interface ProjectSubLink {
  name: string;
  href: string;
  description?: string;
}

export type ProjectCategory =
  | 'Climate & Environment'
  | 'Disaster Recovery'
  | 'Directory'
  | 'Writing'
  | 'Tools';

// Controls the order sections appear on the page.
export const CATEGORY_ORDER: ProjectCategory[] = [
  'Climate & Environment',
  'Disaster Recovery',
  'Directory',
  'Writing',
  'Tools',
];

export interface Project {
  name: string;
  href: string;
  enabled: boolean;
  category: ProjectCategory;
  description?: string;
  thumbnail?: string;
  recentImprovements?: ProjectImprovement[];
  subLinks?: ProjectSubLink[];
}

export const projects: Project[] = [
  {
    name: 'oesis',
    href: 'https://infreeformation.com',
    enabled: true,
    category: 'Climate & Environment',
    description: 'open, low-cost climate sensors for your block -- real heat & water data, piloting in an LA community garden. the project that matters most to me',
  },
  {
    name: 'wildready (readyforthewild.com)',
    href: 'https://readyforthewild.com',
    enabled: true,
    category: 'Climate & Environment',
    description: 'wildfire-readiness tool for homeowners -- assess & document home hardening, then export an insurer-ready proof packet. piloting with select CA counties',
  },
  {
    name: 'recovery navigator',
    href: 'https://recovery-navigator.vercel.app',
    enabled: true,
    category: 'Disaster Recovery',
    description: 'a personalized, step-by-step plan for what to do (and who to actually contact) after a disaster -- free, no account',
  },
  {
    name: 'response desk',
    href: 'https://app.responsedesk.org',
    enabled: true,
    category: 'Disaster Recovery',
    description: 'turns an official FEMA or insurer notice into a plain-language checklist and a response packet you send yourself -- free, no account',
  },
  {
    name: 'wefrigerator',
    href: 'https://comm-fridge.vercel.app/',
    enabled: true,
    category: 'Directory',
    description: 'find & support community fridges near you',
    thumbnail: '/thumbnails/wefrigerator.png',
  },
  {
    name: 'thisshouldbefun',
    href: 'https://thismightbefun.com',
    enabled: true,
    category: 'Directory',
    description: 'a small directory of daily word games -- one each morning, five minutes, no account needed',
    subLinks: [
      {
        name: 'Allways',
        href: 'https://thismightbefun.com/allways',
        description: 'one hidden word, four different clues',
      },
      {
        name: 'Blankly',
        href: 'https://thismightbefun.com/blankly',
        description: 'find the one word that fits every blank',
      },
      {
        name: 'Rule',
        href: 'https://thismightbefun.com/rule',
        description: 'figure out the rule, then prove you have it',
      },
    ],
  },
  {
    name: 'liams.log',
    href: 'https://liamslog.com',
    enabled: true,
    category: 'Writing',
    description: 'my personal journal -- writing on community tech, IoT, and governance',
    thumbnail: '/thumbnails/liamslog.png',
  },
  {
    name: 'drip-e',
    href: 'https://drip-e.com',
    enabled: true,
    category: 'Writing',
    description: 'original serialized fiction, one chapter at a time',
    thumbnail: '/thumbnails/dripe.png',
    recentImprovements: [
      { text: 'Check In Chapter 10', date: '2026-03-28', type: 'update' },
      { text: 'Check In Chapter 9', date: '2026-02-13', type: 'update' },
    ],
  },
  {
    name: 'artistOS',
    href: 'https://getartistos.com',
    enabled: true,
    category: 'Tools',
    description: 'runs the business behind being a musician -- releases, gigs, invoices, and bookings in one place',
  },
];

export const projectsByCategory: { category: ProjectCategory; projects: Project[] }[] =
  CATEGORY_ORDER
    .map((category) => ({
      category,
      projects: projects.filter((p) => p.category === category),
    }))
    .filter((group) => group.projects.length > 0);
