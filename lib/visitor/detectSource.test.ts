import { describe, it, expect } from 'vitest';
import { detectSourceFrom } from './detectSource';

const at = (referrer: string, search = '') => detectSourceFrom({ referrer, search, hostname: 'lili-in.bio' });

describe('detectSourceFrom', () => {
  it('x: t.co, x.com and twitter.com referrers', () => {
    expect(at('https://t.co/abc123')).toBe('x');
    expect(at('https://x.com/someone/status/1')).toBe('x');
    expect(at('https://mobile.twitter.com/')).toBe('x');
    expect(at('https://twitter.com/')).toBe('x');
  });

  it('x: utm_source=x or twitter, any case', () => {
    expect(at('', '?utm_source=x')).toBe('x');
    expect(at('', '?utm_source=Twitter')).toBe('x');
  });

  it('does not mistake reddit.com for t.co', () => {
    expect(at('https://www.reddit.com/r/climate')).toBe('other');
  });

  it('keeps instagram and tiktok', () => {
    expect(at('https://l.instagram.com/')).toBe('instagram');
    expect(at('', '?igshid=abc')).toBe('instagram');
    expect(at('https://www.tiktok.com/')).toBe('tiktok');
  });

  it('direct: no referrer, or this site', () => {
    expect(at('')).toBe('direct');
    expect(at('https://lili-in.bio/')).toBe('direct');
  });

  it('an empty hostname never makes every referrer direct', () => {
    expect(detectSourceFrom({ referrer: 'https://example.com/', search: '', hostname: '' })).toBe('other');
  });
});
