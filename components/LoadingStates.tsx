'use client';

import { useEffect, useState } from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-white/10 rounded-lg mb-3 w-3/4" />
      <div className="h-4 bg-white/10 rounded-lg mb-3 w-full" />
      <div className="h-4 bg-white/10 rounded-lg w-5/6" />
    </div>
  );
}

export function CardLoadingSkeleton() {
  return (
    <div className="glass rounded-3xl border backdrop-blur-xl bg-white/10 p-6 md:p-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-white/15 rounded-lg w-1/2 mb-4" />
        <LoadingSkeleton />
        <div className="h-32 bg-white/10 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export function PageLoadingState() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-white/80 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="text-white/90 text-xl font-medium">
            Preparing your experience{dots}
          </p>
          <p className="text-white/60 text-sm">
            Reading context and generating your unique aura
          </p>
        </div>
      </div>
    </main>
  );
}

