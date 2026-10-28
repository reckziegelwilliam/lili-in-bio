import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getCategoryColor } from '@/lib/graph/categoryColors';
import { featuredProjects } from '@/data/projects';
import { outsideLink } from '@/lib/projects/links';
import { FEATURED_EXPERIENCE } from '@/data/experience';

interface PageProps {
  params: { slug: string };
}

const findProject = (slug: string) => featuredProjects.find((p) => p.enabled && p.slug === slug);

export function generateStaticParams() {
  return featuredProjects.filter((p) => p.enabled && p.slug).map((p) => ({ slug: p.slug as string }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = findProject(params.slug);
  if (!project) return {};
  const title = `${project.name} · liam rex`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description: project.description, type: 'article', url: `/projects/${project.slug}` },
    twitter: { card: 'summary_large_image', title, description: project.description },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-8 sm:grid sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
      <h2 className="mb-3 text-sm text-white/50 sm:mb-0">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-white/80">{children}</div>
    </section>
  );
}

export default function ProjectPage({ params }: PageProps) {
  const project = findProject(params.slug);
  if (!project) notFound();
  const site = outsideLink(project);
  const latest = project.recentImprovements ?? [];
  // Real project media, when chosen (data/experience.ts): the page leads with it.
  const media = project.slug ? FEATURED_EXPERIENCE[project.slug] : undefined;
  const hasMedia = !!(media?.poster && media.mediaAlt);
  const links = project.subLinks ?? [];

  return (
    <main className="min-h-screen bg-[#060914] text-[#ECE8DF]">
      <SiteHeader />
      <article className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8 sm:px-10 sm:pt-14">
        <Link href="/" className="text-sm text-white/60 transition-colors hover:text-white">
          ← back to the sky
        </Link>
        {hasMedia && media && (
          <figure className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            {media.previewVideo ? (
              <video className="block h-auto w-full" src={media.previewVideo} poster={media.poster} muted loop playsInline controls preload="none" aria-label={media.mediaAlt} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="block h-auto w-full" src={media.poster} alt={media.mediaAlt} />
            )}
            {media.mediaCaption && <figcaption className="px-4 py-3 text-sm text-[#ECE8DF]/60">{media.mediaCaption}</figcaption>}
          </figure>
        )}
        <h1 className="mt-8 font-display text-6xl tracking-tight sm:text-7xl">{project.name}</h1>
        <p className="mt-4 text-xl text-white/70">{project.description}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-white/50">
          <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: getCategoryColor(project.category) }} />
          {project.category.toLowerCase()}
        </p>

        {site && (
          <a
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 border-b border-white/30 pb-3 text-lg transition-colors hover:border-white"
          >
            open {project.name} <span aria-hidden="true">↗</span>
          </a>
        )}

        {/* Only what Project Pulse publishes for this project: its dated #public updates and its links. */}
        {(latest.length > 0 || links.length > 0) && (
          <div className="mt-14">
            {latest.length > 0 && (
              <Section title="latest">
                <ul className="space-y-3">
                  {latest.map((u) => (
                    <li key={`${u.date}-${u.text}`}>
                      <span className="mr-3 text-sm text-white/50">{u.date}</span>
                      {u.text}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {links.length > 0 && (
              <Section title="links">
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                        {l.name}
                      </a>
                      {l.description ? <span className="text-white/60"> — {l.description}</span> : null}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        )}
      </article>
    </main>
  );
}
