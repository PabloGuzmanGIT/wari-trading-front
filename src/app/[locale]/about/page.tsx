import Link from 'next/link';
import type { Metadata } from 'next';
import { translations } from '@/locales/translations';
import { pages, routes, quoteHref } from '@/locales/pages';
import { pageMetadata, toLocale } from '@/lib/seo';
import { SITE_URL } from '@/lib/company';
import { PageHeader, SectionHeading } from '@/components/Section';
import { QualityProcess } from '@/components/QualityProcess';
import { Certifications } from '@/components/Certifications';
import { CompanyFacts } from '@/components/CompanyFacts';
import { Faq } from '@/components/Faq';
import { FiArrowRight } from 'react-icons/fi';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = pages[locale].about;
  return pageMetadata(locale, routes.about, t.title, t.subtitle);
}

export default async function AboutPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  const t = pages[locale].about;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/${locale}${routes.about}#faq`,
    mainEntity: translations[locale].faq.items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <section className="section-padding bg-white">
        <div className="container">
          <SectionHeading title={t.timelineTitle} />
          {/* TODO: foto antigua de la familia (inicios) y del equipo actual en el almacén. */}
          <ol className="grid md:grid-cols-3 gap-5">
            {t.timeline.map((m) => (
              <li key={m.y} className="rounded-2xl border border-slate-200 p-6 relative overflow-hidden">
                <div className="text-5xl font-extrabold font-headings text-emerald-500 tracking-tight">{m.y}</div>
                <h3 className="font-bold text-slate-900 text-lg mt-3">{m.t}</h3>
                <p className="text-sm text-slate-500 mt-1">{m.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <QualityProcess locale={locale} />
      <Certifications locale={locale} />

      <section className="section-padding bg-emerald-800 text-white">
        <div className="container md:flex md:items-center md:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{t.visitTitle}</h2>
            <p className="text-emerald-100/90">{t.visitBody}</p>
          </div>
          <Link href={quoteHref(locale)} className="mt-6 md:mt-0 inline-flex items-center gap-2 bg-white text-emerald-800 font-headings font-semibold px-5 py-3 rounded-full no-underline hover:bg-emerald-50 flex-shrink-0">
            {t.visitCta} <FiArrowRight />
          </Link>
        </div>
      </section>

      <CompanyFacts locale={locale} />
      <Faq locale={locale} />
    </div>
  );
}
