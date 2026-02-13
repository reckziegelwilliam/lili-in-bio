/**
 * Freshness & anticipation intensity calculators for project cards.
 *
 * - "update" items decay over WINDOW_DAYS (7) using an ease-out curve.
 * - "upcoming" items build up over ANTICIPATION_WINDOW_DAYS (365) using an ease-in curve.
 */

import type { ProjectImprovement } from '@/data/projects';

const WINDOW_DAYS = 7;
const ANTICIPATION_WINDOW_DAYS = 365;

// ---------------------------------------------------------------------------
// Update (past) — decays over time
// ---------------------------------------------------------------------------

/**
 * Decay intensity for a past update. Returns 0–1.
 * 1 = just happened, 0 = WINDOW_DAYS old or older.
 * Exponent 1.5 = stays strong for a few days, then tapers.
 */
export function getFreshnessIntensity(
  improvements?: { date: string }[],
): number {
  if (!improvements?.length) return 0;

  const now = Date.now();
  const mostRecentMs = Math.max(
    ...improvements.map((i) => new Date(i.date).getTime()),
  );
  const ageInDays = (now - mostRecentMs) / 86_400_000;

  if (ageInDays > WINDOW_DAYS) return 0;

  return Math.pow(1 - ageInDays / WINDOW_DAYS, 1.5);
}

/**
 * Per-item decay intensity (for individual rows in the collapsible).
 */
export function getItemFreshness(dateStr: string): number {
  const ageInDays = (Date.now() - new Date(dateStr).getTime()) / 86_400_000;
  if (ageInDays > WINDOW_DAYS) return 0;
  return Math.pow(1 - ageInDays / WINDOW_DAYS, 1.5);
}

// ---------------------------------------------------------------------------
// Upcoming (future) — builds up as the date approaches
// ---------------------------------------------------------------------------

/**
 * Anticipation intensity for a future event. Returns 0–1.
 * 0 = 365+ days away, 1 = arriving today (or already passed).
 * Exponent 3.0 = stays quiet for months, ramps hard in the final weeks.
 */
export function getAnticipationIntensity(dateStr: string): number {
  const daysUntil =
    (new Date(dateStr).getTime() - Date.now()) / 86_400_000;

  // Already arrived or passed — full intensity
  if (daysUntil <= 0) return 1;

  // Too far out — no effect yet
  if (daysUntil > ANTICIPATION_WINDOW_DAYS) return 0;

  return Math.pow(1 - daysUntil / ANTICIPATION_WINDOW_DAYS, 3.0);
}

// ---------------------------------------------------------------------------
// Unified helper — picks the right curve based on improvement type
// ---------------------------------------------------------------------------

export interface CardIntensityResult {
  intensity: number;
  type: 'update' | 'upcoming' | null;
}

/**
 * Determine the effective intensity and dominant type for a card.
 * Finds the improvement with the highest intensity (across both types).
 */
export function getCardIntensity(
  improvements?: ProjectImprovement[],
): CardIntensityResult {
  if (!improvements?.length) return { intensity: 0, type: null };

  let best: CardIntensityResult = { intensity: 0, type: null };

  for (const imp of improvements) {
    const value =
      imp.type === 'upcoming'
        ? getAnticipationIntensity(imp.date)
        : getItemFreshness(imp.date);

    if (value > best.intensity) {
      best = { intensity: value, type: imp.type };
    }
  }

  return best;
}

/**
 * Per-item intensity that respects the item's type.
 */
export function getItemIntensity(imp: ProjectImprovement): number {
  return imp.type === 'upcoming'
    ? getAnticipationIntensity(imp.date)
    : getItemFreshness(imp.date);
}
