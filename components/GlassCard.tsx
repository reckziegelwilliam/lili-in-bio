'use client';

import type { GlassCardProps } from '@/types/visitor';

export function GlassCard({
  children,
  className = '',
  accentColor,
  glowIntensity = 'none',
}: GlassCardProps) {
  const glowStyles = {
    none: '',
    low: 'shadow-lg shadow-white/5',
    medium: 'shadow-xl shadow-white/10',
    high: 'shadow-2xl shadow-white/20',
  };
  
  const borderStyle = accentColor
    ? { borderColor: `${accentColor}40` } // 25% opacity
    : {};
  
  const glowStyle = accentColor && glowIntensity !== 'none'
    ? { boxShadow: `0 0 ${glowIntensity === 'high' ? '40' : glowIntensity === 'medium' ? '24' : '16'}px ${accentColor}20` }
    : {};
  
  return (
    <div
      className={`glass rounded-3xl border backdrop-blur-xl bg-white/10 ${glowStyles[glowIntensity]} ${className}`}
      style={{ ...borderStyle, ...glowStyle }}
    >
      {children}
    </div>
  );
}

