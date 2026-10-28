import type { MetadataRoute } from 'next';
import { about, featuredProjects } from '@/data/projects';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://liamrex.world';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/` },
    ...(about ? [{ url: `${base}/about` }] : []),
    ...featuredProjects.filter((p) => p.enabled && p.slug).map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
