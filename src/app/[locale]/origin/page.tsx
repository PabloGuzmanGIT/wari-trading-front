import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import type React from 'react';
import { pages, routes, quoteHref } from '@/locales/pages';
import { company } from '@/lib/company';
import { media } from '@/lib/media';
import { pageMetadata, toLocale } from '@/lib/seo';
import { FiArrowRight } from 'react-icons/fi';
import { TbBox, TbCalendarCheck, TbChartLine, TbCoffee, TbCoins, TbHeartHandshake, TbLeaf, TbScale } from 'react-icons/tb';

interface Props {
  params: Promise<{ locale: string }>;
}

// Mismo orden que `origin.how` y `origin.calendar`.
const HOW_ICONS = [TbChartLine, TbCoins, TbScale, TbHeartHandshake];
const HARVEST = [
  { image: media.HARVEST_COFFEE, Icon: TbCoffee, panel: 'bg-[#39611b]' },
  { image: media.HARVEST_COCOA, Icon: TbLeaf, panel: 'bg-[#694e2d]' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = pages[locale].origin;
  return pageMetadata(locale, routes.origin, t.title, t.subtitle);
}

export default async function OriginPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  const t = pages[locale].origin;
  const { from, to } = company.origin.corridor;

  return (
    <div className="flex flex-col bg-[#f8f8f4]">
      <section className="relative isolate overflow-hidden bg-wari-navy text-white">
        <Image
          src={media.ORIGIN_HERO.src}
          alt={media.ORIGIN_HERO.alt[locale]}
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover object-right"
        />
        <div className="absolute inset-0 -z-10 bg-wari-navy/55 lg:hidden" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(6,33,27,.92)_0%,rgba(6,33,27,.78)_55%,rgba(6,33,27,0)_85%)] lg:block xl:bg-[linear-gradient(90deg,rgba(6,33,27,.92)_0%,rgba(6,33,27,.72)_38%,rgba(6,33,27,0)_62%)]" aria-hidden="true" />
        <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-6 sm:pb-28 lg:px-14 lg:pt-8">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] sm:text-sm">
            {t.eyebrow}
            <span className="h-px w-14 bg-wari-lime" aria-hidden="true" />
          </p>
          <h1 className="font-body! mt-2 max-w-[680px] text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.08]">
            {t.titleLead} <span className="text-wari-lime">{t.titleAccent}</span>
          </h1>
          <p className="mt-3 max-w-[620px] text-base leading-snug sm:text-lg">{t.heroSubtitle}</p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-14 w-full max-w-[1440px] px-4 pb-14 sm:-mt-16 sm:px-6 lg:pb-20">
        <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg sm:p-5 xl:grid-cols-[minmax(0,27%)_minmax(0,1fr)] xl:gap-7">
          <div className="flex flex-col p-2 xl:p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-wari-green-hover">{t.territoryEyebrow}</p>
            <h2 className="font-body! mt-1 text-2xl font-bold leading-tight tracking-tight text-wari-navy sm:text-[1.75rem]">
              {t.mapTitle} <span className="block">{from} – {to}</span>
            </h2>
            <p className="mb-5 mt-4 leading-relaxed text-slate-800">{t.territoryText}</p>
            <div className="flex items-center gap-4 rounded-2xl bg-[#edf4e5] px-6 py-4 lg:self-start xl:mt-auto xl:self-stretch">
              <TbBox size={52} strokeWidth={1.4} className="shrink-0 text-wari-green-hover" />
              <span className="h-12 w-px bg-wari-green/40" aria-hidden="true" />
              <span className="text-5xl font-bold tracking-tight text-wari-green-hover">{company.stats.collectionPoints}</span>
              <span className="text-lg font-bold leading-tight text-wari-navy">{t.pointsLabel}</span>
            </div>
          </div>

          <div className="min-w-0">
            {/* En móvil el esquema se recorre en horizontal: reducido no se leerían los puntos. */}
            <div className="overflow-x-auto rounded-3xl">
              <div className="relative aspect-[1050/325] min-w-[720px] overflow-hidden rounded-3xl lg:min-w-0">
                <Image
                  src={media.ORIGIN_MAP.src}
                  alt={media.ORIGIN_MAP.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 70vw, 720px"
                  className="object-cover"
                />
                {/* La leyenda va en HTML para que se traduzca; cubre la que trae la imagen temporal. */}
                <ul className="absolute right-[2%] top-[4.5%] flex h-[35.5%] w-[21%] flex-col justify-evenly rounded-xl bg-white px-[1.2%] text-[clamp(8.5px,0.86vw,12.5px)] leading-none text-wari-navy shadow">
                    <Legend mark={<span className="h-2.5 w-2.5 rounded-full border-[3px] border-red-600" />}>{t.legend.main}</Legend>
                    <Legend mark={<span className="h-2.5 w-2.5 rounded-full border-[3px] border-green-700" />}>{t.legend.point}</Legend>
                    <Legend mark={<span className="h-1 w-5 rounded bg-amber-400" />}>{t.legend.corridor}</Legend>
                    <Legend mark={<span className="h-1 w-5 rounded bg-blue-600" />}>{t.legend.rivers}</Legend>
                </ul>
                <p className="absolute bottom-[2%] right-[1.6%] flex h-[10.5%] w-[23%] items-center justify-center rounded-full border border-white/80 bg-[#10231f] text-[clamp(8.5px,0.86vw,12.5px)] font-medium text-white">
                  {t.mapNote}
                </p>
              </div>
            </div>
            <p className="mt-3 px-1 text-sm leading-relaxed text-slate-700">
              <strong className="text-wari-navy">{t.localitiesLabel}:</strong> {company.origin.districts.join(' · ')}
            </p>
          </div>
        </section>

        <section className="mt-10 lg:mt-12">
          <h2 className="font-body! flex items-center justify-center gap-4 text-center text-3xl font-bold tracking-tight text-[#05211b] sm:gap-6 sm:text-4xl">
            <span className="h-px w-10 bg-wari-lime sm:w-16" aria-hidden="true" />
            {t.howTitle}
            <span className="h-px w-10 bg-wari-lime sm:w-16" aria-hidden="true" />
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.map((h, i) => {
              const Icon = HOW_ICONS[i];
              return (
                <li key={h.t} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <Icon size={56} strokeWidth={1.4} className="shrink-0 text-wari-green-hover" />
                  <div>
                    <h3 className="font-body! text-lg font-bold leading-snug text-[#05211b]">{h.t}</h3>
                    <p className="mt-0.5 text-sm leading-snug text-slate-700">{h.d}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-6 grid items-center gap-5 rounded-2xl bg-white p-4 shadow-sm sm:p-5 xl:grid-cols-[auto_1fr_1fr] xl:gap-8 lg:grid-cols-2">
          <h2 className="font-body! flex items-center gap-3 text-2xl font-bold leading-tight tracking-tight text-[#05211b] lg:col-span-2 xl:col-span-1 xl:max-w-[300px] xl:border-r xl:border-slate-200 xl:pr-8 lg:text-[1.75rem]">
            <TbCalendarCheck size={56} strokeWidth={1.4} className="shrink-0 text-wari-green-hover" />
            <span>{t.calendarTitle}</span>
          </h2>
          {t.calendar.map((c, i) => {
            const { image, Icon, panel } = HARVEST[i];
            return (
              <div key={c.t} className="grid min-w-0 grid-cols-[1.1fr_0.7fr_1.3fr] items-stretch overflow-hidden rounded-2xl border border-slate-200">
                <div className="relative min-h-24">
                  <Image src={image.src} alt={image.alt[locale]} fill sizes="(min-width: 1024px) 14vw, 33vw" className="object-cover" />
                </div>
                <div className={`flex flex-col items-center justify-center gap-1 px-1 font-bold text-white ${panel}`}>
                  <Icon size={26} strokeWidth={1.5} />
                  {c.t}
                </div>
                <div className="flex flex-col justify-center px-3 sm:px-5">
                  <p className="font-bold leading-tight text-[#05211b] sm:text-lg">{c.d}</p>
                  <p className="mt-0.5 text-sm text-slate-700">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-8 flex justify-center">
          <Link
            href={quoteHref(locale, 'grain')}
            className="inline-flex items-center gap-2 rounded-lg bg-wari-green px-7 py-3.5 font-semibold text-white no-underline transition-colors hover:bg-wari-green-hover"
          >
            {t.cta} <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Legend({ mark, children }: { mark: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className="flex w-5 shrink-0 justify-center">{mark}</span>
      <span className="truncate">{children}</span>
    </li>
  );
}
