'use client';

import { getCategoryColor } from '@/lib/graph/categoryColors';

interface GraphLegendProps {
  categories: { category: string; count: number }[];
  /** The group chosen by clicking (and the one a keyboard or touch user is on); null when none. */
  pinned: string | null;
  onHover: (category: string | null) => void;
  onPin: (category: string | null) => void;
}

// The constellation's key: each group with its colour. Hovering or focusing one highlights that group in the graph
// and clicking holds it, so touch and keyboard users get the same view as a pointer.
export function GraphLegend({ categories, pinned, onHover, onPin }: GraphLegendProps) {
  return (
    <ul aria-label="Groups" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
      {categories.map(({ category, count }) => {
        const active = pinned === category;
        return (
          <li key={category}>
            <button
              type="button"
              aria-pressed={active}
              onMouseEnter={() => onHover(category)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(category)}
              onBlur={() => onHover(null)}
              onClick={() => onPin(active ? null : category)}
              className={`flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:text-white focus-visible:text-white ${
                active ? 'bg-white/10 text-white' : ''
              }`}
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: getCategoryColor(category) }} />
              {category.toLowerCase()}
              <span className="text-white/40">{count}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
