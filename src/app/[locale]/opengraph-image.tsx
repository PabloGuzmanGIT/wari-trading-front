import { ImageResponse } from 'next/og';
import { company } from '@/lib/company';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = company.name;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#2f5d50' }} />
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
