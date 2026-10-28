import { describe, it, expect } from 'vitest';
import { outsideLink, projectHref } from './links';
import type { Project } from '@/data/projectTypes';

const base: Project = { name: 'x', href: 'https://x.example', enabled: true, category: 'Tools' };

describe('project links', () => {
  it('sends a featured project to its page and others to their link', () => {
    expect(projectHref({ ...base, slug: 'x' })).toBe('/projects/x');
    expect(projectHref(base)).toBe('https://x.example');
  });

  it('offers the project site only when it is not the project page', () => {
    expect(outsideLink({ ...base, slug: 'x' })).toBe('https://x.example');
    expect(outsideLink({ ...base, slug: 'x', href: 'https://liamrex.world/projects/x' })).toBeNull();
    expect(outsideLink({ ...base, slug: 'x', href: 'https://liamrex.world/projects/x/' })).toBeNull();
    expect(outsideLink({ ...base, href: '/projects/x' })).toBeNull();
  });
});
