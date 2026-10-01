export type VisitorSource = 'instagram' | 'tiktok' | 'twitter' | 'direct' | 'other';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface VisitorSnapshot {
  source: VisitorSource;
  deviceType: DeviceType;
  localHour: number; // 0-23
  prefersDark: boolean;
  visitCount: number;
  language: string;
  timezone: string;
  isReturning: boolean;
  os?: string;
  browser?: string;
}
