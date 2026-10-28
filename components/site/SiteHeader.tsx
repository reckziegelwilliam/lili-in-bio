import Link from 'next/link';
import { MiniConstellation } from './MiniConstellation';

// Notes and About join the nav when they have pages worth visiting.
export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
      <Link href="/" className="flex items-center gap-3 text-2xl font-medium tracking-tight text-[#ECE8DF] sm:text-3xl">
        <span>liam rex</span>
        <MiniConstellation className="h-6 w-9 text-white/80" />
      </Link>
      <nav aria-label="Main navigation" className="flex gap-6 text-sm text-[#ECE8DF]/70 sm:gap-8 sm:text-base">
        <a href="/#index" className="transition-colors hover:text-white">index</a>
      </nav>
    </header>
  );
}
