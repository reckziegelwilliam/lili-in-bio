'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { SkipToContent } from '@/components/AccessibilityUtils';
import { ExperienceShell } from '@/components/experience/ExperienceShell';
import { Lately } from '@/components/site/Lately';
import { NowList } from '@/components/site/NowList';
import { ProjectRows } from '@/components/site/ProjectRows';
import type { Affinity } from '@/data/experience';
import { initialSkyState, skyReducer } from '@/lib/experience/state';
import { useVisitorSnapshot } from '@/lib/hooks/useVisitorSnapshot';
import { trackEvent } from '@/lib/utils/plausible';

export default function Home() {
  const snapshot = useVisitorSnapshot();
  const [sky, dispatch] = useReducer(skyReducer, initialSkyState);
  // A group lit from the legend: what the pointer is over, else the one clicked.
  const [hoverAffinity, setHoverAffinity] = useState<Affinity | null>(null);
  const [pinnedAffinity, setPinnedAffinity] = useState<Affinity | null>(null);
  const highlightAffinity = hoverAffinity ?? pinnedAffinity;
  const visitTracked = useRef(false);

  useEffect(() => {
    if (!snapshot || visitTracked.current) return;
    visitTracked.current = true;
    trackEvent('Visit', {
      props: {
        source: snapshot.source,
        device: snapshot.deviceType,
        lang: snapshot.language?.slice(0, 2) || 'en',
        returning: snapshot.isReturning ? 'yes' : 'no',
        browser: snapshot.browser || 'unknown',
      },
    });
  }, [snapshot]);

  return (
    <main className="relative min-h-screen bg-[#060914] text-[#ECE8DF]">
      <SkipToContent />
      <ExperienceShell
        sky={sky}
        dispatch={dispatch}
        highlightAffinity={highlightAffinity}
        pinnedAffinity={pinnedAffinity}
        onLegendHover={setHoverAffinity}
        onLegendPin={setPinnedAffinity}
        source={snapshot?.source ?? 'direct'}
        device={snapshot?.deviceType ?? 'desktop'}
      />

      <ProjectRows snapshot={snapshot} highlightedName={sky.selected} highlightAffinity={highlightAffinity} />
      <NowList />
      <Lately />

      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-10 pt-6 text-sm text-[#ECE8DF]/60 sm:px-10">
        <span>Los Angeles</span>
        <span className="flex items-center gap-5">
          <a href="https://x.com/liamreckziegel" target="_blank" rel="noopener noreferrer" className="hover:text-white">x</a>
          <a href="https://github.com/reckziegelwilliam" target="_blank" rel="noopener noreferrer" className="hover:text-white">github</a>
          <span>sharing the work as i go.</span>
        </span>
      </footer>
    </main>
  );
}
