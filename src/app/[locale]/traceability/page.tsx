import Link from 'next/link';
import type { Metadata } from 'next';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';
import { SITE_URL } from '@/lib/config';
import { FiArrowLeft, FiCheck, FiShield } from 'react-icons/fi';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const isEs = raw !== 'en';
  const title = isEs
    ? `Trazabilidad y cumplimiento EUDR | ${company.name}`
    : `Traceability and EUDR compliance | ${company.name}`;
  const description = isEs
    ? 'Información de origen por lote y documentación de debida diligencia EUDR para compradores de café y cacao del VRAEM.'
    : 'Lot-level origin information and EUDR due-diligence documentation for buyers of VRAEM coffee and cocoa.';
  const url = `${SITE_URL}/${isEs ? 'es' : 'en'}/traceability`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { es: `${SITE_URL}/es/traceability`, en: `${SITE_URL}/en/traceability` },
    },
    openGraph: { title, description, url, type: 'website' },
  };
}

export default async function TraceabilityPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = raw === 'en' ? 'en' : 'es';
  const t = translations[locale].trace;
  const isEs = locale === 'es';

  return (
    <div className="section-padding bg-slate-50 flex-grow min-h-screen">
      <div className="container max-w-3xl">
        <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 text-sm font-semibold mb-8 no-underline">
          <FiArrowLeft />
          {isEs ? 'Volver a inicio' : 'Back home'}
        </Link>

        <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
          <FiShield size={13} /> EUDR
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{t.title}</h1>
        <p className="text-lg text-slate-500 mb-6">{t.subtitle}</p>
        <p className="text-sm text-slate-600 leading-relaxed mb-8">{t.body}</p>

        <ul className="space-y-3 mb-8">
          {t.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-white border border-slate-100 rounded-xl p-4">
              <FiCheck className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-400 italic mb-10">{t.disclaimer}</p>

        <Link href={`/${locale}#contact`} className="btn-primary no-underline">
          {isEs ? 'Solicitar expediente de origen' : 'Request origin file'}
        </Link>
      </div>
    </div>
  );
}
