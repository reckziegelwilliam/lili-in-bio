'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { GraphNode } from '@/lib/graph/types';

const GraphScene = dynamic(() => import('./GraphScene').then((mod) => mod.GraphScene), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#05060a]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  ),
});

interface GraphCanvasLoaderProps {
  focusedNodeId: string | null;
  onNodeSelect: (node: GraphNode) => void;
  onActiveChange: (active: boolean) => void;
}

export function GraphCanvasLoader({ focusedNodeId, onNodeSelect, onActiveChange }: GraphCanvasLoaderProps) {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [skipCanvas, setSkipCanvas] = useState<boolean | null>(null);

  useEffect(() => {
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsCoarsePointer(coarseQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);
    // Visitors who've asked for reduced motion get the accessible list only —
    // no reason to load three.js just to render a static, non-rotating scene.
    setSkipCanvas(motionQuery.matches);
    onActiveChange(!motionQuery.matches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skipCanvas === null || skipCanvas) return null;

  return (
    <GraphScene
      isCoarsePointer={isCoarsePointer}
      prefersReducedMotion={prefersReducedMotion}
      focusedNodeId={focusedNodeId}
      onNodeSelect={onNodeSelect}
    />
  );
}
