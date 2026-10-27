import { ImageResponse } from 'next/og';
import { featuredProjects } from '@/data/featured';

export const alt = 'liam rex project';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return featuredProjects.filter((p) => p.enabled && p.slug).map((p) => ({ slug: p.slug as string }));
}

export default function OpengraphImage({ params }: { params: { slug: string } }) {
  const project = featuredProjects.find((p) => p.enabled && p.slug === params.slug);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#05060a', color: 'white', padding: 80 }}>
        <div style={{ fontSize: 40, color: 'rgba(255,255,255,0.7)', display: 'flex' }}>liam rex</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 120, lineHeight: 1.05 }}>{project?.name ?? 'liam rex'}</div>
          <div style={{ fontSize: 40, color: 'rgba(255,255,255,0.65)', marginTop: 28 }}>{project?.description ?? ''}</div>
        </div>
      </div>
    ),
    size,
  );
}
