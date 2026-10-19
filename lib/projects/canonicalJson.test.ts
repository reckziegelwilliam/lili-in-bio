import { describe, it, expect } from 'vitest';
import { canonicalStringify } from './canonicalJson';

// The same document and text as testGoldenOutput in project-pulse's SiteExportTests:
// Pulse and this site write data/projects.json byte for byte the same way.
const golden = String.raw`{
  "_generated": {
    "by": "Project Pulse",
    "note": "Generated file. Do not edit: it is rewritten.",
    "source": "public.md, public-links.md, public-categories.md and #public log lines in status/"
  },
  "categories": [
    "Tools",
    "Writing"
  ],
  "projects": [
    {
      "audience": [
        "x"
      ],
      "category": "Writing",
      "description": "fiction — \"one\" chapter\tat a time",
      "href": "https://drip-e.test/a/b",
      "name": "drip-e",
      "recentImprovements": [
        {
          "date": "2026-03-28",
          "text": "Chapter 10",
          "type": "update"
        }
      ],
      "subLinks": [
        {
          "href": "https://example.test/allways",
          "name": "Allways"
        }
      ]
    }
  ],
  "version": 1
}
`;

describe('canonicalStringify', () => {
  it('writes exactly what Project Pulse writes', () => {
    const doc = {
      version: 1,
      projects: [
        {
          subLinks: [{ name: 'Allways', href: 'https://example.test/allways' }],
          recentImprovements: [{ type: 'update', text: 'Chapter 10', date: '2026-03-28' }],
          name: 'drip-e',
          href: 'https://drip-e.test/a/b',
          description: 'fiction — "one" chapter\tat a time',
          category: 'Writing',
          audience: ['x'],
        },
      ],
      categories: ['Tools', 'Writing'],
      _generated: {
        source: 'public.md, public-links.md, public-categories.md and #public log lines in status/',
        note: 'Generated file. Do not edit: it is rewritten.',
        by: 'Project Pulse',
      },
    };
    expect(canonicalStringify(doc)).toBe(golden);
  });

  it('sorts keys by code unit and keeps empty containers on one line', () => {
    expect(canonicalStringify({ b: [], a: {}, B: 1, _x: 2 })).toBe('{\n  "B": 1,\n  "_x": 2,\n  "a": {},\n  "b": []\n}\n');
  });
});
