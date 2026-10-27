// The wordmark's small mark: a brighter star and a few smaller points joined by fine lines, echoing the large graph.
export function MiniConstellation({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 28" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.45" strokeLinecap="round">
        <path d="M20 14 L6 7" />
        <path d="M20 14 L33 5" />
        <path d="M20 14 L28 24" />
        <path d="M20 14 L9 22" />
        <path d="M33 5 L37 14" />
      </g>
      <g fill="currentColor">
        <circle cx="20" cy="14" r="2.6" />
        <circle cx="6" cy="7" r="1.3" opacity="0.7" />
        <circle cx="33" cy="5" r="1.5" opacity="0.7" />
        <circle cx="28" cy="24" r="1.2" opacity="0.7" />
        <circle cx="9" cy="22" r="1.1" opacity="0.7" />
        <circle cx="37" cy="14" r="1" opacity="0.7" />
      </g>
    </svg>
  );
}
