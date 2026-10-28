'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import { AFFINITIES } from '@/data/experience';
import type { SkyStar } from '@/lib/experience/layout';
import { outsideLink, projectHref } from '@/lib/projects/links';
import { projectClickProps, trackEvent } from '@/lib/utils/plausible';

interface FocusPanelProps {
  star: SkyStar;
  source: string;
  device: string;
  onBack: () => void;
}

/** What a selected star says: its name, Pulse's one line, one way in, one way back. */
export const FocusPanel = forwardRef<HTMLHeadingElement, FocusPanelProps>(function FocusPanel({ star, source, device, onBack }, headingRef) {
  const { project } = star;
  const group = AFFINITIES.find((g) => g.id === star.affinity);
  const site = outsideLink(project);
  const track = (name: string) => trackEvent('Link click', { props: projectClickProps(name, source, device) });

  return (
    <section
      aria-labelledby="focus-title"
      className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-2xl border border-white/10 bg-[#0C1428]/80 p-6 text-[#ECE8DF] backdrop-blur-xl sm:inset-x-auto sm:bottom-10 sm:right-10 sm:w-[24rem]"
    >
      {group && (
        <p className="flex items-center gap-2 text-xs text-[#ECE8DF]/60">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: group.color }} />
          {group.label}
        </p>
      )}
      <h2 id="focus-title" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl leading-tight outline-none">
        {project.name}
      </h2>
      {project.description && <p className="mt-2 text-[15px] leading-relaxed text-[#ECE8DF]/75">{project.description}</p>}
      {star.featured?.microcopy && <p className="mt-3 font-display text-lg italic text-[#ECE8DF]/70">{star.featured.microcopy}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
        {project.slug ? (
          <Link href={projectHref(project)} onClick={() => track(project.name)} className="rounded-full bg-[#ECE8DF] px-4 py-2 font-medium text-[#060914] hover:bg-white">
            enter {project.name} →
          </Link>
        ) : null}
        {site && (
          <a
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(project.slug ? `${project.name} - site` : project.name)}
            className={project.slug ? 'text-[#ECE8DF]/80 underline decoration-white/30 underline-offset-4 hover:text-white' : 'rounded-full bg-[#ECE8DF] px-4 py-2 font-medium text-[#060914] hover:bg-white'}
          >
            open {project.slug ? 'site' : project.name} ↗
          </a>
        )}
        <button type="button" onClick={onBack} className="ml-auto text-[#ECE8DF]/60 hover:text-white">
          back to sky <kbd className="ml-1 rounded border border-white/15 px-1 text-[10px]">esc</kbd>
        </button>
      </div>
    </section>
  );
});
