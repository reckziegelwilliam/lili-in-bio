import { projects } from '@/data/projects';
import { SKY_COLORS } from '@/data/experience';
import { layoutSky, placeForAspect, skyCamera } from '@/lib/experience/layout';
import type { Vec3Tuple } from '@/data/experience';

// The sky as a still picture, drawn from the same layout as the 3D scene. It sits under the canvas, so it is what a
// visitor sees while three.js loads, with reduced motion, or without WebGL. Decorative: the intro's buttons and the
// index are the way in.

// Scene units to SVG (y up becomes y down), framed like the 3D camera at rest for a screen of this shape.
function frame(aspect: number) {
  const cam = skyCamera(aspect);
  const halfH = Math.tan((20 * Math.PI) / 180) * cam.z;
  const halfW = halfH * aspect;
  return { x: cam.x - halfW, y: -(cam.y + halfH), w: halfW * 2, h: halfH * 2 };
}

function dots(VIEW: { x: number; y: number; w: number; h: number }) {
  let a = 11;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: 160 }, () => ({
    x: VIEW.x + rand() * VIEW.w,
    y: VIEW.y + rand() * VIEW.h,
    r: 0.02 + rand() * 0.045,
    o: 0.25 + rand() * 0.55,
  }));
}


/** Two framings, one per screen shape (CSS picks), since an SVG can't re-lay itself out like the 3D scene does. */
export function StaticSky() {
  return (
    <>
      <SkyPicture aspect={1.6} className="hidden sm:block" />
      <SkyPicture aspect={0.46} className="sm:hidden" />
    </>
  );
}

function SkyPicture({ aspect, className }: { aspect: number; className: string }) {
  const VIEW = frame(aspect);
  const DOTS = dots(VIEW);
  const { stars, links } = layoutSky(projects);
  const at = new Map<string, Vec3Tuple>(stars.map((s) => [s.id, placeForAspect(s.position, aspect)]));
  const sx = (x: number) => x;
  const sy = (y: number) => -y;
  const font = aspect < 1 ? 1.4 : 1;

  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ background: `radial-gradient(ellipse at 65% 35%, ${SKY_COLORS.midnight} 0%, ${SKY_COLORS.void} 70%)` }}
    >
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={SKY_COLORS.silver} opacity={d.o} />
      ))}
      {links.map((l) => {
        const a = at.get(l.from);
        const b = at.get(l.to);
        return a && b ? (
          <line key={`${l.from}-${l.to}`} x1={sx(a[0])} y1={sy(a[1])} x2={sx(b[0])} y2={sy(b[1])} stroke={SKY_COLORS.silver} strokeWidth={0.02} opacity={0.25} />
        ) : null;
      })}
      {stars.map((s) => {
        const p = at.get(s.id) as Vec3Tuple;
        const motif = s.featured?.motif;
        return (
          <g key={s.id} transform={`translate(${sx(p[0])} ${sy(p[1])})`}>
            {motif === 'contour' &&
              [0.62, 0.95, 1.32, 1.75].map((r, i) => (
                <ellipse key={i} rx={r} ry={r * 0.5} fill="none" stroke={s.color} strokeWidth={0.025} opacity={0.6 - i * 0.12} />
              ))}
            {motif === 'orbit' &&
              [0.8, 1.2, 1.6].map((r, i) => (
                <ellipse key={i} rx={r} ry={r * 0.55} transform={`rotate(${-20 + i * 25})`} fill="none" stroke={s.color} strokeWidth={0.02} opacity={0.3} />
              ))}
            {motif === 'eclipse' ? (
              <>
                <circle r={0.75} fill={s.color} opacity={0.12} />
                <circle r={0.56} fill="none" stroke={s.color} strokeWidth={0.08} />
                <circle r={0.5} fill="#020306" />
              </>
            ) : (
              <circle r={s.featured ? 0.28 : 0.13} fill={s.color} />
            )}
            <text
              x={s.featured ? (motif === 'eclipse' ? 1.1 : 2.1) : 0.35}
              y={0.12}
              fontSize={(s.featured ? 0.42 : 0.3) * font}
              fill={SKY_COLORS.starlight}
              opacity={s.featured ? 0.9 : 0.5}
            >
              {s.project.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
