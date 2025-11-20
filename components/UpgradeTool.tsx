'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import type { TextType } from '@/types/visitor';

interface UpgradeToolProps {
  accentColor?: string;
}

const textTypes: { value: TextType; label: string; placeholder: string }[] = [
  {
    value: 'caption',
    label: 'Caption',
    placeholder: 'Paste your Instagram/social media caption here...',
  },
  {
    value: 'bio',
    label: 'Bio',
    placeholder: 'Paste your profile bio here...',
  },
  {
    value: 'message',
    label: 'Message',
    placeholder: 'Paste your message or email here...',
  },
  {
    value: 'tweet',
    label: 'Tweet',
    placeholder: 'Paste your tweet or post here...',
  },
];

export function UpgradeTool({ accentColor }: UpgradeToolProps) {
  const [inputText, setInputText] = useState('');
  const [textType, setTextType] = useState<TextType>('caption');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const handleUpgrade = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to upgrade');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setOutputText('');
    
    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          type: textType,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upgrade text');
      }
      
      const data = await response.json();
      setOutputText(data.upgraded);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Clipboard API not available
    }
  };
  
  return (
    <GlassCard className="p-6 md:p-8" accentColor={accentColor} glowIntensity="medium">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
            <span>One-Minute Text Upgrade</span>
          </h2>
          <p className="text-white/70">
            Paste any caption, bio, message, or tweet. Get clearer, stronger wording instantly.
          </p>
        </div>
        
        {/* Text type selector */}
        <div className="flex flex-wrap gap-2">
          {textTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setTextType(type.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  textType === type.value
                    ? 'bg-white/25 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        {/* Input textarea */}
        <div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={textTypes.find((t) => t.value === textType)?.placeholder}
            className="w-full h-32 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
            maxLength={500}
          />
          <div className="text-xs text-white/50 mt-1 text-right">
            {inputText.length}/500
          </div>
        </div>
        
        {/* Upgrade button */}
        <button
          onClick={handleUpgrade}
          disabled={isLoading || !inputText.trim()}
          className="w-full py-4 px-6 rounded-xl bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all border border-white/30 hover:border-white/50 disabled:border-white/10"
          style={
            accentColor && !isLoading && inputText.trim()
              ? {
                  background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                  borderColor: `${accentColor}60`,
                }
              : {}
          }
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-pulse-slow">Upgrading...</span>
            </span>
          ) : (
            'Upgrade Text'
          )}
        </button>
        
        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-white">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {/* Output */}
        {outputText && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Upgraded version:</h3>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-white/15 border border-white/30 text-white leading-relaxed">
              {outputText}
            </div>
            
            {/* Beta CTA after successful upgrade */}
            <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-white/80 text-sm mb-3">
                This is 1 tool from the full creator's toolkit platform. Get beta access for color generators, headline workshops, idea mixers, and more.
              </p>
              <a href="#beta-signup" className="text-white underline text-sm hover:text-white/80 transition-colors">
                Join the beta →
              </a>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
