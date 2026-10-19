/** A deep copy with every object's keys sorted (JavaScript's default sort: UTF-16 code units). */
export function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) out[key] = sortKeys(source[key]);
    return out;
  }
  return value;
}

/** The exact text Project Pulse writes for data/projects.json: sorted keys, two-space indent, final newline. */
export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value), null, 2) + '\n';
}
