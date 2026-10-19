import { describe, it, expect } from 'vitest';
import { matchesAudience, orderForVisitor } from './audience';
import type { Project, ProjectCategory } from '@/data/projectTypes';

const p = (name: string, category: ProjectCategory, audience?: string[]): Project => ({
  name,
  href: `https://${name}.test`,
  enabled: true,
  category,
  audience,
});

const list = [p('a', 'Writing'), p('b', 'Tools', ['x']), p('c', 'Writing', ['x', 'instagram']), p('d', 'Tools')];
const order = ['Writing', 'Tools'];
const names = (ps: Project[]) => ps.map((x) => x.name);

describe('audience', () => {
  it('matches only a listed source', () => {
    expect(matchesAudience(list[2], 'x')).toBe(true);
    expect(matchesAudience(list[2], 'tiktok')).toBe(false);
    expect(matchesAudience(list[2], null)).toBe(false);
    expect(matchesAudience(list[0], 'x')).toBe(false);
  });

  it('keeps category order and list order for everyone else', () => {
    expect(names(orderForVisitor(list, order, 'direct'))).toEqual(['a', 'c', 'b', 'd']);
    expect(names(orderForVisitor(list, order, null))).toEqual(['a', 'c', 'b', 'd']);
  });

  it('lists projects meant for the visitor first within their category', () => {
    expect(names(orderForVisitor(list, order, 'x'))).toEqual(['c', 'a', 'b', 'd']);
  });

  it('never moves a project out of its category', () => {
    expect(names(orderForVisitor(list, order, 'instagram'))).toEqual(['c', 'a', 'b', 'd']);
    expect(names(orderForVisitor([list[1], list[0]], order, 'x'))).toEqual(['a', 'b']);
  });
});
