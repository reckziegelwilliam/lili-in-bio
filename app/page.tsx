'use client';

import { useEffect, useRef, useState } from 'react';
import { SkipToContent } from '@/components/AccessibilityUtils';
import { AccessibleProjectList } from '@/components/graph/AccessibleProjectList';
import { GraphCanvasLoader } from '@/components/graph/GraphCanvasLoader';
import { NodeDetailPanel } from '@/components/graph/NodeDetailPanel';
import { useVisitorSnapshot } from '@/lib/hooks/useVisitorSnapshot';
import { trackEvent } from '@/lib/utils/plausible';
import type { GraphNode } from '@/lib/graph/types';

export default function Home() {
  const snapshot = useVisitorSnapshot();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [canvasActive, setCanvasActive] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const visitTracked = useRef(false);
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const listInert = canvasActive && !listVisible;

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

  useEffect(() => {
    const el = listWrapperRef.current;
    if (!el) return;
    // react-dom 18 doesn't support `inert` as a JSX prop (it strips it) — set
    // the real DOM attribute directly so it actually works in this React version.
    el.toggleAttribute('inert', listInert);
  }, [listInert]);

  return (
    <main className="relative min-h-screen bg-[#05060a]">
      <SkipToContent onFocus={() => setListVisible(true)} />

      {/* Always-rendered semantic content: SEO, screen readers, no-JS, reduced-motion. */}
      <div ref={listWrapperRef}>
        <AccessibleProjectList snapshot={snapshot} />
      </div>

      {/* Progressive enhancement: covers the list above once it mounts. Pointer events
          are only enabled while the canvas is actually active, so it never blocks clicks
          on the list underneath (reduced motion, no-JS, or the pre-activation window). */}
      <div
        className={`fixed inset-0 z-30 ${
          listVisible ? 'hidden' : canvasActive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <GraphCanvasLoader
          focusedNodeId={selectedNode?.id ?? null}
          // Clicking the hub (no project) clears the selection the same way
          // closing the detail panel does — both flow through `focusedNodeId`
          // becoming null, which is what drives the camera back to the overview.
          onNodeSelect={(node) => setSelectedNode(node.kind === 'hub' ? null : node)}
          onActiveChange={setCanvasActive}
        />
      </div>

      {selectedNode?.project && (
        <NodeDetailPanel
          project={selectedNode.project}
          snapshot={snapshot}
          onClose={() => setSelectedNode(null)}
        />
      )}

      <button
        type="button"
        onClick={() => setListVisible((v) => !v)}
        className="fixed bottom-4 left-4 z-40 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/20 hover:text-white"
      >
        {listVisible ? 'View 3D graph' : 'View as list'}
      </button>

      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <a
          href="https://x.com/liamreckziegel"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
        </a>

        <a
          href="https://github.com/reckziegelwilliam"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="rounded-full bg-white/10 p-3 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>
      </div>
    </main>
  );
}
