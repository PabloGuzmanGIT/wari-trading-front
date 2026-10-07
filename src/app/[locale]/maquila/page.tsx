import Link from 'next/link';
import type { Metadata } from 'next';
import { pages, routes, quoteHref } from '@/locales/pages';
import { pageMetadata, toLocale } from '@/lib/seo';
import { PageHeader, SanitarySeal, SectionHeading } from '@/components/Section';
import { ContactForm } from '@/components/ContactForm';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = pages[locale].maquila;
  return pageMetadata(locale, routes.maquila, t.title, t.subtitle);
}

export default async function MaquilaPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  const t = pages[locale].maquila;
  const where = { own: t.own, partner: t.partner, both: t.both };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link href={quoteHref(locale, 'processing')} className="btn-primary no-underline justify-center">
            {t.cta} <FiArrowRight />
          </Link>
          <SanitarySeal label={t.seal} dark />
        </div>
      </PageHeader>

      {/* Servicios, mínimos y plazos */}
      <section className="section-padding bg-white">
        <div className="container">
          <SectionHeading title={t.tableTitle} />
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-900 text-white text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t.cols.service}</th>
                  <th className="px-5 py-3 font-semibold">{t.cols.min}</th>
                  <th className="px-5 py-3 font-semibold">{t.cols.time}</th>
                  <th className="px-5 py-3 font-semibold">{t.cols.where}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {t.rows.map((r) => (
                  <tr key={r.s} className="align-top">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{r.s}</td>
                    <td className="px-5 py-3.5 text-slate-600">{r.min}</td>
                    <td className="px-5 py-3.5 text-slate-600">{r.time}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block whitespace-nowrap text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${r.w === 'own' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {where[r.w]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3">{t.note}</p>
        </div>
      </section>

      {/* Equipamiento + ¿no tienes grano? */}
      <section className="section-padding bg-[#fbfbfa]">
        <div className="container grid lg:grid-cols-2 gap-10">
          <div>
            <SectionHeading title={t.equipmentTitle} />
            <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {t.equipment.map((e) => (
                <li key={e.t} className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="font-semibold text-slate-900">{e.t}</span>
                  <span className="text-sm text-slate-500 text-right">{e.v}</span>
                </li>
              ))}
            </ul>
            {/* TODO: fotos del tostador, refinador y descascarillador en operación. */}
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <SectionHeading title={t.stepsTitle} />
              <ol className="space-y-4">
                {t.steps.map((s, i) => (
                  <li key={s.t} className="flex gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <h3 className="font-bold text-slate-900">{s.t}</h3>
                      <p className="text-sm text-slate-500">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl bg-emerald-800 text-white p-6">
              <h3 className="font-bold text-lg mb-1">{t.grainTitle}</h3>
              <p className="text-sm text-emerald-100/90">{t.grainBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container max-w-3xl">
          <SectionHeading title={t.faqTitle} center />
          <div className="space-y-3">
            {t.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-semibold text-slate-900">
                  {f.q}
                  <FiChevronDown className="flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#fbfbfa]">
        <ContactForm locale={locale} initialNeed="processing" />
      </section>
    </div>
  );
}
