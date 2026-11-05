import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/locales/translations';
import { pages, routes, quoteHref, type HeroHighlightKey } from '@/locales/pages';
import { media } from '@/lib/media';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { TbBox, TbBuildingFactory2, TbLeaf, TbMountain } from 'react-icons/tb';

const HIGHLIGHTS: Record<HeroHighlightKey, {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  iconCls: string;
}> = {
  origin: { Icon: TbMountain, href: routes.origin, iconCls: 'text-wari-lime' },
  processing: { Icon: TbBuildingFactory2, href: routes.maquila, iconCls: 'text-white' },
  quality: { Icon: TbLeaf, href: routes.traceability, iconCls: 'text-wari-lime' },
  b2b: { Icon: TbBox, href: routes.privateLabel, iconCls: 'text-white' },
};

export const Hero: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.hero;
  const image = media.HOME_HERO;

  return (
    <section className="relative isolate overflow-hidden bg-[#10231f] text-white">
      <Image
        src={image.src}
        alt={image.alt[locale]}
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-[74%_center] lg:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[#10231f]/60 lg:bg-transparent lg:bg-[linear-gradient(90deg,rgba(16,35,31,.88)_0%,rgba(16,35,31,.6)_32%,rgba(16,35,31,0)_60%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#10231f]/90 to-transparent" aria-hidden="true" />

      <div className="mx-auto flex max-w-[1624px] flex-col justify-between safe-x lg:min-h-[min(46vw,804px)]">
        <div className="max-w-[780px] pt-14 pb-10 sm:pt-20 lg:pt-[6.2vw] lg:pb-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-white/90 sm:text-sm sm:tracking-[0.34em]">
            {t.eyebrow}
          </p>
          <h1 className="font-body! text-[2.5rem] font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[clamp(3.25rem,4.34vw,4.75rem)] lg:leading-[0.97]">
            {t.titleLead}{' '}
            <span className="block text-wari-lime">{t.titleAccent}</span>
          </h1>
          <p className="mt-5 max-w-[680px] text-base leading-relaxed text-white/90 sm:text-lg lg:mt-7 lg:text-[clamp(1.2rem,1.46vw,1.6rem)] lg:leading-[1.3]">
            {t.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5 lg:mt-10 2xl:gap-6">
            <Link
              href={quoteHref(locale)}
              className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-wari-green px-7 py-4 font-semibold 2xl:px-9 2xl:py-5 2xl:text-lg text-white no-underline transition-colors hover:bg-wari-green-hover"
            >
              <FiMail size={20} />
              {t.primaryCta}
              <FiArrowRight size={18} />
            </Link>
            <Link
              href={`/${locale}#products`}
              className="inline-flex items-center justify-center rounded-lg border border-white/80 px-7 py-4 font-semibold 2xl:px-9 2xl:py-5 2xl:text-lg text-white no-underline transition-colors hover:bg-white/10"
            >
              {t.secondaryCta}
            </Link>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-y-6 pb-8 sm:pb-10 lg:grid-cols-4 lg:gap-y-0 lg:pb-12">
          {t.highlights.map(({ key, t: title, d }, i) => {
            const { Icon, href, iconCls } = HIGHLIGHTS[key];
            return (
              <li
                key={key}
                className={`flex lg:justify-center lg:first:justify-start ${i > 0 ? 'lg:border-l lg:border-white/25' : ''}`}
              >
                <Link
                  href={`/${locale}${href}`}
                  className="group flex items-center gap-3 pr-3 no-underline sm:gap-4 lg:gap-5 lg:py-3"
                >
                  <Icon strokeWidth={1.5} className={`h-9 w-9 shrink-0 sm:h-11 sm:w-11 lg:h-14 lg:w-14 2xl:h-[4.5rem] 2xl:w-[4.5rem] ${iconCls}`} />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold leading-snug text-white group-hover:underline sm:text-base lg:text-lg 2xl:text-[1.3rem]">{title}</span>
                    {d && <span className="text-xs leading-snug text-white/80 sm:text-sm lg:text-base 2xl:text-[1.2rem]">{d}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
