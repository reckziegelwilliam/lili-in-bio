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
            This isn't just a link-in-bio—it's a <strong className="text-white">product experiment</strong> and{' '}
            <strong className="text-white">portfolio piece</strong>. It demonstrates context-aware UI design,
            visitor-first product thinking, and privacy-conscious engineering.
          </p>
        </div>
        
        <div className="pt-4 border-t border-white/20 space-y-3">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span>Context-aware UI</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔧</span>
              <span>Tiny useful tools</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Privacy-first</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎨</span>
              <span>Unique per visitor</span>
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

