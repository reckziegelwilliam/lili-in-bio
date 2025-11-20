import type { VisitorSnapshot, AuraSeed } from '@/types/visitor';

/**
 * Simple hash function to convert a string to a number between 0 and 1
 */
function simpleHash(str: string, seed: number = 0): number {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash % 10000) / 10000;
}

/**
 * Generates a deterministic visual seed from a visitor snapshot
 * The same visitor context will always produce the same seed
 */
export function generateVisualSeed(snapshot: VisitorSnapshot): AuraSeed {
  // Create a seed string that combines all relevant visitor attributes
  const seedString = [
    snapshot.source,
    snapshot.deviceType,
    Math.floor(snapshot.localHour / 4), // Group hours into 6 bands (4-hour blocks)
    snapshot.prefersDark ? 'D' : 'L',
    Math.floor(snapshot.visitCount / 3), // Evolve every 3 visits
    snapshot.readingMode,
    snapshot.language.substring(0, 2), // First 2 chars of language
  ].join('|');
  
  // Generate 6 deterministic pseudo-random values
  return {
    s1: simpleHash(seedString, 1),
    s2: simpleHash(seedString, 2),
    s3: simpleHash(seedString, 3),
    s4: simpleHash(seedString, 4),
    s5: simpleHash(seedString, 5),
    s6: simpleHash(seedString, 6),
  };
}

/**
 * Interpolate between two values based on a factor (0-1)
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Convert HSL to RGB string for CSS
 */
export function hslToRgb(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
}

/**
 * Generate an RGBA string with opacity
 */
export function hslToRgba(h: number, s: number, l: number, alpha: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return `rgba(${f(0)}, ${f(8)}, ${f(4)}, ${alpha})`;
}

