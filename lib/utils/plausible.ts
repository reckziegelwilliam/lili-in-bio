import { init, track } from '@plausible-analytics/tracker';

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

if (plausibleDomain && typeof window !== 'undefined') {
  init({
    domain: plausibleDomain,
    outboundLinks: true,
    captureOnLocalhost: false,
  });
}

/**
 * Track a custom event via Plausible.
 * Safe to call server-side (no-ops when window is undefined).
 */
export function trackEvent(
  eventName: string,
  options?: { props?: Record<string, string> },
): void {
  if (typeof window === 'undefined' || !plausibleDomain) return;
  track(eventName, options ?? {});
}
