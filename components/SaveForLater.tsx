'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';

interface SaveForLaterProps {
  accentColor?: string;
}

export function SaveForLater({ accentColor }: SaveForLaterProps) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Clipboard API not available
    }
  };
  
  const handleEmailLink = () => {
    const subject = encodeURIComponent('Link for later: Lili Visitor Console');
    const body = encodeURIComponent(
      `Here's that interesting link-in-bio page:\n\n${currentUrl}\n\n(Sent from the Visitor Console)`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };
  
  const handleOpenInBrowser = () => {
    // This is mainly for in-app browsers (Instagram, etc.)
    // Opens in default browser
    window.open(currentUrl, '_blank');
  };
  
  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Save for later
          </h2>
          <p className="text-white/70 text-sm">
            On mobile or in an in-app browser? Here are easy ways to revisit this page when you're at a keyboard.
          </p>
        </div>
        
        <div className="space-y-3">
          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 text-left transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white mb-1">Copy link</div>
                <div className="text-sm text-white/60">
                  Paste it anywhere you'll see it later
                </div>
              </div>
              <div className="text-2xl">{copied ? '[copied]' : '[link]'}</div>
            </div>
          </button>
          
          {/* Email to self */}
          <button
            onClick={handleEmailLink}
            className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 text-left transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white mb-1">Email this to yourself</div>
                <div className="text-sm text-white/60">
                  {emailSent ? 'Opening your email app...' : 'Send it to your inbox'}
                </div>
              </div>
              <div className="text-2xl">[mail]</div>
            </div>
          </button>
          
          {/* Open in browser */}
          <button
            onClick={handleOpenInBrowser}
            className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 text-left transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white mb-1">Open in external browser</div>
                <div className="text-sm text-white/60">
                  Better experience outside Instagram/TikTok
                </div>
              </div>
              <div className="text-2xl">[browser]</div>
            </div>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
