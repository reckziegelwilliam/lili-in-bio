import { describe, it, expect } from 'vitest';
import { affinityOf, layoutSky, placeForAspect, skyCamera } from './layout';
import { skyReducer, initialSkyState } from './state';
import { FEATURED_EXPERIENCE } from '@/data/experience';
import type { Project } from '@/data/projectTypes';

// Synthetic data only.
const project = (name: string, category: string, slug?: string): Project => ({
  name,
  href: `https://${name.replace(/\W/g, '')}.example`,
  enabled: true,
  category,
  ...(slug ? { slug, id: slug, featuredOrder: 1 } : {}),
});

const sample = [
  project('TerraTrace', 'Climate & Environment', 'terratrace'),
  project('sensor grid', 'Climate & Environment'),
  project('word box', 'Directory'),
  project('ledger', 'Tools'),
  project('serial', 'Writing'),
];

describe('layoutSky', () => {
  it('puts featured projects where data/experience.ts says', () => {
    const star = layoutSky(sample).stars.find((s) => s.id === 'TerraTrace');
    expect(star?.position).toEqual(FEATURED_EXPERIENCE.terratrace.position);
    expect(star?.featured?.motif).toBe('contour');
  });

  it('gives every enabled project a star, and no disabled one', () => {
    const hidden = { ...project('hidden', 'Tools'), enabled: false };
    const ids = layoutSky([...sample, hidden]).stars.map((s) => s.id);
    expect(ids).toEqual(sample.map((p) => p.name));
  });

  it('keeps positions when projects are added or reordered', () => {
    const before = layoutSky(sample).stars;
    const after = layoutSky([project('newcomer', 'Tools'), ...sample.slice().reverse()]).stars;
    for (const star of before) {
      expect(after.find((s) => s.id === star.id)?.position).toEqual(star.position);
    }
  });

  it('folds categories into three groups, unknown ones into tools & data', () => {
    expect(affinityOf('Disaster Recovery')).toBe('climate');
    expect(affinityOf('Games')).toBe('worlds');
    expect(affinityOf('Something New')).toBe('tools');
  });

  it("joins quieter stars to their group's featured star only", () => {
    const { links } = layoutSky(sample);
    expect(links).toEqual([{ from: 'TerraTrace', to: 'sensor grid', affinity: 'climate' }, { from: 'TerraTrace', to: 'word box', affinity: 'climate' }]);
  });
});

describe('screen shapes', () => {
  it('uses the authored layout on wide screens and pulls it in on tall ones', () => {
    expect(placeForAspect([6, 2, 1], 1.8)).toEqual([6, 2, 1]);
    const tall = placeForAspect([6, 2, 1], 0.46);
    expect(Math.abs(tall[0])).toBeLessThan(6);
    expect(tall[1]).toBeGreaterThan(2);
    expect(skyCamera(0.46).z).toBeGreaterThan(skyCamera(1.8).z);
  });
});

describe('skyReducer', () => {
  it('focuses a star and goes back to the overview', () => {
    const focused = skyReducer(initialSkyState, { type: 'select', id: 'TerraTrace' });
    expect(focused).toEqual({ mode: 'focused', selected: 'TerraTrace' });
    expect(skyReducer(focused, { type: 'select', id: 'Ashwake' })).toEqual({ mode: 'focused', selected: 'Ashwake' });
    expect(skyReducer(focused, { type: 'back' })).toBe(initialSkyState);
    expect(skyReducer(initialSkyState, { type: 'back' })).toBe(initialSkyState);
  });
});
