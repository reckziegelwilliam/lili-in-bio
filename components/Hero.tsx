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
    subtitle: "This page adapts to you",
    description: "Not your typical link-in-bio. This is a tiny console that reads how you showed up and gives you something useful right away.",
  },
  nerd: {
    title: "Welcome to the Visitor Console",
    subtitle: "A context-aware interface experiment",
    description: "This isn't just a list of links—it's a micro-product that uses ambient data (referrer, device, time, preferences) to create a personalized experience. No tracking, no cookies, just thoughtful adaptation. Built to demonstrate visitor-first product thinking.",
  },
  reflective: {
    title: "You found something different here",
    subtitle: "Let's make this worth your time",
    description: "Most link pages are static lists. This one pays attention to how you arrived, what you might need, and adapts itself accordingly. It's an experiment in making even the smallest interactions more thoughtful and human.",
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

