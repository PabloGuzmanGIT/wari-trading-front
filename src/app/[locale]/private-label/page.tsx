import Link from 'next/link';
import type { Metadata } from 'next';
import { pages, routes, quoteHref } from '@/locales/pages';
import { pageMetadata, toLocale } from '@/lib/seo';
import { PageHeader, SanitarySeal, SectionHeading } from '@/components/Section';
import { ContactForm } from '@/components/ContactForm';
import { FiArrowRight } from 'react-icons/fi';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = pages[locale].privateLabel;
  return pageMetadata(locale, routes.privateLabel, t.title, t.subtitle);
}

export default async function PrivateLabelPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  const t = pages[locale].privateLabel;

  return (
    <div className="flex flex-col">
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
        <Link href={quoteHref(locale, 'brand')} className="btn-primary no-underline">
          {t.cta} <FiArrowRight />
        </Link>
      </PageHeader>

      <section className="section-padding bg-white">
        <div className="container">
          <SectionHeading title={t.productsTitle} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.products.map((p) => (
              <div key={p.t} className="rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-1">{p.t}</h3>
                <p className="text-sm text-slate-500">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#fbfbfa]">
        <div className="container">
          <SectionHeading title={t.stepsTitle} />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {t.steps.map((s, i) => (
              <li key={s.t} className="rounded-2xl bg-white border border-slate-200 p-5">
                <span className="text-3xl font-extrabold text-emerald-200 font-headings">0{i + 1}</span>
                <h3 className="font-bold text-slate-900 mt-2">{s.t}</h3>
                <p className="text-sm text-slate-500 mt-1">{s.d}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:flex sm:items-start sm:gap-6">
            <SanitarySeal label={pages[locale].maquila.seal} />
            <div className="mt-4 sm:mt-0">
              <h3 className="font-bold text-slate-900">{t.sanitaryTitle}</h3>
              <p className="text-sm text-slate-600 mt-1">{t.sanitaryBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <ContactForm locale={locale} initialNeed="brand" />
      </section>
    </div>
  );
}
