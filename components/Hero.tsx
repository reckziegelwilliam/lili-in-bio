'use client';

import { GlassCard } from './GlassCard';
import type { ReadingMode } from '@/types/visitor';

interface HeroProps {
  readingMode: ReadingMode;
  accentColor?: string;
}

const content = {
  gist: {
    title: "Hi, I'm Lili",
    subtitle: "Creator's toolkit platform",
    description: "Not your typical link-in-bio. This page adapts to you and demonstrates the kind of thoughtful, context-aware interfaces I'm building for creators. Try the text tool below, then join the beta for the full suite.",
  },
  nerd: {
    title: "Welcome to the Visitor Console",
    subtitle: "Demo of the creator's toolkit platform",
    description: "This isn't just a list of links—it's a live demo of context-aware UI. The page reads ambient data (referrer, device, time, preferences) to adapt itself. The text upgrade tool you'll see below is one of 10+ tools in the full platform. No tracking, no cookies, just thoughtful adaptation.",
  },
  reflective: {
    title: "You found something different here",
    subtitle: "A glimpse of what I'm building",
    description: "Most link pages are static lists. This one pays attention to how you arrived and what you might need. It's a preview of the creator's toolkit platform—tools for clarity, color, headlines, ideas, and systems. Try the text upgrader below, then join the beta to get access to everything.",
  },
};

export function Hero({ readingMode, accentColor }: HeroProps) {
  const copy = content[readingMode];
  
  return (
    <GlassCard className="p-8 md:p-12" accentColor={accentColor} glowIntensity="medium">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-balance">
          {copy.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 text-balance">
          {copy.subtitle}
        </p>
        <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
          {copy.description}
        </p>
      </div>
    </GlassCard>
  );
}
