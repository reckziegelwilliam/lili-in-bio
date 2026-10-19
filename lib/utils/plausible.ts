const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

let initialized = false;

async function ensureInit(): Promise<typeof import('@plausible-analytics/tracker')['track'] | null> {
  if (typeof window === 'undefined' || !plausibleDomain) return null;

  const { init, track } = await import('@plausible-analytics/tracker');

  if (!initialized) {
    initialized = true;
    init({
      domain: plausibleDomain,
      outboundLinks: true,
      captureOnLocalhost: false,
    });
  }

  return track;
}

/**
 * Track a custom event via Plausible.
 * Safe to call server-side (no-ops when window is undefined).
 * Lazy-loads the tracker to avoid SSR issues with `location`.
 */
export function trackEvent(
  eventName: string,
  options?: { props?: Record<string, string> },
): void {
  ensureInit().then((track) => {
    if (track) {
      track(eventName, options ?? {});
    }
  });
}

/** Props for a project link click: where it goes and who clicked (`visitor_source` is the visitor's source). */
export function projectClickProps(destination: string, source: string, device: string): Record<string, string> {
  return { destination, source, device, visitor_source: source };
}
