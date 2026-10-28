import { projects, updates } from '@/data/projects';
import { projectHref } from '@/lib/projects/links';

const SHOWN = 6;

/** The newest #public updates Pulse published, in Liam's words. Hidden until there are any. */
export function Lately() {
  if (updates.length === 0) return null;
  const byName = new Map(projects.map((p) => [p.name.toLowerCase(), p]));

  return (
    <section aria-labelledby="lately-title" className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
      <h2 id="lately-title" className="mb-6 text-base text-[#ECE8DF]/80">lately</h2>
      <ul className="space-y-4">
        {updates.slice(0, SHOWN).map((u) => {
          const project = byName.get(u.project.toLowerCase());
          const href = project ? projectHref(project) : u.href;
          const external = /^https?:\/\//.test(href);
          return (
            <li key={`${u.date}-${u.project}-${u.text}`} className="grid gap-x-6 gap-y-1 border-t border-white/10 pt-4 sm:grid-cols-[7rem_10rem_minmax(0,1fr)]">
              <time dateTime={u.date} className="text-sm text-[#ECE8DF]/50">
                {u.date}
              </time>
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-sm text-[#ECE8DF] hover:underline">
                {u.project}
              </a>
              <p className="text-[15px] leading-relaxed text-[#ECE8DF]/75">{u.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
