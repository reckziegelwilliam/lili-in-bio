'use client';

import type { AuraBackgroundProps, BlobConfig } from '@/types/visitor';
import { hslToRgba, mapRange } from '@/lib/utils/seedGenerator';
import { generateGradientCSS } from '@/lib/utils/paletteGenerator';
import { useTheme } from '@/lib/hooks/useTheme';

/**
 * Generate blob configurations from seed and palette
 */
function generateBlobs(props: AuraBackgroundProps, isDark: boolean): BlobConfig[] {
  const { seed, palette, snapshot } = props;
  const blobs: BlobConfig[] = [];
  
  // Motion speed adjustment based on reading mode
  let speedMultiplier = 1;
  if (snapshot.readingMode === 'gist') speedMultiplier = 1.2;
  if (snapshot.readingMode === 'nerd') speedMultiplier = 0.8;
  if (snapshot.readingMode === 'reflective') speedMultiplier = 0.6;
  
  // Generate 6 blobs with varying properties
  const blobCount = 6;
  const seeds = [seed.s1, seed.s2, seed.s3, seed.s4, seed.s5, seed.s6];
  const hues = [palette.hue1, palette.hue2, palette.hue3, palette.hue1, palette.hue2, palette.hue3];
  
  for (let i = 0; i < blobCount; i++) {
    const s = seeds[i];
    const hue = hues[i];
    
    // Adjust lightness and opacity based on theme (darker overall)
    const lightness = isDark 
      ? mapRange(s, 0, 1, 50, 65)  // Darker blobs in dark mode
      : mapRange(s, 0, 1, 45, 60); // Darker blobs in light mode
    const opacity = isDark
      ? mapRange(s, 0, 1, 0.4, 0.65)
      : mapRange(s, 0, 1, 0.35, 0.55);
    
    blobs.push({
      x: mapRange(s, 0, 1, 10, 90),
      y: mapRange(seeds[(i + 1) % blobCount], 0, 1, 10, 90),
      size: mapRange(s, 0, 1, 15, 35),
      color: hslToRgba(
        hue + (s - 0.5) * 20,
        mapRange(s, 0, 1, 60, 80),
        lightness,
        opacity
      ),
      blur: mapRange(s, 0, 1, 60, 120),
      opacity: opacity,
      animationDelay: i * (4 / speedMultiplier),
      animationDuration: mapRange(s, 0, 1, 25, 35) / speedMultiplier,
    });
  }
  
  return blobs;
}

export function CSSAuraBackground(props: AuraBackgroundProps) {
  const { isDark, mounted } = useTheme();
  const blobs = generateBlobs(props, isDark);
  const gradientCSS = generateGradientCSS(props.palette, props.seed);
  
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const animations = [
    'animate-blob-drift-1',
    'animate-blob-drift-2',
    'animate-blob-drift-3',
    'animate-blob-drift-4',
    'animate-blob-drift-5',
    'animate-blob-drift-6',
  ];

  if (!mounted) return null;
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden transition-colors duration-500">
      {/* Base gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: gradientCSS,
          opacity: isDark ? 1 : 0.6,
        }}
      />
      
      {/* Blobs */}
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full transition-opacity duration-500 ${
            isDark ? 'mix-blend-screen' : 'mix-blend-multiply'
          } ${prefersReducedMotion ? '' : animations[i]}`}
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}rem`,
            height: `${blob.size}rem`,
            background: blob.color,
            filter: `blur(${blob.blur}px)`,
            opacity: blob.opacity,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${blob.animationDelay}s`,
          }}
        />
      ))}
      
      {/* Glossy overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
        }}
      />
      
      {/* Darkening overlay for both modes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'rgba(0,0,0,0.15)'
            : 'rgba(0,0,0,0.08)',
        }}
      />
    </div>
  );
}

