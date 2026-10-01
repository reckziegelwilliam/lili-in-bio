import { describe, it, expect } from 'vitest';
import { computeNodeEmphasis } from './nodeEmphasis';
import type { Project } from '@/data/projects';

const base: Project = {
  name: 'test',
  href: 'https://test.example',
  enabled: true,
  category: 'Tools',
};

describe('computeNodeEmphasis', () => {
  it('returns no boost for a project with no recent improvements', () => {
    const emphasis = computeNodeEmphasis(base);
    expect(emphasis.scaleMultiplier).toBe(1);
    expect(emphasis.emissiveMultiplier).toBe(1);
  });

  it('boosts scale and emissive intensity for a project updated today', () => {
    const today = new Date().toISOString().slice(0, 10);
    const fresh: Project = {
      ...base,
      recentImprovements: [{ text: 'shipped', date: today, type: 'update' }],
    };
    const emphasis = computeNodeEmphasis(fresh);
    expect(emphasis.scaleMultiplier).toBeGreaterThan(1);
    expect(emphasis.emissiveMultiplier).toBeGreaterThan(1);
  });

  it('gives a stale update (far outside the 7-day decay window) the baseline multiplier', () => {
    const stale: Project = {
      ...base,
      recentImprovements: [{ text: 'old news', date: '2020-01-01', type: 'update' }],
    };
    const emphasis = computeNodeEmphasis(stale);
    expect(emphasis.scaleMultiplier).toBe(1);
    expect(emphasis.emissiveMultiplier).toBe(1);
  });
});
