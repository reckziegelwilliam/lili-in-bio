import { describe, it, expect } from 'vitest';
import { getCategoryColor, NEUTRAL_CATEGORY_COLOR } from './categoryColors';

describe('getCategoryColor', () => {
  it('colours the categories the site knows', () => {
    expect(getCategoryColor('Writing')).toBe('#ff8fd6');
  });

  it('gives a category it does not know the neutral colour', () => {
    expect(getCategoryColor('Music')).toBe(NEUTRAL_CATEGORY_COLOR);
  });
});
