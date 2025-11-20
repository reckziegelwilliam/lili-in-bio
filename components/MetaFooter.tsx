'use client';

import { GlassCard } from './GlassCard';

export function MetaFooter() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">
            About this page
          </h3>
          <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
            This link-in-bio is also a <strong className="text-white">platform demo</strong>. It showcases
            the kind of context-aware, visitor-first interfaces you can build with our creator's toolkit.
            The full platform includes tools for text, color, headlines, ideas, and more.
          </p>
        </div>
        
        <div className="pt-4 border-t border-white/20 space-y-3">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span>[&bull;]</span>
              <span>Context-aware UI</span>
            </div>
            <div className="flex items-center gap-2">
              <span>[&bull;]</span>
              <span>Creator toolkit platform</span>
            </div>
            <div className="flex items-center gap-2">
              <span>[&bull;]</span>
              <span>Privacy-first</span>
            </div>
            <div className="flex items-center gap-2">
              <span>[&bull;]</span>
              <span>Beta launching soon</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="https://github.com/yourusername/visitor-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              View source code →
            </a>
          </div>
        </div>
        
        <div className="pt-4 text-white/50 text-xs">
          Built with care by <strong className="text-white/70">Lili</strong>
        </div>
      </div>
    </GlassCard>
  );
}
