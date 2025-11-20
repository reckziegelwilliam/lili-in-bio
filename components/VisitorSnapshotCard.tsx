'use client';

import { GlassCard } from './GlassCard';
import type { VisitorSnapshot } from '@/types/visitor';

interface VisitorSnapshotCardProps {
  snapshot: VisitorSnapshot;
  accentColor?: string;
}

function getSourceDisplay(source: VisitorSnapshot['source']): string {
  const sources = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    twitter: 'Twitter',
    direct: 'directly (or bookmarked)',
    other: 'another site',
  };
  return sources[source];
}

function getTimeContext(hour: number): string {
  if (hour >= 5 && hour < 10) return 'early morning';
  if (hour >= 10 && hour < 12) return 'late morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21 || hour < 2) return 'night';
  return 'very late at night';
}

function getDeviceEmoji(deviceType: VisitorSnapshot['deviceType']): string {
  return deviceType === 'mobile' ? '📱' : deviceType === 'tablet' ? '💻' : '🖥️';
}

export function VisitorSnapshotCard({ snapshot, accentColor }: VisitorSnapshotCardProps) {
  const sourceDisplay = getSourceDisplay(snapshot.source);
  const timeContext = getTimeContext(snapshot.localHour);
  const deviceEmoji = getDeviceEmoji(snapshot.deviceType);
  const modeEmoji = snapshot.prefersDark ? '🌙' : '☀️';
  
  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor} glowIntensity="low">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <span>👋</span>
          <span>Here's what I know about this visit</span>
        </h2>
        
        <div className="text-white/90 text-base md:text-lg space-y-3">
          <p className="leading-relaxed">
            You're here from <strong className="text-white">{sourceDisplay}</strong> on{' '}
            <strong className="text-white">{snapshot.deviceType} {deviceEmoji}</strong>, in{' '}
            <strong className="text-white">{snapshot.prefersDark ? 'dark' : 'light'} mode {modeEmoji}</strong>,{' '}
            during the <strong className="text-white">{timeContext}</strong>
            {snapshot.isReturning && (
              <>, and this is <strong className="text-white">visit #{snapshot.visitCount}</strong> 🎉</>
            )}
            {!snapshot.isReturning && <>, and this is your <strong className="text-white">first visit</strong></>}.
          </p>
          
          {snapshot.deviceType === 'mobile' && (
            <p className="text-sm text-white/70 mt-3 p-3 bg-white/5 rounded-lg">
              📱 I'll keep this thumb-friendly and concise for mobile.
            </p>
          )}
          
          {snapshot.isReturning && (
            <p className="text-sm text-white/70 mt-3 p-3 bg-white/5 rounded-lg">
              💫 Welcome back! The background evolves with each visit.
            </p>
          )}
        </div>
        
        {/* Optional: Show additional details */}
        <details className="mt-4">
          <summary className="text-sm text-white/60 cursor-pointer hover:text-white/80 transition-colors">
            Technical details
          </summary>
          <div className="mt-3 p-4 bg-white/5 rounded-lg text-sm text-white/70 space-y-2">
            <p><strong>Browser:</strong> {snapshot.browser || 'Unknown'}</p>
            <p><strong>OS:</strong> {snapshot.os || 'Unknown'}</p>
            <p><strong>Language:</strong> {snapshot.language}</p>
            <p><strong>Timezone:</strong> {snapshot.timezone}</p>
            <p><strong>Local time:</strong> {snapshot.localHour}:00</p>
          </div>
        </details>
      </div>
    </GlassCard>
  );
}

