'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import type { InteractionStyle } from '@/types/visitor';

interface InteractionChooserProps {
  accentColor?: string;
}

const interactions: {
  value: InteractionStyle;
  title: string;
  description: string;
  cta: {
    text: string;
    href: string;
    subtitle: string;
  };
}[] = [
  {
    value: 'work',
    title: 'I want beta access to the platform',
    description: "Get early access to the full creator's toolkit",
    cta: {
      text: 'Join the beta',
      href: '#beta-signup',
      subtitle: 'Tools for color, headlines, ideas, clarity, and more',
    },
  },
  {
    value: 'question',
    title: 'I just want to ask a question',
    description: 'Quick question, feedback, or just saying hi',
    cta: {
      text: 'Send a message',
      href: 'mailto:hello@example.com?subject=Question from Visitor Console',
      subtitle: 'I typically respond within 24 hours',
    },
  },
  {
    value: 'weird',
    title: 'Show me something weird',
    description: 'Experiments, side projects, and random explorations',
    cta: {
      text: 'Enter the lab',
      href: '#lab',
      subtitle: 'Unfinished, experimental, and occasionally broken',
    },
  },
];

export function InteractionChooser({ accentColor }: InteractionChooserProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionStyle | null>(null);
  
  const currentInteraction = interactions.find((i) => i.value === selectedInteraction);
  
  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            How would you like to interact?
          </h2>
          <p className="text-white/70">
            Choose what matches your current intent
          </p>
        </div>
        
        {/* Interaction options */}
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <button
              key={interaction.value}
              onClick={() =>
                setSelectedInteraction(
                  selectedInteraction === interaction.value ? null : interaction.value
                )
              }
              className={`
                w-full p-5 rounded-xl text-left transition-all border-2
                ${
                  selectedInteraction === interaction.value
                    ? 'bg-white/20 border-white/60'
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-white text-lg mb-1">
                    {interaction.title}
                  </div>
                  <div className="text-sm text-white/70">{interaction.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* CTA for selected interaction */}
        {currentInteraction && (
          <div className="mt-6 p-6 rounded-xl bg-white/15 border border-white/30 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-white/80 text-sm">{currentInteraction.cta.subtitle}</p>
            </div>
            
            <a
              href={currentInteraction.cta.href}
              className="block w-full py-4 px-6 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-center transition-all border border-white/40 hover:border-white/60"
              style={
                accentColor
                  ? {
                      background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                      borderColor: `${accentColor}60`,
                    }
                  : {}
              }
            >
              {currentInteraction.cta.text}
            </a>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
