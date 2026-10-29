'use client';

import type { Project } from '@/data/projects';
import { CATEGORY_ORDER, projects } from '@/data/projects';
import { AFFINITIES, FEATURED_EXPERIENCE, type Affinity } from '@/data/experience';
import { affinityOf } from '@/lib/experience/layout';
import { projectHref } from '@/lib/projects/links';
import { matchesAudience, orderForVisitor } from '@/lib/projects/audience';
import { projectClickProps, trackEvent } from '@/lib/utils/plausible';
import type { VisitorSnapshot } from '@/types/visitor';
import { ArrowUpRight } from 'lucide-react';

interface ProjectRowsProps {
  snapshot?: VisitorSnapshot | null;
  highlightedName?: string | null;
  /** A group lit in the sky; its rows read as lit and the others recede. */
  highlightAffinity?: Affinity | null;
}

const groupColor = new Map(AFFINITIES.map((g) => [g.id, g.color]));

/** The index: every published project as a plain link, featured first, the rest by group. */
export function ProjectRows({ snapshot, highlightedName = null, highlightAffinity = null }: ProjectRowsProps) {
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
    const href = projectHref(project);
    const external = /^https?:\/\//.test(href);
    const affinity = affinityOf(project.category, project.name);
    const inGroup = highlightAffinity !== null && affinity === highlightAffinity;
    const emphasised = highlightedName === project.name || matchesAudience(project, snapshot?.source) || inGroup;
    const color = (project.slug && FEATURED_EXPERIENCE[project.slug]?.color) || groupColor.get(affinity);
    return (
      <li key={project.name}>
        <a
          style={{ opacity: highlightAffinity !== null && !inGroup ? 0.35 : 1 }}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={() => trackEvent('Link click', { props: projectClickProps(project.name, source, device) })}
          className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 border-t border-white/10 py-6 transition-opacity sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:gap-x-8 sm:py-8"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 self-center rounded-full" style={{ background: color, opacity: emphasised ? 1 : 0.6 }} />
          <span className={`${isFeatured ? 'font-display text-3xl sm:text-4xl' : 'text-lg sm:text-xl'} font-normal tracking-tight text-[#ECE8DF]`}>
            {project.name}
          </span>
          <span className="col-span-3 col-start-1 row-start-2 text-sm text-[#ECE8DF]/70 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:text-base">
            {project.description}
          </span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#ECE8DF]/50 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
        </a>
      </li>
    );
  };

  return (
    <section id="index" aria-labelledby="index-title" className="mx-auto w-full max-w-6xl scroll-mt-6 px-6 pb-16 pt-16 sm:px-10">
      {/* Older links point at /#projects. */}
      <span id="projects" />
      <div className="mb-6 flex items-baseline justify-between text-sm text-[#ECE8DF]/60">
        <h2 id="index-title" className="text-base text-[#ECE8DF]/80">index</h2>
        <span>in progress</span>
      </div>
      <ul>{featured.map((p) => row(p, true))}</ul>
      {more.length > 0 && (
        <>
          <h3 className="mb-2 mt-14 text-base text-[#ECE8DF]/80">more work</h3>
          {AFFINITIES.map((group) => {
            const inGroup = more.filter((p) => affinityOf(p.category, p.name) === group.id);
            if (inGroup.length === 0) return null;
            return (
              <div key={group.id} className="mt-8">
                <h4 className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#ECE8DF]/50">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: group.color }} />
                  {group.label}
                </h4>
                <ul>{inGroup.map((p) => row(p, false))}</ul>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}
