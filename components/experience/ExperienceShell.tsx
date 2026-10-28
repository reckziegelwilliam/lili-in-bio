'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SkyLegend } from '@/components/experience/SkyLegend';
import { AFFINITIES, FEATURED_EXPERIENCE, type Affinity } from '@/data/experience';
import { featuredProjects, projects } from '@/data/projects';
import { layoutSky } from '@/lib/experience/layout';
import type { SkyEvent, SkyState } from '@/lib/experience/state';
import { trackEvent } from '@/lib/utils/plausible';
import { ExperienceCanvasLoader, type SkyMode } from './ExperienceCanvasLoader';
import { FocusPanel } from './FocusPanel';
import { StaticSky } from './StaticSky';

interface ExperienceShellProps {
  sky: SkyState;
  dispatch: (event: SkyEvent) => void;
  highlightAffinity: Affinity | null;
  pinnedAffinity: Affinity | null;
  onLegendHover: (affinity: Affinity | null) => void;
  onLegendPin: (affinity: Affinity | null) => void;
  source: string;
  device: string;
}

/**
 * The first screen: the sky (static picture, then the 3D scene over it), the intro as real HTML, a button per featured
 * star for keyboard and touch, the group key, and the panel for whatever is selected.
 */
export function ExperienceShell({ sky, dispatch, highlightAffinity, pinnedAffinity, onLegendHover, onLegendPin, source, device }: ExperienceShellProps) {
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [mode, setMode] = useState<SkyMode>('checking');
  const stars = useMemo(() => layoutSky(projects).stars, []);
  const selectedStar = sky.selected ? stars.find((s) => s.id === sky.selected) ?? null : null;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const select = (id: string, via: 'sky' | 'button') => {
    if (sky.selected !== id) trackEvent('Project selected', { props: { project: id, via } });
    dispatch({ type: 'select', id });
  };
  const back = () => {
    if (sky.mode === 'overview') return;
    trackEvent('Return to sky');
    dispatch({ type: 'back' });
    // Return focus to the button that opened the panel, if one did.
    requestAnimationFrame(() => trigger.current?.focus());
  };

  useEffect(() => {
    if (sky.selected) requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }, [sky.selected]);

  useEffect(() => {
    if (sky.mode !== 'focused') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sky.mode]);

  const legend = AFFINITIES.map((g) => ({ ...g, count: stars.filter((s) => s.affinity === g.id).length })).filter((g) => g.count > 0);

  return (
    <section aria-label="liam rex" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[#060914]">
      <StaticSky />
      <ExperienceCanvasLoader
        selectedId={sky.selected}
        highlightAffinity={highlightAffinity}
        highlightId={highlightId}
        onSelect={(id) => {
          trigger.current = null;
          select(id, 'sky');
        }}
        onBack={back}
        onModeChange={(m) => {
          setMode(m);
          trackEvent('Experience loaded', { props: { mode: m } });
        }}
      />

      <div className="absolute inset-x-0 top-0 z-20">
        <SiteHeader />
      </div>

      <div className="pointer-events-none absolute right-6 top-24 z-20 hidden sm:right-10 sm:block">
        <div className="pointer-events-auto">
          <SkyLegend items={legend} pinned={pinnedAffinity} onHover={onLegendHover} onPin={onLegendPin} />
        </div>
      </div>

      {/* Keeps the intro readable over the brightest part of the sky. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#060914] via-[#060914]/60 to-transparent" />

      <div id="main-content" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-6xl px-6 pb-10 sm:px-10 sm:pb-16">
        <h1 className={`font-display text-6xl leading-[0.95] text-[#ECE8DF] transition-opacity duration-700 sm:text-8xl ${sky.selected ? 'opacity-25' : ''}`}>
          curious everywhere.
        </h1>
        <p className={`mt-6 max-w-md text-[17px] leading-relaxed text-[#ECE8DF]/70 transition-opacity duration-700 ${sky.selected ? 'opacity-25' : ''}`}>
          i&apos;m liam, a software engineer in space.
          <br />
          building founder tools, climate maps, and a horror RPG.
        </p>
        <ul aria-label="Featured projects" className="pointer-events-auto mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] text-[#ECE8DF]">
          {featuredProjects.map((p) => {
            const color = p.slug ? FEATURED_EXPERIENCE[p.slug]?.color : undefined;
            return (
              <li key={p.name}>
                <button
                  type="button"
                  aria-pressed={sky.selected === p.name}
                  onClick={(e) => {
                    trigger.current = e.currentTarget;
                    select(p.name, 'button');
                  }}
                  onMouseEnter={() => setHighlightId(p.name)}
                  onMouseLeave={() => setHighlightId(null)}
                  onFocus={() => setHighlightId(p.name)}
                  onBlur={() => setHighlightId(null)}
                  className="group flex items-center gap-2 border-b border-transparent pb-1 transition-colors hover:border-white/40 aria-pressed:border-white/70"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: color ?? '#9BB9D2' }} />
                  {p.name.toLowerCase()}
                </button>
              </li>
            );
          })}
          <li>
            <a href="#index" className="text-[#ECE8DF]/60 transition-colors hover:text-white">
              index ↓
            </a>
          </li>
        </ul>
        {mode === 'static' && <p className="mt-4 text-xs text-[#ECE8DF]/45">a still sky: motion is reduced or 3D isn&apos;t available here.</p>}
      </div>

      {selectedStar && <FocusPanel ref={headingRef} star={selectedStar} source={source} device={device} onBack={back} />}
    </section>
  );
}
