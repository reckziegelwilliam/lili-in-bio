// Core visitor snapshot types
export type VisitorSource = 'instagram' | 'tiktok' | 'twitter' | 'direct' | 'other';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ReadingMode = 'gist' | 'nerd' | 'reflective';
export type InteractionStyle = 'work' | 'question' | 'weird';

export interface VisitorSnapshot {
  source: VisitorSource;
  deviceType: DeviceType;
  localHour: number; // 0-23
  prefersDark: boolean;
  visitCount: number;
  readingMode: ReadingMode;
  language: string;
  timezone: string;
  isReturning: boolean;
  os?: string;
  browser?: string;
}

// Visual seed for generating unique backgrounds
export interface AuraSeed {
  s1: number; // 0-1
  s2: number; // 0-1
  s3: number; // 0-1
  s4: number; // 0-1
  s5: number; // 0-1
  s6: number; // 0-1
}

// Color palette types
export type TimeBand = 'dawn' | 'day' | 'golden' | 'night';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradientAngle: number;
  timeBand: TimeBand;
  hue1: number;
  hue2: number;
  hue3: number;
}

// Blob configuration for backgrounds
export interface BlobConfig {
  x: number; // percentage
  y: number; // percentage
  size: number; // rem
  color: string;
  blur: number; // px
  opacity: number;
  animationDelay: number; // seconds
  animationDuration: number; // seconds
}

// Text upgrade API types
export type TextType = 'caption' | 'bio' | 'message' | 'tweet';

export interface UpgradeRequest {
  text: string;
  type: TextType;
}

export interface UpgradeResponse {
  original: string;
  upgraded: string;
  improvements: string[];
}

// Mini systems types
export type ChaosType = 'tooManyIdeas' | 'messyClients' | 'toolOverload' | 'cantStart';

export interface MiniSystem {
  id: ChaosType;
  title: string;
  problem: string;
  system: {
    name: string;
    steps: string[];
    outcome: string;
  };
  templateLink?: string;
}

// Component prop types
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
}

export interface AuraBackgroundProps {
  snapshot: VisitorSnapshot;
  seed: AuraSeed;
  palette: ColorPalette;
  variant?: 'css' | 'svg' | 'canvas';
}

