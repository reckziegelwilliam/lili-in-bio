import {
  type About,
  type NowItem,
  type OutreachItem,
  type ProjectUpdate,
  type Project,
  type ProjectImprovement,
  type ProjectSubLink,
  type ProjectsFile,
} from '@/data/projectTypes';

/** Why data/projects.json can't be used. Thrown while data/projects.ts loads, so `next build` fails on a bad file. */
export class ProjectsFileError extends Error {
  constructor(message: string) {
    super(`data/projects.json: ${message}`);
    this.name = 'ProjectsFileError';
  }
}

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new ProjectsFileError(message);
}

function text(o: Obj, key: string, where: string): string {
  const value = o[key];
  if (typeof value !== 'string' || value.trim() === '') fail(`${where}.${key} must be a non-empty string`);
  return value;
}

function optionalText(o: Obj, key: string, where: string): string | undefined {
  return o[key] === undefined ? undefined : text(o, key, where);
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function httpsUrl(o: Obj, key: string, where: string): string {
  const value = text(o, key, where);
  const url = parseUrl(value);
  if (!url) fail(`${where}.${key} is not a valid URL`);
  if (url.protocol !== 'https:') fail(`${where}.${key} must start with https://`);
  return value;
}

/** https, or a mailto: link (Pulse only lets Liam's own address through). */
function linkUrl(o: Obj, key: string, where: string): string {
  const value = text(o, key, where);
  if (/^mailto:[^@\s]+@[^@\s]+$/i.test(value)) return value;
  return httpsUrl(o, key, where);
}

function list(raw: Obj, key: string): unknown[] {
  const value = raw[key];
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(`${key} must be an array`);
  return value;
}

function strings(value: unknown, where: string): string[] {
  if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) fail(`${where} must be an array of strings`);
  return value as string[];
}

function improvements(value: unknown, where: string): ProjectImprovement[] {
  if (!Array.isArray(value)) fail(`${where} must be an array`);
  return value.map((item: unknown, i: number) => {
    const w = `${where}[${i}]`;
    if (!isObj(item)) fail(`${w} must be an object`);
    const date = text(item, 'date', w);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`${w}.date must be YYYY-MM-DD`);
    const type = item.type;
    if (type !== 'update' && type !== 'upcoming') fail(`${w}.type must be "update" or "upcoming"`);
    return { text: text(item, 'text', w), date, type };
  });
}

function subLinks(value: unknown, where: string): ProjectSubLink[] {
  if (!Array.isArray(value)) fail(`${where} must be an array`);
  return value.map((item: unknown, i: number) => {
    const w = `${where}[${i}]`;
    if (!isObj(item)) fail(`${w} must be an object`);
    const link: ProjectSubLink = { name: text(item, 'name', w), href: httpsUrl(item, 'href', w) };
    const description = optionalText(item, 'description', w);
    if (description !== undefined) link.description = description;
    return link;
  });
}

/** Validates data/projects.json (written by Project Pulse) and returns the site's types. Unknown keys are ignored. */
export function parseProjectsFile(raw: unknown): ProjectsFile {
  if (!isObj(raw)) fail('the file must hold a JSON object');
  // Version 2 adds Now, Updates, Outreach and About, which this site doesn't read yet; Work is the same in both.
  if (raw.version !== 1 && raw.version !== 2) fail(`version must be 1 or 2 (it is ${JSON.stringify(raw.version)})`);

  const rawCategories = raw.categories;
  if (!Array.isArray(rawCategories) || rawCategories.length === 0) fail('categories must be a non-empty array');
  // Any non-empty category name is fine: one the site has no colour for renders in a neutral colour.
  const categories = rawCategories.map((c: unknown, i: number): string => {
    if (typeof c !== 'string' || c.trim() === '') fail(`categories[${i}] must be a non-empty string`);
    return c;
  });
  const repeated = categories.find((c, i) => categories.indexOf(c) !== i);
  if (repeated) fail(`categories lists ${JSON.stringify(repeated)} twice`);

  const rawProjects = raw.projects;
  if (!Array.isArray(rawProjects) || rawProjects.length === 0) fail('projects must be a non-empty array');
  const seen = new Set<string>();
  const projects = rawProjects.map((p: unknown, i: number): Project => {
    const where = `projects[${i}]`;
    if (!isObj(p)) fail(`${where} must be an object`);
    const name = text(p, 'name', where);
    if (seen.has(name.toLowerCase())) fail(`${where}.name ${JSON.stringify(name)} is listed twice`);
    seen.add(name.toLowerCase());
    const category = text(p, 'category', where);
    if (!categories.includes(category)) fail(`${where}.category ${JSON.stringify(category)} is not in categories`);
    const project: Project = {
      name,
      href: httpsUrl(p, 'href', where),
      enabled: true,
      category,
      description: text(p, 'description', where),
      audience: p.audience === undefined ? [] : strings(p.audience, `${where}.audience`),
    };
    const thumbnail = optionalText(p, 'thumbnail', where);
    if (thumbnail !== undefined) {
      if (!thumbnail.startsWith('/') || thumbnail.split('/').includes('..')) {
        fail(`${where}.thumbnail must be a path under public/, starting with /`);
      }
      project.thumbnail = thumbnail;
    }
    if (p.recentImprovements !== undefined) project.recentImprovements = improvements(p.recentImprovements, `${where}.recentImprovements`);
    if (p.subLinks !== undefined) project.subLinks = subLinks(p.subLinks, `${where}.subLinks`);
    return project;
  });

  // Version 2's sections: site-wide updates (Pulse's #public log lines), Now, Outreach and About.
  const v2 = raw.version === 2;
  const updates: ProjectUpdate[] = (v2 ? list(raw, 'updates') : []).map((u: unknown, i: number) => {
    const where = `updates[${i}]`;
    if (!isObj(u)) fail(`${where} must be an object`);
    const date = text(u, 'date', where);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`${where}.date must be YYYY-MM-DD`);
    return { project: text(u, 'project', where), href: httpsUrl(u, 'href', where), date, text: text(u, 'text', where) };
  });
  const now: NowItem[] = (v2 ? list(raw, 'now') : []).map((n: unknown, i: number) => {
    const where = `now[${i}]`;
    if (!isObj(n)) fail(`${where} must be an object`);
    return {
      name: text(n, 'name', where),
      href: httpsUrl(n, 'href', where),
      text: text(n, 'text', where),
      audience: n.audience === undefined ? [] : strings(n.audience, `${where}.audience`),
    };
  });
  const outreach: OutreachItem[] = (v2 ? list(raw, 'outreach') : []).map((o: unknown, i: number) => {
    const where = `outreach[${i}]`;
    if (!isObj(o)) fail(`${where} must be an object`);
    return { title: text(o, 'title', where), description: text(o, 'description', where), href: linkUrl(o, 'href', where), kind: text(o, 'kind', where) };
  });
  let about: About | undefined;
  if (v2 && raw.about !== undefined) {
    const a = raw.about;
    if (!isObj(a)) fail('about must be an object');
    about = {
      bio: text(a, 'bio', 'about'),
      contact: typeof a.contact === 'string' ? a.contact : '',
      links: list(a, 'links').map((l: unknown, i: number) => {
        const where = `about.links[${i}]`;
        if (!isObj(l)) fail(`${where} must be an object`);
        return { name: text(l, 'name', where), href: linkUrl(l, 'href', where) };
      }),
    };
  }

  return { categories, projects, updates, now, outreach, about };
}

/** Projects grouped in category order; categories with no projects are left out. */
export function groupByCategory(file: ProjectsFile): { category: string; projects: Project[] }[] {
  return file.categories
    .map((category) => ({ category, projects: file.projects.filter((p) => p.category === category) }))
    .filter((group) => group.projects.length > 0);
}
