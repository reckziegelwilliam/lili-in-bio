'use client';

import type { Affinity } from '@/data/experience';

interface SkyLegendProps {
  items: { id: Affinity; label: string; color: string; count: number }[];
  /** The group held by a click (how touch and keyboard users hold a highlight); null when none. */
  pinned: Affinity | null;
  onHover: (affinity: Affinity | null) => void;
  onPin: (affinity: Affinity | null) => void;
}

/** The sky's key: three groups. Hover or focus lights one; click holds it. */
export function SkyLegend({ items, pinned, onHover, onPin }: SkyLegendProps) {
  return (
    <ul aria-label="Groups" className="flex flex-col items-end gap-1 text-xs text-[#ECE8DF]/60">
      {items.map(({ id, label, color, count }) => {
        const active = pinned === id;
        return (
          <li key={id}>
            <button
              type="button"
              aria-pressed={active}
              onMouseEnter={() => onHover(id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(id)}
              onBlur={() => onHover(null)}
              onClick={() => onPin(active ? null : id)}
              className={`flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:text-white focus-visible:text-white ${active ? 'bg-white/10 text-white' : ''}`}
            >
              {label}
              <span className="text-[#ECE8DF]/35">{count}</span>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
