'use client';

import type { Project } from '@/data/projects';
import { CATEGORY_ORDER, projects } from '@/data/projects';
import { matchesAudience, orderForVisitor } from '@/lib/projects/audience';
import { projectClickProps, trackEvent } from '@/lib/utils/plausible';
import type { VisitorSnapshot } from '@/types/visitor';

interface ProjectRowsProps {
  snapshot?: VisitorSnapshot | null;
  highlightedName?: string | null;
}

export function ProjectRows({ snapshot, highlightedName = null }: ProjectRowsProps) {
  const source = snapshot?.source ?? 'direct';
  const device = snapshot?.deviceType ?? 'desktop';
  const enabled = projects.filter((p) => p.enabled);
  const featured = enabled
    .filter((p) => p.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
  const more = orderForVisitor(
    enabled.filter((p) => p.featuredOrder === undefined),
    CATEGORY_ORDER,
    snapshot?.source,
  );

  const row = (project: Project, isFeatured: boolean) => {
    // Featured projects open their own page, which has the link out; the rest go straight to the project.
    const href = isFeatured && project.slug ? `/projects/${project.slug}` : project.href;
    const external = /^https?:\/\//.test(href);
    const emphasised = highlightedName === project.name || matchesAudience(project, snapshot?.source);
    return (
      <li key={project.name}>
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={() => trackEvent('Link click', { props: projectClickProps(project.name, source, device) })}
          className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 border-t border-white/10 py-6 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:gap-x-8 sm:py-8"
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 self-center rounded-full ${emphasised ? 'bg-white' : 'bg-white/40'}`}
          />
          <span className={`${isFeatured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'} font-normal tracking-tight text-white`}>
            {project.name}
          </span>
          <span className="col-span-3 col-start-1 row-start-2 text-sm text-white/70 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:text-base">
            {project.description}
            {isFeatured && project.stage ? <span className="sr-only"> Stage: {project.stage}.</span> : null}
          </span>
          <span aria-hidden="true" className="text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:text-white">↗</span>
        </a>
      </li>
    );
  };

  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto w-full max-w-6xl px-6 pb-16 pt-12 sm:px-10">
      <div className="mb-6 flex items-baseline justify-between text-sm text-white/60">
        <h2 id="projects-title" className="text-base text-white/80">what i&apos;m building</h2>
        <span>in progress</span>
      </div>
      <ul>{featured.map((p) => row(p, true))}</ul>
      {more.length > 0 && (
        <>
          <h3 className="mb-2 mt-14 text-base text-white/80">more work</h3>
          <ul>{more.map((p) => row(p, false))}</ul>
        </>
      )}
    </section>
  );
}
