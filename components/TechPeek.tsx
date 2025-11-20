'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import type { ReadingMode } from '@/types/visitor';

interface TechPeekProps {
  readingMode: ReadingMode;
  accentColor?: string;
}

export function TechPeek({ readingMode, accentColor }: TechPeekProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const showCodeSnippets = readingMode === 'nerd';
  
  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <span>🔍</span>
            <span>Transparent Tech Peek</span>
          </h2>
          <div className="text-white text-2xl transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
            ↓
          </div>
        </div>
        <p className="text-white/70 text-sm mt-2">
          See exactly what data this page uses and how (no creepy stuff)
        </p>
      </button>
      
      {isOpen && (
        <div className="mt-6 space-y-6">
          {/* What we collect */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">What data this page uses:</h3>
            <div className="space-y-2 text-white/80">
              <div className="p-3 bg-white/5 rounded-lg">
                <strong className="text-white">Referrer:</strong> Where you came from (Instagram, TikTok, direct link)
                {showCodeSnippets && (
                  <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-x-auto">
                    <code>document.referrer</code>
                  </pre>
                )}
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg">
                <strong className="text-white">Device type:</strong> Mobile, tablet, or desktop (from user agent + screen width)
                {showCodeSnippets && (
                  <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-x-auto">
                    <code>{`navigator.userAgent\nwindow.innerWidth`}</code>
                  </pre>
                )}
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg">
                <strong className="text-white">Dark/light mode:</strong> Your system preference
                {showCodeSnippets && (
                  <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-x-auto">
                    <code>matchMedia('(prefers-color-scheme: dark)')</code>
                  </pre>
                )}
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg">
                <strong className="text-white">Time & timezone:</strong> Approximate time of day (for context, not tracking)
                {showCodeSnippets && (
                  <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-x-auto">
                    <code>Intl.DateTimeFormat().resolvedOptions()</code>
                  </pre>
                )}
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg">
                <strong className="text-white">Visit history:</strong> How many times you've been here (stored locally on your device)
                {showCodeSnippets && (
                  <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-x-auto">
                    <code>localStorage (your device only)</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
          
          {/* What we DON'T do */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white text-green-300">What we deliberately DON'T do:</h3>
            <div className="space-y-2 text-white/80">
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                ✓ No third-party tracking pixels or cookies
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                ✓ No fingerprinting or cross-site tracking
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                ✓ No selling or sharing your data
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                ✓ All storage is local (your device, your control)
              </div>
            </div>
          </div>
          
          {/* Tech stack */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Tech stack:</h3>
            <div className="flex flex-wrap gap-2">
              {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'OpenAI API'].map(
                (tech) => (
                  <div
                    key={tech}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white"
                  >
                    {tech}
                  </div>
                )
              )}
            </div>
          </div>
          
          {/* Philosophy */}
          {readingMode === 'reflective' && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/20">
              <p className="text-white/80 text-sm leading-relaxed">
                <strong className="text-white">Philosophy:</strong> Every interaction online should respect
                the person on the other side. This page uses context to be helpful, not invasive.
                It's a demonstration that you can build thoughtful, personalized experiences without
                surveillance capitalism.
              </p>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}

