'use client';

import { useEffect, useRef, useState } from 'react';
import { SkipToContent } from '@/components/AccessibilityUtils';
import { GraphCanvasLoader } from '@/components/graph/GraphCanvasLoader';
import { NodeDetailPanel } from '@/components/graph/NodeDetailPanel';
import { GraphLegend } from '@/components/site/GraphLegend';
import { ProjectRows } from '@/components/site/ProjectRows';
import { SiteHeader } from '@/components/site/SiteHeader';
import { projectsByCategory } from '@/data/projects';
import { useVisitorSnapshot } from '@/lib/hooks/useVisitorSnapshot';
import { trackEvent } from '@/lib/utils/plausible';
import type { GraphNode } from '@/lib/graph/types';

export default function Home() {
  const snapshot = useVisitorSnapshot();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  // null until the loader has checked reduced motion; false means the page runs on the project list alone.
  const [canvasActive, setCanvasActive] = useState<boolean | null>(null);
  // The group highlighted from the legend: what the pointer is over, else the one clicked.
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);
  const [pinnedCategory, setPinnedCategory] = useState<string | null>(null);
  const highlightCategory = hoverCategory ?? pinnedCategory;
  const legend = projectsByCategory.map((g) => ({ category: g.category, count: g.projects.length }));
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
    <main className="relative min-h-screen bg-[#05060a] text-white">
      <SkipToContent />
      <SiteHeader />

      <div id="main-content" className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-8 pt-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center lg:gap-4 lg:pt-12">
        <section aria-labelledby="intro-title" className="relative z-10">
          <h1 id="intro-title" className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            curious everywhere.
          </h1>
          <p className="mt-8 max-w-sm text-lg leading-relaxed text-white/70">
            i&apos;m liam, a software engineer in space.
            <br />
            building founder tools, climate maps, and a horror RPG.
          </p>
          <a
            href="#projects"
            className="mt-10 inline-flex items-center gap-3 border-b border-white/30 pb-3 text-lg text-white transition-colors hover:border-white"
          >
            explore the projects <span aria-hidden="true">↗</span>
          </a>
        </section>

        {canvasActive !== false && (
          <div>
          <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[600px]">
            <GraphCanvasLoader
              visitorSource={snapshot?.source ?? null}
              focusedNodeId={selectedNode?.id ?? null}
              highlightCategory={highlightCategory}
              // Clicking the hub (no project) clears the selection the same way closing the detail panel does.
              onNodeSelect={(node) => setSelectedNode(node.kind === 'hub' ? null : node)}
              onActiveChange={setCanvasActive}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <GraphLegend categories={legend} pinned={pinnedCategory} onHover={setHoverCategory} onPin={setPinnedCategory} />
            <p className="text-sm text-white/50">a few connected interests</p>
          </div>
          </div>
        )}
      </div>

      <ProjectRows snapshot={snapshot} highlightedName={selectedNode?.project?.name ?? null} highlightCategory={highlightCategory} />

      {selectedNode?.project && (
        <NodeDetailPanel
          project={selectedNode.project}
          snapshot={snapshot}
          onClose={() => setSelectedNode(null)}
        />
      )}

      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-10 pt-6 text-sm text-white/60 sm:px-10">
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
