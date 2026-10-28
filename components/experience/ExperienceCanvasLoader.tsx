'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Affinity } from '@/data/experience';

// three.js only loads in the browser, after the page is readable; the static sky underneath covers the wait.
const SkyScene = dynamic(() => import('./SkyScene').then((mod) => mod.SkyScene), { ssr: false });

export type SkyMode = 'checking' | '3d' | 'static';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

interface ExperienceCanvasLoaderProps {
  selectedId: string | null;
  highlightAffinity: Affinity | null;
  highlightId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  /** '3d' once the scene is running; 'static' with reduced motion or no WebGL. */
  onModeChange: (mode: SkyMode) => void;
}

export function ExperienceCanvasLoader({ onModeChange, ...sceneProps }: ExperienceCanvasLoaderProps) {
  const [mode, setMode] = useState<SkyMode>('checking');
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setIsCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const next: SkyMode = reduced || !hasWebGL() ? 'static' : '3d';
    setMode(next);
    if (next === 'static') onModeChange('static');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mode !== '3d') return null;

  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${shown ? 'opacity-100' : 'opacity-0'}`}>
      <SkyScene
        {...sceneProps}
        isCoarsePointer={isCoarsePointer}
        onReady={() => {
          setShown(true);
          onModeChange('3d');
        }}
      />
    </div>
  );
}
