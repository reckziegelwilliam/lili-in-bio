#!/usr/bin/env node
// One-time seed for Project Pulse's public tables (project-pulse: docs/superpowers/specs/2026-10-18-public-site-export-design.md).
//
//   node scripts/pulse-seed.mjs                         prints today's list (data/legacy-projects.ts) as JSON, for Pulse's importer
//   node scripts/pulse-seed.mjs --format=projects-json  prints the same list as data/projects.json (the format Pulse exports)
//
// It only reads data/legacy-projects.ts and writes to stdout; it never writes a file.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadLegacy() {
  const source = readFileSync(path.join(root, 'data/legacy-projects.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  });
  const mod = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
  return { categories: mod.CATEGORY_ORDER, projects: mod.projects };
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortKeys(value[key]);
    return out;
  }
  return value;
}

// What Pulse's first export of the seeded tables contains: enabled projects only, words as written, no audience yet,
// no recentImprovements (Pulse takes those only from #public log lines), in category order then list order.
function toProjectsJson(legacy) {
  const rank = new Map(legacy.categories.map((c, i) => [c, i]));
  const projects = legacy.projects
    .filter((p) => p.enabled)
    .map((p) => {
      const out = { name: p.name, href: p.href, category: p.category, description: p.description, audience: [] };
      if (p.thumbnail) out.thumbnail = p.thumbnail;
      if (p.subLinks?.length) {
        out.subLinks = p.subLinks.map((l) => (l.description ? { name: l.name, href: l.href, description: l.description } : { name: l.name, href: l.href }));
      }
      return out;
    })
    .sort((a, b) => rank.get(a.category) - rank.get(b.category)); // stable: list order within a category
  return {
    _generated: {
      by: 'scripts/pulse-seed.mjs',
      source: 'data/legacy-projects.ts (one-time seed)',
      note: 'Generated file. Do not edit: it is rewritten.',
    },
    version: 1,
    categories: legacy.categories,
    projects,
  };
}

const format = process.argv.find((a) => a.startsWith('--format='))?.slice('--format='.length) ?? 'legacy';
const legacy = await loadLegacy();
if (format === 'legacy') {
  process.stdout.write(JSON.stringify(sortKeys(legacy), null, 2) + '\n');
} else if (format === 'projects-json') {
  process.stdout.write(JSON.stringify(sortKeys(toProjectsJson(legacy)), null, 2) + '\n');
} else {
  console.error(`unknown --format=${format} (use legacy or projects-json)`);
  process.exit(2);
}
