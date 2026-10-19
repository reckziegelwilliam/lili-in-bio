import type { VisitorSource } from '@/types/visitor';

export interface SourceInput {
  referrer: string;
  search: string;
  hostname: string;
}

const X_HOSTS = ['t.co', 'x.com', 'twitter.com'];

function referrerHost(referrer: string): string {
  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function isHost(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/** Where a visitor came from, from the referrer and utm_source. Pure, so it is testable without a browser. */
export function detectSourceFrom({ referrer, search, hostname }: SourceInput): VisitorSource {
  const ref = referrer.toLowerCase();
  const host = referrerHost(referrer);
  const params = new URLSearchParams(search);
  const utm = params.get('utm_source')?.toLowerCase();

  if (ref.includes('instagram') || utm === 'instagram' || params.has('igshid')) return 'instagram';
  if (ref.includes('tiktok') || utm === 'tiktok') return 'tiktok';
  if (X_HOSTS.some((d) => isHost(host, d)) || utm === 'x' || utm === 'twitter') return 'x';
  if (ref === '' || (hostname !== '' && ref.includes(hostname.toLowerCase()))) return 'direct';
  return 'other';
}
