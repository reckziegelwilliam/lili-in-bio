'use client';

import { useTheme, ThemePreference } from '@/lib/hooks/useTheme';

interface ThemeToggleProps {
  accentColor?: string;
}

export function ThemeToggle({ accentColor = '#fff' }: ThemeToggleProps) {
  const { theme, preference, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  const options: { value: ThemePreference; label: string; icon: JSX.Element }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      value: 'system',
      label: 'Auto',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
  ];

  const isDark = theme === 'dark';

  return (
    <div 
      className={`inline-flex rounded-full p-1 ${
        isDark ? 'bg-white/10' : 'bg-black/10'
      } backdrop-blur-sm`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            preference === option.value
              ? isDark
                ? 'bg-white/20 text-white'
                : 'bg-black/20 text-gray-900'
              : isDark
                ? 'text-white/50 hover:text-white/80'
                : 'text-black/50 hover:text-black/80'
          }`}
          style={
            preference === option.value
              ? { boxShadow: `0 0 12px ${accentColor}40` }
              : undefined
          }
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
