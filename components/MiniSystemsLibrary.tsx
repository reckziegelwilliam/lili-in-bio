'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import type { ChaosType, MiniSystem, ReadingMode } from '@/types/visitor';

interface MiniSystemsLibraryProps {
  readingMode: ReadingMode;
  accentColor?: string;
}

const systems: MiniSystem[] = [
  {
    id: 'tooManyIdeas',
    title: 'Too many ideas, nothing shipped',
    problem: "Drowning in ideas but can't focus on finishing anything",
    system: {
      name: 'The 3-Max System',
      steps: [
        'Pick your top 3 ideas (not 10, not 5—just 3)',
        'For each: Write down the absolute smallest version that would be "done"',
        'Ship the smallest version of one before starting the next',
      ],
      outcome: "You'll ship actual things instead of collecting ideas forever",
    },
    templateLink: '#',
  },
  {
    id: 'messyClients',
    title: 'Clients/projects feel messy',
    problem: 'Every project is chaos with different tools and scattered info',
    system: {
      name: 'Single Source System',
      steps: [
        'One doc/board per client (not scattered across tools)',
        'Four sections only: Active, Waiting, Done, Reference',
        'Update it before/after every interaction—no exceptions',
      ],
      outcome: "You'll know the status of anything in under 10 seconds",
    },
    templateLink: '#',
  },
  {
    id: 'toolOverload',
    title: 'Lost in tools and workflows',
    problem: 'Spending more time organizing tools than doing actual work',
    system: {
      name: 'The Three-Tool Rule',
      steps: [
        'Pick exactly 3 tools: one for thinking, one for doing, one for talking',
        'Delete or archive everything else for 2 weeks',
        'If you miss something, add it back—but remove one of the 3',
      ],
      outcome: "You'll spend less time in 'meta-work' and more time creating",
    },
    templateLink: '#',
  },
  {
    id: 'cantStart',
    title: 'I want to start but keep stalling',
    problem: 'Stuck in planning mode, never actually beginning',
    system: {
      name: '30-Minute First Draft',
      steps: [
        'Set a timer for 30 minutes',
        'Make the ugliest, most broken version of your thing that technically "exists"',
        'Share it with one person (or just yourself) immediately',
      ],
      outcome: "You'll break the 'perfect start' paralysis and have something real to improve'",
    },
    templateLink: '#',
  },
];

export function MiniSystemsLibrary({ readingMode, accentColor }: MiniSystemsLibraryProps) {
  const [selectedSystem, setSelectedSystem] = useState<ChaosType | null>(null);
  
  const isExpanded = selectedSystem !== null;
  const currentSystem = systems.find((s) => s.id === selectedSystem);
  
  const showFullSteps = readingMode === 'nerd' || readingMode === 'reflective';
  
  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor} glowIntensity="low">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Mini Systems Library
          </h2>
          <p className="text-white/70">
            Tap a problem below to get a tiny, practical system you can use right now
          </p>
        </div>
        
        {/* Problem buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systems.map((system) => (
            <button
              key={system.id}
              onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
              className={`
                p-4 rounded-xl text-left transition-all border-2
                ${
                  selectedSystem === system.id
                    ? 'bg-white/20 border-white/60'
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'
                }
              `}
            >
              <div className="font-medium text-white mb-1">{system.title}</div>
              <div className="text-sm text-white/60">{system.problem}</div>
            </button>
          ))}
        </div>
        
        {/* Expanded system */}
        {isExpanded && currentSystem && (
          <div className="mt-6 p-6 rounded-xl bg-white/15 border border-white/30 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {currentSystem.system.name}
              </h3>
              {showFullSteps && (
                <p className="text-white/70 text-sm mb-4">
                  {currentSystem.problem}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              {currentSystem.system.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold">
                    {i + 1}
                  </div>
                  <div className="text-white/90 flex-1">{step}</div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <p className="text-white/80 mb-3">
                <strong className="text-white">Outcome:</strong> {currentSystem.system.outcome}
              </p>
              
              {readingMode === 'nerd' && (
                <a
                  href={currentSystem.templateLink}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
                >
                  <span>Download template</span>
                  <span>→</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
