import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { translations } from '@/locales/translations';
import { pages, routes, quoteHref } from '@/locales/pages';
import { pageMetadata, toLocale } from '@/lib/seo';
import { SITE_URL, company } from '@/lib/company';
import { media } from '@/lib/media';
import { QualityProcess } from '@/components/QualityProcess';
import { Certifications } from '@/components/Certifications';
import { CompanyFacts } from '@/components/CompanyFacts';
import { Faq } from '@/components/Faq';
import { FiArrowRight } from 'react-icons/fi';
import {
  TbBuildingFactory2, TbBuildingStore, TbChartBar, TbHeartHandshake, TbLeaf, TbMapPins, TbMountain,
  TbRosetteDiscountCheck, TbSeedling, TbStack2, TbWorld,
} from 'react-icons/tb';

interface Props {
  params: Promise<{ locale: string }>;
}

// Mismo orden que `about.highlights`, `about.introFacts` y `about.timeline`.
const HIGHLIGHT_ICONS = [TbMapPins, TbLeaf, TbMountain, TbWorld, TbRosetteDiscountCheck];
const INTRO_ICONS = [TbHeartHandshake, TbStack2, TbBuildingFactory2];
const TIMELINE_ICONS = [TbSeedling, TbBuildingFactory2, TbWorld];

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
    <div className="flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="relative isolate overflow-hidden bg-wari-navy text-white">
        <Image
          src={media.ABOUT_HERO.src}
          alt={media.ABOUT_HERO.alt[locale]}
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover object-right"
        />
        <div className="absolute inset-0 -z-10 bg-wari-navy/70 lg:hidden" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(6,33,27,.92)_0%,rgba(6,33,27,.74)_42%,rgba(6,33,27,0)_68%)] lg:block" aria-hidden="true" />
        <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 sm:pb-28 lg:px-14 lg:pt-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] sm:text-sm">{t.heroEyebrow}</p>
          <h1 className="font-body! mt-3 max-w-[620px] text-[2.1rem] font-bold leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.06]">
            {t.titleLead} <span className="text-wari-lime">{t.titleAccent}</span>
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-snug sm:text-lg">{t.subtitle}</p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-14 w-full max-w-[1440px] px-4 sm:-mt-16 sm:px-6">
        <ul className="grid grid-cols-2 gap-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg lg:grid-cols-5 lg:py-6">
          {t.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[i];
            return (
              <li key={h.t} className={`flex items-center gap-3 px-1 lg:px-4 xl:px-5 ${i > 0 ? 'lg:border-l lg:border-slate-200' : ''} ${i === 4 ? 'col-span-2 lg:col-span-1' : ''}`}>
                <Icon size={42} strokeWidth={1.4} className="shrink-0 text-wari-green-hover" />
                <span>
                  <span className="block font-bold leading-snug text-wari-navy">{h.t}</span>
                  <span className="block text-sm leading-snug text-slate-700">{h.d}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <section className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-[minmax(0,47%)_minmax(0,1fr)] lg:gap-10">
          <figure className="relative aspect-[518/282] overflow-hidden rounded-2xl">
            <Image
              src={media.ABOUT_INTRO.src}
              alt={media.ABOUT_INTRO.alt[locale]}
              fill
              sizes="(min-width: 1024px) 47vw, 100vw"
              className="object-cover"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">{t.imageNote}</figcaption>
          </figure>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-wari-green-hover">{t.eyebrow}</p>
            <h2 className="font-body! mt-1 text-3xl font-bold tracking-tight text-wari-navy sm:text-[2.5rem]">{company.name}</h2>
            <p className="mt-4 leading-relaxed text-slate-800 sm:text-lg">{t.intro}</p>
            <ul className="mt-6 grid gap-4 rounded-2xl bg-[#f3f7ee] p-4 sm:grid-cols-3 sm:gap-0">
              {t.introFacts.map((f, i) => {
                const Icon = INTRO_ICONS[i];
                return (
                  <li key={f.t} className={`flex items-center gap-3 sm:px-3 ${i > 0 ? 'sm:border-l sm:border-slate-300' : ''}`}>
                    <Icon size={36} strokeWidth={1.4} className="shrink-0 text-wari-green-hover" />
                    <span>
                      <span className="block text-sm font-bold leading-snug text-wari-navy">{f.t}</span>
                      <span className="block text-sm leading-snug text-slate-700">{f.d}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <div className="mt-12 grid gap-8 pb-12 lg:mt-14 lg:grid-cols-[minmax(0,32%)_minmax(0,1fr)] lg:pb-16">
          <section className="flex flex-col rounded-2xl bg-[#f3f7ee] p-6 sm:p-7">
            <h2 className="font-body! flex items-center gap-3 text-2xl font-bold tracking-tight text-wari-deep sm:text-[1.75rem]">
              <TbBuildingStore size={44} strokeWidth={1.4} className="shrink-0" />
              {t.visitTitle}
            </h2>
            <p className="mb-5 mt-4 leading-relaxed text-slate-800">{t.visitBody}</p>
            <Link href={quoteHref(locale)} className="inline-flex items-center gap-2 self-start font-semibold text-wari-deep no-underline hover:underline lg:mt-auto">
              {t.visitCta} <FiArrowRight />
            </Link>
          </section>

          <section>
            <h2 className="font-body! flex items-center gap-3 text-2xl font-bold tracking-tight text-wari-navy sm:text-[1.75rem]">
              <TbChartBar size={40} strokeWidth={1.4} className="shrink-0 text-wari-green-hover" />
              {t.timelineTitle}
            </h2>
            <ol className="mt-5 grid gap-6 sm:grid-cols-3 sm:gap-0">
              {t.timeline.map((m, i) => {
                const Icon = TIMELINE_ICONS[i];
                return (
                  <li key={m.y} className={i > 0 ? 'sm:border-l sm:border-slate-200 sm:pl-5' : 'sm:pr-5'}>
                    <div className="flex items-center gap-2 sm:pr-5">
                      <Icon size={36} strokeWidth={1.4} className="text-wari-green-hover" />
                      <span className="text-2xl font-bold tracking-tight text-wari-green-hover">{m.y}</span>
                    </div>
                    <h3 className="font-body! mt-2 font-bold text-wari-navy">{m.t}</h3>
                    <p className="mt-1 pr-4 text-sm leading-relaxed text-slate-700">{m.d}</p>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>

      <QualityProcess locale={locale} />

      <div className="mx-auto grid w-full max-w-[1440px] items-start gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        <Certifications locale={locale} />
        <CompanyFacts locale={locale} />
      </div>

      <Faq locale={locale} />
    </div>
  );
}
