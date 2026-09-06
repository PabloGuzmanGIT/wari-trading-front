import { ImageResponse } from 'next/og';
import { company } from '@/lib/company';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = company.name;

// La marca (grano de café) como data URI, para el lockup del logo.
const beanMark =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268 356">
      <ellipse cx="134" cy="178" rx="134" ry="178" fill="#fbfbfa"/>
      <path d="M134 51 C157 87 157 130 134 160 C111 190 111 210 134 217" fill="none" stroke="#2f5d50" stroke-width="16" stroke-linecap="round"/>
    </svg>`,
  ).toString('base64');

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw === 'en' ? 'en' : 'es';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 76,
          background: '#0f172a',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={beanMark} width={44} height={58} alt="" />
          <div style={{ fontSize: 38, fontWeight: 800 }}>{company.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.12, maxWidth: 1000 }}>
            {company.tagline[locale]}
          </div>
          <div style={{ fontSize: 28, color: '#8fb4a8' }}>VRAEM · Ayacucho, Perú</div>
        </div>
      </div>
    ),
    size,
  );
}
