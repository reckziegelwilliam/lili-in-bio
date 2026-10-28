import { describe, it, expect } from 'vitest';
import { groupByCategory, parseProjectsFile } from './loadProjects';

// Synthetic data only.
function valid(): Record<string, any> {
  return {
    _generated: { by: 'test' },
    version: 1,
    categories: ['Climate & Environment', 'Tools'],
    projects: [
      { name: 'sensor grid', href: 'https://sensors.example', category: 'Climate & Environment', description: 'tiny sensors', audience: ['x'] },
      {
        name: 'word box',
        href: 'https://words.example',
        category: 'Tools',
        description: 'daily games',
        thumbnail: '/thumbnails/w.png',
        recentImprovements: [{ text: 'Chapter 2', date: '2026-03-01', type: 'update' }],
        subLinks: [{ name: 'Alpha', href: 'https://words.example/alpha', description: 'one word' }],
      },
    ],
  };
}

describe('parseProjectsFile', () => {
  it('reads a valid file; every project is enabled and audience defaults to everyone', () => {
    const file = parseProjectsFile(valid());
    expect(file.categories).toEqual(['Climate & Environment', 'Tools']);
    expect(file.projects).toEqual([
      { name: 'sensor grid', href: 'https://sensors.example', enabled: true, category: 'Climate & Environment', description: 'tiny sensors', audience: ['x'] },
      {
        name: 'word box',
        href: 'https://words.example',
        enabled: true,
        category: 'Tools',
        description: 'daily games',
        audience: [],
        thumbnail: '/thumbnails/w.png',
        recentImprovements: [{ text: 'Chapter 2', date: '2026-03-01', type: 'update' }],
        subLinks: [{ name: 'Alpha', href: 'https://words.example/alpha', description: 'one word' }],
      },
    ]);
  });

  it('groups by category in file order and drops empty categories', () => {
    const raw = valid();
    raw.categories = ['Tools', 'Writing', 'Climate & Environment'];
    expect(groupByCategory(parseProjectsFile(raw)).map((g) => [g.category, g.projects.map((p) => p.name)])).toEqual([
      ['Tools', ['word box']],
      ['Climate & Environment', ['sensor grid']],
    ]);
  });

  it('reads a version 2 file, ignoring the sections it does not use yet', () => {
    const raw = valid();
    raw.version = 2;
    raw.now = [{ name: 'x', href: 'https://x.test', text: 't', audience: [] }];
    expect(parseProjectsFile(raw).projects.length).toBe(parseProjectsFile(valid()).projects.length);
  });

  it("reads version 2's updates, and rejects a malformed one", () => {
    const raw = valid();
    raw.version = 2;
    raw.updates = [{ project: 'word box', href: 'https://words.example', date: '2026-10-01', text: 'Chapter 3' }];
    expect(parseProjectsFile(raw).updates).toEqual(raw.updates);
    raw.updates = [{ project: 'word box', href: 'https://words.example', date: 'October', text: 'Chapter 3' }];
    expect(() => parseProjectsFile(raw)).toThrow('updates[0].date must be YYYY-MM-DD');
  });

  it("reads version 2's Now, Outreach and About", () => {
    const raw = valid();
    raw.version = 2;
    raw.now = [{ name: 'word box', href: 'https://words.example', text: 'writing chapter 4', audience: [] }];
    raw.outreach = [{ title: 'Testers', description: 'try the beta', href: 'mailto:me@example.com', kind: 'feedback' }];
    raw.about = { bio: 'hello', contact: 'write any time', links: [{ name: 'site', href: 'https://example.com' }] };
    const file = parseProjectsFile(raw);
    expect(file.now).toEqual(raw.now);
    expect(file.outreach).toEqual(raw.outreach);
    expect(file.about).toEqual(raw.about);
  });

  it('rejects an outreach link that is neither https nor mailto', () => {
    const raw = valid();
    raw.version = 2;
    raw.outreach = [{ title: 'x', description: 'y', href: 'http://plain.example', kind: 'other' }];
    expect(() => parseProjectsFile(raw)).toThrow('outreach[0].href must start with https://');
  });

  it('ignores version 2 sections in a version 1 file', () => {
    const raw = valid();
    raw.about = { bio: 'hello', contact: '', links: [] };
    expect(parseProjectsFile(raw).about).toBeUndefined();
  });

  it('rejects another version', () => {
    const raw = valid();
    raw.version = 3;
    expect(() => parseProjectsFile(raw)).toThrow('data/projects.json: version must be 1 or 2 (it is 3)');
  });

  it('rejects a link that is not https', () => {
    const raw = valid();
    raw.projects[0].href = 'http://sensors.example';
    expect(() => parseProjectsFile(raw)).toThrow('data/projects.json: projects[0].href must start with https://');
  });

  it('accepts a category the site has no colour for, keeping it in file order', () => {
    const raw = valid();
    raw.categories = ['Climate & Environment', 'Music', 'Tools'];
    raw.projects.push({ name: 'band page', href: 'https://band.example', category: 'Music', description: 'songs' });
    const file = parseProjectsFile(raw);
    expect(file.categories).toEqual(['Climate & Environment', 'Music', 'Tools']);
    expect(groupByCategory(file).map((g) => [g.category, g.projects.map((p) => p.name)])).toEqual([
      ['Climate & Environment', ['sensor grid']],
      ['Music', ['band page']],
      ['Tools', ['word box']],
    ]);
  });

  it('rejects a category that is not a non-empty string', () => {
    const raw = valid();
    raw.categories = ['Tools', 7];
    expect(() => parseProjectsFile(raw)).toThrow('categories[1] must be a non-empty string');
  });

  it('rejects a project whose category is not listed', () => {
    const raw = valid();
    raw.projects[1].category = 'Writing';
    expect(() => parseProjectsFile(raw)).toThrow('projects[1].category "Writing" is not in categories');
  });

  it('rejects duplicate names, ignoring case', () => {
    const raw = valid();
    raw.projects[1].name = 'Sensor Grid';
    expect(() => parseProjectsFile(raw)).toThrow('projects[1].name "Sensor Grid" is listed twice');
  });

  it('rejects an empty description', () => {
    const raw = valid();
    raw.projects[0].description = '';
    expect(() => parseProjectsFile(raw)).toThrow('projects[0].description must be a non-empty string');
  });

  it('rejects bad recent progress and sub-links', () => {
    const badDate = valid();
    badDate.projects[1].recentImprovements[0].date = '2026-3-1';
    expect(() => parseProjectsFile(badDate)).toThrow('projects[1].recentImprovements[0].date must be YYYY-MM-DD');
    const badLink = valid();
    badLink.projects[1].subLinks[0].href = 'http://words.example/alpha';
    expect(() => parseProjectsFile(badLink)).toThrow('projects[1].subLinks[0].href must start with https://');
  });

  it('rejects an empty project list', () => {
    const raw = valid();
    raw.projects = [];
    expect(() => parseProjectsFile(raw)).toThrow('projects must be a non-empty array');
  });

  it('rejects a thumbnail outside public/', () => {
    const raw = valid();
    raw.projects[1].thumbnail = 'thumbnails/w.png';
    expect(() => parseProjectsFile(raw)).toThrow('projects[1].thumbnail must be a path under public/, starting with /');
  });
});
