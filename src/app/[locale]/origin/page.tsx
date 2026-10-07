import Link from 'next/link';
import type { Metadata } from 'next';
import { pages, routes, quoteHref } from '@/locales/pages';
import { company } from '@/lib/company';
import { pageMetadata, toLocale } from '@/lib/seo';
import { PageHeader, SectionHeading } from '@/components/Section';
import { CorridorMap } from '@/components/CorridorMap';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = pages[locale].origin;
  return pageMetadata(locale, routes.origin, t.title, t.subtitle);
}

export default async function OriginPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  const t = pages[locale].origin;

  return (
    <div className="flex flex-col">
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
        <Link href={quoteHref(locale, 'grain')} className="btn-primary no-underline">
          {t.cta} <FiArrowRight />
        </Link>
      </PageHeader>

      <section className="section-padding bg-white">
        <div className="container grid lg:grid-cols-2 gap-12 items-start">
          <div className="rounded-3xl border border-slate-200 bg-[#fbfbfa] p-6">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="font-bold text-slate-900">{t.mapTitle}</h2>
              <span className="text-sm text-slate-500">
                <strong className="text-slate-900 text-lg">{company.stats.collectionPoints}</strong> {t.pointsLabel}
              </span>
            </div>
            <CorridorMap
              plantLabel={`${locale === 'es' ? 'Planta' : 'Plant'} · ${company.address.region}`}
              riverLabel={locale === 'es' ? 'Río Apurímac · Ene' : 'Apurímac · Ene river'}
              className="w-full max-w-sm mx-auto h-auto"
            />
            <p className="text-xs text-slate-400 mt-2">{t.mapNote}</p>
          </div>

          <div>
            <SectionHeading title={t.howTitle} />
            <ul className="space-y-4">
              {t.how.map((h) => (
                <li key={h.t} className="flex gap-4">
                  <FiCheckCircle className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-slate-900">{h.t}</h3>
                    <p className="text-sm text-slate-500">{h.d}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">{t.calendarTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {t.calendar.map((c) => (
                <div key={c.t} className="rounded-2xl border border-slate-200 p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">{c.t}</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">{c.d}</div>
                  <div className="text-sm text-slate-500">{c.detail}</div>
                </div>
              ))}
            </div>
            {/* TODO: fotos de productores entregando, balanza y punto de acopio. */}
          </div>
        </div>
      </section>
    </div>
  );
}
