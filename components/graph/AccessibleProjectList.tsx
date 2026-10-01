import { VisuallyHidden } from '@/components/AccessibilityUtils';
import { projects } from '@/data/projects';

export function AccessibleProjectList() {
  const enabled = projects.filter((p) => p.enabled);

  return (
    <nav
      id="main-content"
      aria-label="Projects"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#05060a] px-6 py-16"
    >
      <VisuallyHidden>
        <h1>lili.in.bio</h1>
      </VisuallyHidden>
      <ul className="w-full max-w-md space-y-3">
        {enabled.map((project) => (
          <li key={project.name}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-white transition-colors hover:bg-white/10"
            >
              <span className="block text-lg font-bold">{project.name}</span>
              {project.description && (
                <span className="mt-1 block text-sm text-white/70">{project.description}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
