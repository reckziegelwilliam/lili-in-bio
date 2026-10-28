import { now, projects } from '@/data/projects';
import { projectHref } from '@/lib/projects/links';

/** What Liam is working on right now, one line each, as Pulse publishes it. Hidden until there is any. */
export function NowList() {
  if (now.length === 0) return null;
  const byName = new Map(projects.map((p) => [p.name.toLowerCase(), p]));

  return (
    <section aria-labelledby="now-title" className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
      <h2 id="now-title" className="mb-6 text-base text-[#ECE8DF]/80">now</h2>
      <ul className="space-y-4">
        {now.map((item) => {
          const project = byName.get(item.name.toLowerCase());
          const href = project ? projectHref(project) : item.href;
          const external = /^https?:\/\//.test(href);
          return (
            <li key={item.name} className="grid gap-x-6 gap-y-1 border-t border-white/10 pt-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-sm text-[#ECE8DF] hover:underline">
                {item.name}
              </a>
              <p className="text-[15px] leading-relaxed text-[#ECE8DF]/75">{item.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
