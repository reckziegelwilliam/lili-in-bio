'use client';

import Image from 'next/image';
import type { Project } from '@/data/projects';
import { trackEvent } from '@/lib/utils/plausible';
import type { VisitorSnapshot } from '@/types/visitor';

interface NodeDetailPanelProps {
  project: Project;
  snapshot: VisitorSnapshot | null;
  onClose: () => void;
}

export function NodeDetailPanel({ project, snapshot, onClose }: NodeDetailPanelProps) {
  const source = snapshot?.source ?? 'direct';
  const device = snapshot?.deviceType ?? 'desktop';

  const handleOpenClick = () => {
    trackEvent('Link click', { props: { destination: project.name, source, device } });
  };

  const handleSubLinkClick = (subName: string) => {
    trackEvent('Link click', {
      props: { destination: `${project.name} - ${subName}`, source, device },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-2xl border border-white/15 bg-black/70 p-6 backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 text-white/50 hover:text-white"
      >
        ✕
      </button>

      <h2 className="pr-8 text-xl font-black tracking-tight text-white">{project.name}</h2>

      {project.description && <p className="mt-2 text-sm text-white/80">{project.description}</p>}

      {project.thumbnail && (
        <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl">
          <Image
            src={project.thumbnail}
            alt={`${project.name} preview`}
            fill
            className="object-cover object-top"
            sizes="400px"
          />
        </div>
      )}

      {project.subLinks && project.subLinks.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {project.subLinks.map((sub) => (
            <a
              key={sub.href}
              href={sub.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSubLinkClick(sub.name)}
              className="rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-center hover:bg-white/15"
            >
              <span className="block text-xs font-bold text-white">{sub.name}</span>
            </a>
          ))}
        </div>
      )}

      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOpenClick}
        className="mt-4 block w-full rounded-xl bg-white/10 py-3 text-center text-sm font-semibold text-white hover:bg-white/20"
      >
        Open {project.name} →
      </a>
    </div>
  );
}
