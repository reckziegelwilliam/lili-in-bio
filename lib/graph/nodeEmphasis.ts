import type { Project } from '@/data/projects';
import { getCardIntensity } from '@/lib/utils/freshness';

export interface NodeEmphasis {
  scaleMultiplier: number;
  emissiveMultiplier: number;
}

const MAX_SCALE_BOOST = 0.35;
const MAX_EMISSIVE_BOOST = 0.6;

/**
 * How much a node's size/glow should be boosted based on how recently its
 * project was worked on. Reuses the same freshness curve that used to
 * drive the old project card glow.
 */
export function computeNodeEmphasis(project: Project): NodeEmphasis {
  const { intensity } = getCardIntensity(project.recentImprovements);
  return {
    scaleMultiplier: 1 + intensity * MAX_SCALE_BOOST,
    emissiveMultiplier: 1 + intensity * MAX_EMISSIVE_BOOST,
  };
}
