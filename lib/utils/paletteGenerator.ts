import type { VisitorSnapshot, AuraSeed, ColorPalette, TimeBand } from '@/types/visitor';
import { hslToHex, lerp, clamp } from './seedGenerator';

interface PaletteBand {
  name: TimeBand;
  hue1: number;
  hue2: number;
  hue3: number;
  saturation: number;
  lightness: number;
}

/**
 * Define the four time-of-day palette bands
 * All are in soft neon / pastel space (high lightness, medium-high saturation)
 */
const TIME_BANDS: PaletteBand[] = [
  {
    name: 'dawn',
    hue1: 170, // teal
    hue2: 30,  // peach
    hue3: 200, // soft cyan
    saturation: 65,
    lightness: 80,
  },
  {
    name: 'day',
    hue1: 180, // aqua
    hue2: 270, // lilac
    hue3: 200, // light blue
    saturation: 60,
    lightness: 82,
  },
  {
    name: 'golden',
    hue1: 350, // rose
    hue2: 45,  // amber/gold
    hue3: 20,  // warm orange
    saturation: 70,
    lightness: 78,
  },
  {
    name: 'night',
    hue1: 260, // indigo
    hue2: 320, // magenta
    hue3: 240, // deep purple
    saturation: 75,
    lightness: 75,
  },
];

/**
 * Select a palette band based on the local hour
 */
function selectTimeBand(hour: number): PaletteBand {
  if (hour >= 5 && hour < 10) {
    return TIME_BANDS[0]; // dawn
  } else if (hour >= 10 && hour < 17) {
    return TIME_BANDS[1]; // day
  } else if (hour >= 17 && hour < 21) {
    return TIME_BANDS[2]; // golden
  } else {
    return TIME_BANDS[3]; // night
  }
}

/**
 * Apply source-based color bias
 */
function applySourceBias(hue: number, source: VisitorSnapshot['source']): number {
  switch (source) {
    case 'instagram':
      // Shift towards pink/rose
      return (hue + 340) % 360;
    case 'tiktok':
      // Shift towards cyan/blue
      return (hue + 180) % 360;
    case 'twitter':
      // Shift towards blue
      return (hue + 200) % 360;
    default:
      return hue;
  }
}

/**
 * Apply reading mode adjustments to palette
 */
function applyReadingModeAdjustments(
  palette: PaletteBand,
  mode: VisitorSnapshot['readingMode']
): { saturation: number; lightness: number } {
  switch (mode) {
    case 'gist':
      // More contrast, brighter
      return {
        saturation: clamp(palette.saturation + 10, 60, 90),
        lightness: clamp(palette.lightness + 5, 75, 88),
      };
    case 'nerd':
      // Slightly subdued
      return {
        saturation: clamp(palette.saturation - 5, 50, 80),
        lightness: palette.lightness,
      };
    case 'reflective':
      // Softer, more diffused
      return {
        saturation: clamp(palette.saturation - 10, 50, 75),
        lightness: clamp(palette.lightness + 8, 75, 90),
      };
    default:
      return {
        saturation: palette.saturation,
        lightness: palette.lightness,
      };
  }
}

/**
 * Generate a complete color palette based on visitor snapshot and seed
 */
export function generatePalette(snapshot: VisitorSnapshot, seed: AuraSeed): ColorPalette {
  // Select base palette band from time of day
  const baseBand = selectTimeBand(snapshot.localHour);
  
  // Jitter hues based on seed values (±20 degrees)
  const hue1 = (baseBand.hue1 + (seed.s1 - 0.5) * 40 + 360) % 360;
  const hue2 = (baseBand.hue2 + (seed.s2 - 0.5) * 40 + 360) % 360;
  const hue3 = (baseBand.hue3 + (seed.s3 - 0.5) * 40 + 360) % 360;
  
  // Apply source bias to the primary hue
  const biasedHue1 = applySourceBias(hue1, snapshot.source);
  
  // Apply reading mode adjustments
  const { saturation, lightness } = applyReadingModeAdjustments(baseBand, snapshot.readingMode);
  
  // Generate gradient angle from seed
  const gradientAngle = Math.floor(seed.s4 * 360);
  
  // Generate color strings
  const primary = hslToHex(biasedHue1, saturation, lightness);
  const secondary = hslToHex(hue2, saturation, lightness);
  const accent = hslToHex(hue3, saturation + 5, lightness - 5);
  
  // Background is a darker version of the primary with more saturation
  const background = hslToHex(
    biasedHue1,
    clamp(saturation - 20, 30, 60),
    clamp(lightness - 35, 15, 30)
  );
  
  return {
    primary,
    secondary,
    accent,
    background,
    gradientAngle,
    timeBand: baseBand.name,
    hue1: biasedHue1,
    hue2,
    hue3,
  };
}

/**
 * Generate gradient CSS string
 */
export function generateGradientCSS(palette: ColorPalette, seed: AuraSeed): string {
  const angle = palette.gradientAngle;
  
  // Use seed to determine gradient type
  if (seed.s5 > 0.6) {
    // Radial gradient
    const posX = Math.floor(lerp(30, 70, seed.s1));
    const posY = Math.floor(lerp(30, 70, seed.s2));
    return `radial-gradient(circle at ${posX}% ${posY}%, ${palette.primary}, ${palette.secondary}, ${palette.background})`;
  } else if (seed.s5 > 0.3) {
    // Conic gradient
    const posX = Math.floor(lerp(40, 60, seed.s1));
    const posY = Math.floor(lerp(40, 60, seed.s2));
    return `conic-gradient(from ${angle}deg at ${posX}% ${posY}%, ${palette.primary}, ${palette.secondary}, ${palette.accent}, ${palette.primary})`;
  } else {
    // Linear gradient
    return `linear-gradient(${angle}deg, ${palette.primary}, ${palette.secondary}, ${palette.accent})`;
  }
}

