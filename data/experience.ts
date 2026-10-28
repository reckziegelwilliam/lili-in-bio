// How the sky presents projects: groups, colours, hand-placed positions and each featured star's motif.
// Presentation only. Names, blurbs, links and categories come from Project Pulse (data/projects.json); anything a
// visitor reads as a sentence about a project belongs there or is written by Liam, so the microcopy slots start empty.

export type Vec3Tuple = [number, number, number];

/** Pulse's categories fold into three groups in the sky and the index. */
export type Affinity = 'climate' | 'tools' | 'worlds';

export interface AffinityGroup {
  id: Affinity;
  label: string;
  color: string;
  /** Where the group's quieter stars gather. */
  anchor: Vec3Tuple;
}

export const AFFINITIES: AffinityGroup[] = [
  { id: 'climate', label: 'climate & community', color: '#85B3A2', anchor: [-4.5, 3.2, -3] },
  { id: 'tools', label: 'tools & data', color: '#9BB9D2', anchor: [9, 5.2, -4] },
  { id: 'worlds', label: 'worlds & writing', color: '#A99BC8', anchor: [10, -2.2, -3] },
];

/** A category Pulse adds later and isn't listed here joins tools & data until it is. */
export const DEFAULT_AFFINITY: Affinity = 'tools';

export const CATEGORY_AFFINITY: Record<string, Affinity> = {
  'Climate & Environment': 'climate',
  'Disaster Recovery': 'climate',
  Directory: 'climate',
  Tools: 'tools',
  Writing: 'worlds',
  Games: 'worlds',
};

export type Motif = 'contour' | 'orbit' | 'eclipse';

export interface FeaturedExperience {
  slug: string;
  /** Hand-placed so the sky keeps the same shape between visits. */
  position: Vec3Tuple;
  motif: Motif;
  color: string;
  /** One line shown when the star is selected. Liam's words only; empty until he writes one. */
  microcopy?: string;
  /** Real project media under public/media/experience/, shown in the focus panel. Nothing shows until set. */
  poster?: string;
  previewVideo?: string;
  /** Required with a poster: what the image shows, for screen readers. */
  mediaAlt?: string;
  /** Optional line under the media. Liam's words. */
  mediaCaption?: string;
}

/** Keyed by the slug data/projects.ts gives each featured project. */
export const FEATURED_EXPERIENCE: Record<string, FeaturedExperience> = {
  terratrace: { slug: 'terratrace', position: [-1.5, 1.2, 0], motif: 'contour', color: '#9FC9B4' },
  longsignal: { slug: 'longsignal', position: [6.2, 3.6, -0.5], motif: 'orbit', color: '#B7CDE2' },
  ashwake: { slug: 'ashwake', position: [4.4, -0.6, 0.8], motif: 'eclipse', color: '#C58162' },
};

export const SKY_COLORS = {
  void: '#060914',
  midnight: '#0C1428',
  starlight: '#ECE8DF',
  silver: '#9BB9D2',
} as const;
