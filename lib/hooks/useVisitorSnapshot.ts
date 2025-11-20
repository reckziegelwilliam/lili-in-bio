'use client';

import { useEffect, useState } from 'react';
import type { VisitorSnapshot, VisitorSource, DeviceType, ReadingMode } from '@/types/visitor';

const STORAGE_KEYS = {
  VISIT_COUNT: 'visitor_visit_count',
  FIRST_VISIT: 'visitor_first_visit',
  READING_MODE: 'visitor_reading_mode',
};

function detectSource(): VisitorSource {
  if (typeof window === 'undefined') return 'direct';
  
  const referrer = document.referrer.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source')?.toLowerCase();
  
  if (referrer.includes('instagram') || utmSource === 'instagram' || urlParams.has('igshid')) {
    return 'instagram';
  }
  if (referrer.includes('tiktok') || utmSource === 'tiktok') {
    return 'tiktok';
  }
  if (referrer.includes('twitter') || referrer.includes('t.co') || utmSource === 'twitter') {
    return 'twitter';
  }
  if (referrer === '' || referrer.includes(window.location.hostname)) {
    return 'direct';
  }
  
  return 'other';
}

function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  
  // Check for tablet
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || 
      (width >= 768 && width <= 1024)) {
    return 'tablet';
  }
  
  // Check for mobile
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua) || 
      width < 768) {
    return 'mobile';
  }
  
  return 'desktop';
}

function detectOS(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  
  return 'unknown';
}

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  
  if (ua.includes('Instagram')) return 'Instagram In-App';
  if (ua.includes('FBAN') || ua.includes('FBAV')) return 'Facebook In-App';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edge')) return 'Edge';
  
  return 'unknown';
}

function getLocalHour(): number {
  const now = new Date();
  return now.getHours();
}

function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'unknown';
  }
}

function getLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  return navigator.language || 'en';
}

function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getStoredReadingMode(): ReadingMode | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.READING_MODE);
    if (stored && ['gist', 'nerd', 'reflective'].includes(stored)) {
      return stored as ReadingMode;
    }
  } catch {
    // localStorage not available
  }
  
  return null;
}

function updateVisitCount(): { count: number; isReturning: boolean } {
  if (typeof window === 'undefined') return { count: 1, isReturning: false };
  
  try {
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    const countStr = localStorage.getItem(STORAGE_KEYS.VISIT_COUNT);
    const count = countStr ? parseInt(countStr, 10) : 0;
    
    if (!firstVisit) {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, new Date().toISOString());
      localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, '1');
      return { count: 1, isReturning: false };
    }
    
    const newCount = count + 1;
    localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, newCount.toString());
    return { count: newCount, isReturning: true };
  } catch {
    return { count: 1, isReturning: false };
  }
}

function getDefaultReadingMode(deviceType: DeviceType, source: VisitorSource): ReadingMode {
  // Mobile users from social media likely want quick info
  if (deviceType === 'mobile' && (source === 'instagram' || source === 'tiktok')) {
    return 'gist';
  }
  
  // Desktop users or direct visitors might want more detail
  if (deviceType === 'desktop') {
    return 'nerd';
  }
  
  return 'gist';
}

export function useVisitorSnapshot(): VisitorSnapshot | null {
  const [snapshot, setSnapshot] = useState<VisitorSnapshot | null>(null);
  
  useEffect(() => {
    // Small delay to ensure all browser APIs are ready
    const timer = setTimeout(() => {
      const source = detectSource();
      const deviceType = detectDeviceType();
      const { count, isReturning } = updateVisitCount();
      
      const storedMode = getStoredReadingMode();
      const defaultMode = getDefaultReadingMode(deviceType, source);
      
      const visitorSnapshot: VisitorSnapshot = {
        source,
        deviceType,
        localHour: getLocalHour(),
        prefersDark: prefersDarkMode(),
        visitCount: count,
        readingMode: storedMode || defaultMode,
        language: getLanguage(),
        timezone: getTimezone(),
        isReturning,
        os: detectOS(),
        browser: detectBrowser(),
      };
      
      setSnapshot(visitorSnapshot);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return snapshot;
}

export function updateReadingMode(mode: ReadingMode): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.READING_MODE, mode);
  } catch {
    // localStorage not available
  }
}

