import type { Project } from '@/data/projects';
import { matchesAudience } from '@/lib/projects/audience';
import { getCardIntensity } from '@/lib/utils/freshness';

export interface NodeEmphasis {
  scaleMultiplier: number;
  emissiveMultiplier: number;
}

const MAX_SCALE_BOOST = 0.35;
const MAX_EMISSIVE_BOOST = 0.6;
const AUDIENCE_SCALE_BOOST = 0.2;
const AUDIENCE_EMISSIVE_BOOST = 0.4;

/**
 * How much a node's size/glow should be boosted: by how recently its project was worked on (the same freshness
 * curve that used to drive the old project card glow), plus a fixed boost when the project is meant for the
 * visitor's source.
 */
export function computeNodeEmphasis(project: Project, visitorSource?: string | null): NodeEmphasis {
  const { intensity } = getCardIntensity(project.recentImprovements);
  const audience = matchesAudience(project, visitorSource) ? 1 : 0;
  return {
    scaleMultiplier: 1 + intensity * MAX_SCALE_BOOST + audience * AUDIENCE_SCALE_BOOST,
    emissiveMultiplier: 1 + intensity * MAX_EMISSIVE_BOOST + audience * AUDIENCE_EMISSIVE_BOOST,
  };
}
