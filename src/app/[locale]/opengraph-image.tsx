import { ImageResponse } from 'next/og';
import { company } from '@/lib/company';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = company.name;

// Marca «Cumbre» (sierra + río) como data URI, para el lockup del logo.
const cumbreMark =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300">
      <path d="M-16 232 L96 60 L168 160 L246 10 L322 160 L400 74 L536 232 Z" fill="#fbfbfa"/>
      <path d="M-16 232 C70 210 120 220 182 202 C232 188 250 160 276 162 C316 166 340 216 400 228 C452 238 496 220 536 226 L536 300 L-16 300 Z" fill="#2f5d50"/>
      <path d="M-8 258 C74 238 126 248 186 232 C234 219 252 196 276 198 C314 202 338 240 396 252 C448 262 492 246 520 252" fill="none" stroke="#6f9a8d" stroke-width="8" stroke-linecap="round"/>
    </svg>`,
  ).toString('base64');

// Escena completa (montaña + río al centro + grano de café y mazorca de cacao a los
// costados) como banda al pie: es la miniatura donde el diseño rico sí tiene lienzo.
const sceneBand =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="210" viewBox="0 0 1200 210">
      <path d="M0 210 V96 L150 40 L300 104 L440 30 L580 100 L720 44 L880 104 L1030 52 L1160 96 L1200 76 V210 Z" fill="#16283e"/>
      <path d="M0 210 V132 L190 88 L380 140 L560 84 L780 138 L980 90 L1200 132 V210 Z" fill="#204030"/>
      <path d="M0 210 V168 C140 154 240 182 380 170 C540 156 640 186 800 174 C940 164 1060 186 1200 172 V210 Z" fill="#2f5d50"/>
      <path d="M0 182 C140 168 240 196 380 184 C540 170 640 200 800 188 C940 178 1060 200 1200 186" fill="none" stroke="#6f9a8d" stroke-width="5"/>
      <g transform="translate(92 150)">
        <ellipse cx="0" cy="0" rx="30" ry="40" fill="#fbfbfa"/>
        <path d="M0 -34 C13 -14 13 14 0 34" fill="none" stroke="#2f5d50" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g transform="translate(1108 150)">
        <path d="M0 -46 C27 -30 27 30 0 46 C-27 30 -27 -30 0 -46 Z" fill="#fbfbfa"/>
        <path d="M0 -40 L0 40 M-15 -34 L-15 34 M15 -34 L15 34" fill="none" stroke="#2f5d50" stroke-width="5" stroke-linecap="round"/>
      </g>
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
          background: 'linear-gradient(180deg, #0f172a 0%, #14233c 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <img
          src={sceneBand}
          width={1200}
          height={210}
          alt=""
          style={{ position: 'absolute', bottom: 0, left: 0 }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={cumbreMark} width={62} height={36} alt="" />
          <div style={{ fontSize: 38, fontWeight: 800 }}>{company.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.12, maxWidth: 1000 }}>
            {company.tagline[locale]}
          </div>
          <div style={{ fontSize: 28, color: '#9ec7bb' }}>VRAEM · Ayacucho, Perú</div>
        </div>

        <div style={{ display: 'flex', height: 150 }} />
      </div>
    ),
    size,
  );
}
