'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { trackEvent } from '@/lib/utils/plausible';
import { useVisitorSnapshot } from '@/lib/hooks/useVisitorSnapshot';
import { useTheme } from '@/lib/hooks/useTheme';
import { generateVisualSeed } from '@/lib/utils/seedGenerator';
import { generatePalette } from '@/lib/utils/paletteGenerator';
import { AuraBackground } from '@/components/AuraBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProjectCard } from '@/components/ProjectCard';
import { PageLoadingState } from '@/components/LoadingStates';
import { projects } from '@/data/projects';
import type { VisitorSnapshot } from '@/types/visitor';

// Default snapshot for when detection fails (Instagram WebView, privacy browsers, etc.)
const DEFAULT_SNAPSHOT: VisitorSnapshot = {
  source: 'instagram', // Assume Instagram since that's the primary use case
  deviceType: 'mobile',
  localHour: new Date().getHours(),
  prefersDark: true,
  visitCount: 1,
  readingMode: 'gist',
  language: 'en',
  timezone: 'UTC',
  isReturning: false,
  os: 'unknown',
  browser: 'unknown',
};

// Maximum time to wait for snapshot detection before using fallback
const SNAPSHOT_TIMEOUT_MS = 1500;

export default function Home() {
  const detectedSnapshot = useVisitorSnapshot();
  const { isDark, mounted } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const visitTracked = useRef(false);

  // Fallback timeout - don't block rendering forever if detection fails
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimedOut(true);
      setIsLoading(false);
    }, SNAPSHOT_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, []);

  // Stop loading when snapshot is detected
  useEffect(() => {
    if (detectedSnapshot) {
      setIsLoading(false);
    }
  }, [detectedSnapshot]);

  // Use detected snapshot or fallback to defaults
  const snapshot = useMemo(() => {
    if (detectedSnapshot) return detectedSnapshot;
    if (timedOut) return DEFAULT_SNAPSHOT;
    return null;
  }, [detectedSnapshot, timedOut]);

  // Fire Visit event once when snapshot is ready (props for Plausible breakdown/filters)
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
        dark: snapshot.prefersDark ? 'yes' : 'no',
      },
    });
  }, [snapshot]);

  // Show loading state only briefly, with hard timeout
  if (isLoading || !snapshot || !mounted) {
    return <PageLoadingState />;
  }

  const seed = generateVisualSeed(snapshot);
  const palette = generatePalette(snapshot, seed);
  const accentColor = palette.primary;

  // Theme-aware colors
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/85' : 'text-gray-700';
  const textMuted = isDark ? 'text-white/20' : 'text-gray-400';
  const headerGradient = isDark 
    ? `linear-gradient(90deg, #fff 0%, ${accentColor} 45%, #fff 100%)`
    : `linear-gradient(90deg, #1a1a1a 0%, ${accentColor} 45%, #1a1a1a 100%)`;

  return (
    <main className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      {/* Dynamic Aura Background */}
      <AuraBackground snapshot={snapshot} seed={seed} palette={palette} variant="css" />

      {/* Light mode overlay to soften background */}
      {!isDark && (
        <div className="fixed inset-0 bg-white/20 z-[1] pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-6 py-12">
          {/* Theme Toggle */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <ThemeToggle accentColor={accentColor} />
          </div>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <h1 
              className="text-6xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent"
              style={{ 
                backgroundImage: headerGradient,
                filter: `drop-shadow(0 0 30px ${accentColor}50) drop-shadow(0 0 60px ${accentColor}30)`,
                WebkitTextStroke: isDark ? '1px rgba(255,255,255,0.3)' : '1px rgba(0,0,0,0.2)',
              }}
            >
              lili.in.bio
            </h1>
          </div>

          {/* Project Buttons */}
          <div className="space-y-4">
            {projects.map((project, index) => (
              project.enabled ? (
                <ProjectCard
                  key={project.name}
                  project={project}
                  isDark={isDark}
                  accentColor={accentColor}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  textMuted={textMuted}
                  animationDelay={`${0.1 + index * 0.1}s`}
                  onLinkClick={() =>
                    trackEvent('Link click', {
                      props: {
                        destination: project.name,
                        source: snapshot.source,
                        device: snapshot.deviceType,
                      },
                    })
                  }
                />
              ) : (
                <div
                  key={project.name}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div
                    className={`relative block w-full py-5 px-6 rounded-2xl backdrop-blur-sm border text-center cursor-not-allowed overflow-hidden ${
                      isDark 
                        ? 'bg-black/20 border-white/5' 
                        : 'bg-gray-100/50 border-gray-200/50'
                    }`}
                  >
                    <span className={`text-lg font-medium ${textMuted}`}>{project.name}</span>
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wider ${
                      isDark ? 'text-white/15' : 'text-gray-300'
                    }`}>
                      Soon
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* GitHub Link */}
          <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <a
              href="https://github.com/reckziegelwilliam"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('Link click', {
                  props: {
                    destination: 'GitHub',
                    source: snapshot.source,
                    device: snapshot.deviceType,
                  },
                })
              }
              className={`flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl backdrop-blur-sm border text-base font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-white/10 border-white/15 text-white/70 hover:bg-white/15 hover:text-white' 
                  : 'bg-black/5 border-gray-200 text-gray-600 hover:bg-black/10 hover:text-gray-900'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

