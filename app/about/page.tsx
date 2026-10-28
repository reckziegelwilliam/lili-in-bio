import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { about, outreach } from '@/data/projects';

// Everything here is Pulse's public-about.md and public-outreach.md, as Liam wrote them. No page until About exists.

export function generateMetadata(): Metadata {
  if (!about) return {};
  return {
    title: 'about · liam rex',
    description: about.bio.split(/\n\s*\n/)[0].slice(0, 160),
    alternates: { canonical: '/about' },
  };
}

const external = (href: string) => /^https?:\/\//.test(href);

export default function AboutPage() {
  if (!about) notFound();

  return (
    <main className="min-h-screen bg-[#060914] text-[#ECE8DF]">
      <SiteHeader />
      <article className="mx-auto w-full max-w-3xl px-6 pb-20 pt-8 sm:px-10 sm:pt-14">
        <h1 className="font-display text-6xl tracking-tight sm:text-7xl">about</h1>
        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-[#ECE8DF]/80">
          {about.bio.split(/\n\s*\n/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {about.links.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            {about.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} {...(external(l.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        {outreach.length > 0 && (
          <section aria-labelledby="outreach-title" className="mt-16">
            <h2 id="outreach-title" className="mb-4 text-base text-[#ECE8DF]/80">open to</h2>
            <ul className="space-y-4">
              {outreach.map((o) => (
                <li key={o.title} className="border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#ECE8DF]/50">{o.kind}</p>
                  <a href={o.href} {...(external(o.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="mt-1 block font-display text-2xl hover:underline">
                    {o.title}
                  </a>
                  <p className="mt-1 text-[15px] text-[#ECE8DF]/75">{o.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {about.contact && <p className="mt-16 text-[15px] text-[#ECE8DF]/70">{about.contact}</p>}
      </article>
    </main>
  );
}
