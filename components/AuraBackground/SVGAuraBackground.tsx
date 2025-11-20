'use client';

import type { AuraBackgroundProps, BlobConfig } from '@/types/visitor';
import { hslToRgba, mapRange } from '@/lib/utils/seedGenerator';

/**
 * Generate blob configurations from seed and palette
 */
function generateBlobs(props: AuraBackgroundProps): BlobConfig[] {
  const { seed, palette, snapshot } = props;
  const blobs: BlobConfig[] = [];
  
  let speedMultiplier = 1;
  if (snapshot.readingMode === 'gist') speedMultiplier = 1.2;
  if (snapshot.readingMode === 'nerd') speedMultiplier = 0.8;
  if (snapshot.readingMode === 'reflective') speedMultiplier = 0.6;
  
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
        1
      ),
      blur: mapRange(s, 0, 1, 60, 120),
      opacity: mapRange(s, 0, 1, 0.5, 0.8),
      animationDelay: i * (4 / speedMultiplier),
      animationDuration: mapRange(s, 0, 1, 25, 35) / speedMultiplier,
    });
  }
  
  return blobs;
}

export function SVGAuraBackground(props: AuraBackgroundProps) {
  const blobs = generateBlobs(props);
  const { palette } = props;
  
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradient definition */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.primary} stopOpacity="1" />
            <stop offset="50%" stopColor={palette.secondary} stopOpacity="1" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="1" />
          </linearGradient>
          
          {/* Blur filters for each blob */}
          {blobs.map((blob, i) => (
            <filter key={`filter-${i}`} id={`blur-${i}`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={blob.blur / 3} />
            </filter>
          ))}
          
          {/* Glossy overlay gradient */}
          <linearGradient id="glossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="30%" stopColor="white" stopOpacity="0" />
            <stop offset="70%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Base gradient rect */}
        <rect width="100%" height="100%" fill="url(#bgGradient)" />
        
        {/* Blob circles */}
        {blobs.map((blob, i) => {
          const cx = blob.x;
          const cy = blob.y;
          const r = (blob.size / 2) * 16; // Convert rem to approximate pixels
          
          return (
            <circle
              key={`blob-${i}`}
              cx={`${cx}%`}
              cy={`${cy}%`}
              r={r}
              fill={blob.color}
              opacity={blob.opacity}
              filter={`url(#blur-${i})`}
              style={{
                mixBlendMode: 'screen',
              }}
            >
              {!prefersReducedMotion && (
                <>
                  <animate
                    attributeName="cx"
                    values={`${cx}%;${cx + 3}%;${cx - 2}%;${cx}%`}
                    dur={`${blob.animationDuration}s`}
                    repeatCount="indefinite"
                    begin={`${blob.animationDelay}s`}
                  />
                  <animate
                    attributeName="cy"
                    values={`${cy}%;${cy - 3}%;${cy + 2}%;${cy}%`}
                    dur={`${blob.animationDuration}s`}
                    repeatCount="indefinite"
                    begin={`${blob.animationDelay}s`}
                  />
                  <animate
                    attributeName="r"
                    values={`${r};${r * 1.1};${r * 0.9};${r}`}
                    dur={`${blob.animationDuration}s`}
                    repeatCount="indefinite"
                    begin={`${blob.animationDelay}s`}
                  />
                </>
              )}
            </circle>
          );
        })}
        
        {/* Glossy overlay */}
        <rect width="100%" height="100%" fill="url(#glossGradient)" />
      </svg>
    </div>
  );
}

