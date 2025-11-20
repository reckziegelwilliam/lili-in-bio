'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import type { ReadingMode } from '@/types/visitor';

interface BetaSignupProps {
  readingMode: ReadingMode;
  accentColor?: string;
  compact?: boolean;
}

export function BetaSignup({ readingMode, accentColor, compact = false }: BetaSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      setStatus('success');
      setMessage("You're on the list! Check your email for next steps.");
      setEmail('');
      setName('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
            disabled={isLoading || status === 'success'}
          />
          <button
            type="submit"
            disabled={isLoading || status === 'success'}
            className="w-full py-3 px-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold transition-all border border-white/30 hover:border-white/50"
            style={
              accentColor && !isLoading && status !== 'success'
                ? {
                    background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                    borderColor: `${accentColor}60`,
                  }
                : {}
            }
          >
            {isLoading ? 'Signing up...' : status === 'success' ? 'Signed up!' : 'Get beta access'}
          </button>
        </form>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              status === 'success'
                ? 'bg-green-500/20 border border-green-500/40 text-green-100'
                : 'bg-red-500/20 border border-red-500/40 text-red-100'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor} glowIntensity="medium">
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">
            Join the Beta
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {readingMode === 'gist'
              ? 'Get early access to a suite of creative tools built for makers'
              : readingMode === 'nerd'
              ? 'Be among the first to access our creator\'s toolkit platform. No-BS tools for design, writing, and product thinking.'
              : 'This text upgrade tool is just the beginning. The full platform includes tools for color, naming, headlines, systems design, and more.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              disabled={isLoading || status === 'success'}
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              disabled={isLoading || status === 'success'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || status === 'success'}
            className="w-full py-4 px-6 rounded-lg bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all border border-white/30 hover:border-white/50"
            style={
              accentColor && !isLoading && status !== 'success'
                ? {
                    background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                    borderColor: `${accentColor}60`,
                  }
                : {}
            }
          >
            {isLoading ? 'Signing up...' : status === 'success' ? "You're in!" : 'Request beta access'}
          </button>
        </form>

        {message && (
          <div
            className={`max-w-md mx-auto p-4 rounded-lg ${
              status === 'success'
                ? 'bg-green-500/20 border border-green-500/40 text-green-100'
                : 'bg-red-500/20 border border-red-500/40 text-red-100'
            }`}
          >
            <p className="text-center">{message}</p>
          </div>
        )}

        {readingMode === 'nerd' && (
          <div className="pt-4 border-t border-white/20 text-center">
            <p className="text-white/60 text-sm">
              Privacy-first. No spam. Just updates when we launch new tools.
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

