'use client';

import type { AuraBackgroundProps, BlobConfig } from '@/types/visitor';
import { hslToRgba, mapRange } from '@/lib/utils/seedGenerator';
import { generateGradientCSS } from '@/lib/utils/paletteGenerator';

/**
 * Generate blob configurations from seed and palette
 */
function generateBlobs(props: AuraBackgroundProps): BlobConfig[] {
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
    
    blobs.push({
      x: mapRange(s, 0, 1, 10, 90),
      y: mapRange(seeds[(i + 1) % blobCount], 0, 1, 10, 90),
      size: mapRange(s, 0, 1, 15, 35),
      color: hslToRgba(
        hue + (s - 0.5) * 20,
        mapRange(s, 0, 1, 60, 80),
        mapRange(s, 0, 1, 70, 85),
        mapRange(s, 0, 1, 0.4, 0.7)
      ),
      blur: mapRange(s, 0, 1, 60, 120),
      opacity: mapRange(s, 0, 1, 0.5, 0.8),
      animationDelay: i * (4 / speedMultiplier),
      animationDuration: mapRange(s, 0, 1, 25, 35) / speedMultiplier,
    });
  }
  
  return blobs;
}

export function CSSAuraBackground(props: AuraBackgroundProps) {
  const blobs = generateBlobs(props);
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
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: gradientCSS,
        }}
      />
      
      {/* Blobs */}
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full mix-blend-screen ${
            prefersReducedMotion ? '' : animations[i]
          }`}
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
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
        }}
      />
    </div>
  );
}

