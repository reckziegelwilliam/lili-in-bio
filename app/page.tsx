'use client';

import { useState, useEffect } from 'react';
import { useVisitorSnapshot } from '@/lib/hooks/useVisitorSnapshot';
import { generateVisualSeed } from '@/lib/utils/seedGenerator';
import { generatePalette } from '@/lib/utils/paletteGenerator';
import { AuraBackground } from '@/components/AuraBackground';
import { Hero } from '@/components/Hero';
import { VisitorSnapshotCard } from '@/components/VisitorSnapshotCard';
import { ReadingModeToggle } from '@/components/ReadingModeToggle';
import { UpgradeTool } from '@/components/UpgradeTool';
import { MiniSystemsLibrary } from '@/components/MiniSystemsLibrary';
import { InteractionChooser } from '@/components/InteractionChooser';
import { SaveForLater } from '@/components/SaveForLater';
import { TechPeek } from '@/components/TechPeek';
import { MetaFooter } from '@/components/MetaFooter';
import { PageLoadingState } from '@/components/LoadingStates';
import { SkipToContent } from '@/components/AccessibilityUtils';
import type { ReadingMode } from '@/types/visitor';

export default function Home() {
  const snapshot = useVisitorSnapshot();
  const [readingMode, setReadingMode] = useState<ReadingMode>('gist');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (snapshot) {
      setReadingMode(snapshot.readingMode);
      setIsLoading(false);
    }
  }, [snapshot]);

  // Show loading state while detecting visitor
  if (isLoading || !snapshot) {
    return <PageLoadingState />;
  }

  const seed = generateVisualSeed(snapshot);
  const palette = generatePalette(snapshot, seed);
  const accentColor = palette.primary;

  return (
    <>
      <SkipToContent />
      <main id="main-content" className="min-h-screen relative overflow-x-hidden">
        {/* Dynamic Aura Background */}
        <AuraBackground snapshot={snapshot} seed={seed} palette={palette} variant="css" />

        {/* Content */}
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
            <div className="space-y-6 md:space-y-8">
            {/* Hero */}
            <div className="animate-fade-in">
              <Hero readingMode={readingMode} accentColor={accentColor} />
            </div>

            {/* Visitor Snapshot */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <VisitorSnapshotCard snapshot={snapshot} accentColor={accentColor} />
            </div>

            {/* Reading Mode Toggle */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ReadingModeToggle
                currentMode={readingMode}
                onChange={(mode) => {
                  setReadingMode(mode);
                  // Update snapshot in parent
                  snapshot.readingMode = mode;
                }}
                accentColor={accentColor}
              />
            </div>

            {/* One-Minute Upgrade Tool */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <UpgradeTool accentColor={accentColor} />
            </div>

            {/* Mini Systems Library */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <MiniSystemsLibrary readingMode={readingMode} accentColor={accentColor} />
            </div>

            {/* Interaction Style Chooser */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <InteractionChooser accentColor={accentColor} />
            </div>

            {/* Save For Later */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <SaveForLater accentColor={accentColor} />
            </div>

            {/* Transparent Tech Peek */}
            <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <TechPeek readingMode={readingMode} accentColor={accentColor} />
            </div>

            {/* Meta Footer */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <MetaFooter />
            </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

