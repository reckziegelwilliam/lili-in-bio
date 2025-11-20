'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import type { ReadingMode } from '@/types/visitor';
import { updateReadingMode } from '@/lib/hooks/useVisitorSnapshot';

interface ReadingModeToggleProps {
  currentMode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
  accentColor?: string;
}

const modes: { value: ReadingMode; label: string; emoji: string; description: string }[] = [
  {
    value: 'gist',
    label: 'Gist',
    emoji: '⚡',
    description: 'Quick and to the point',
  },
  {
    value: 'nerd',
    label: 'Nerd',
    emoji: '🤓',
    description: 'Technical details and depth',
  },
  {
    value: 'reflective',
    label: 'Reflective',
    emoji: '💭',
    description: 'Thoughtful and exploratory',
  },
];

export function ReadingModeToggle({ currentMode, onChange, accentColor }: ReadingModeToggleProps) {
  const [mode, setMode] = useState<ReadingMode>(currentMode);
  
  const handleModeChange = (newMode: ReadingMode) => {
    setMode(newMode);
    updateReadingMode(newMode);
    onChange(newMode);
  };
  
  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor}>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Choose your reading mode
          </h2>
          <p className="text-sm text-white/70">
            This changes how much detail you'll see throughout the page
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => handleModeChange(m.value)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300
                ${
                  mode === m.value
                    ? 'bg-white/20 border-white/60 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                }
              `}
              style={
                mode === m.value && accentColor
                  ? { borderColor: accentColor, boxShadow: `0 0 20px ${accentColor}40` }
                  : {}
              }
            >
              <div className="text-center space-y-2">
                <div className="text-3xl">{m.emoji}</div>
                <div className="font-semibold text-white">{m.label}</div>
                <div className="text-xs text-white/70">{m.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

