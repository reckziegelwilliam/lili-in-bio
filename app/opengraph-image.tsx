import { ImageResponse } from 'next/og';

export const alt = 'liam rex';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#05060a', color: 'white', padding: 80 }}>
        <div style={{ fontSize: 44, display: 'flex' }}>liam rex</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 104, lineHeight: 1.05 }}>curious everywhere.</div>
          <div style={{ fontSize: 36, color: 'rgba(255,255,255,0.65)', marginTop: 32 }}>software engineer in space. founder tools, climate maps, a horror RPG.</div>
        </div>
      </div>
    ),
    size,
  );
}
