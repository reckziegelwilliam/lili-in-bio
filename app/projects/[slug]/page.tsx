import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { featuredProjects } from '@/data/featured';

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
  const external = /^https?:\/\//.test(project.href);

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <SiteHeader />
      <article className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8 sm:px-10 sm:pt-14">
        <Link href="/#projects" className="text-sm text-white/60 transition-colors hover:text-white">
          ← all projects
        </Link>
        <h1 className="mt-8 text-5xl font-medium tracking-tight sm:text-6xl">{project.name}</h1>
        <p className="mt-4 text-xl text-white/70">{project.description}</p>
        {project.stage && <p className="mt-3 text-sm text-white/50">{project.stage}</p>}

        {external && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 border-b border-white/30 pb-3 text-lg transition-colors hover:border-white"
          >
            open {project.name} <span aria-hidden="true">↗</span>
          </a>
        )}

        <div className="mt-14">
          {project.about && project.about.length > 0 && (
            <Section title="what it is">
              {project.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Section>
          )}
          {project.forWhom && (
            <Section title="who it's for">
              <p>{project.forWhom}</p>
            </Section>
          )}
          {project.today && (
            <Section title="what exists today">
              <p>{project.today}</p>
            </Section>
          )}
        </div>
      </article>
    </main>
  );
}
