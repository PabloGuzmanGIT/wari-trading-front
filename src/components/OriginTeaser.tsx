import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/locales/translations';
import { pages, routes } from '@/locales/pages';
import { media } from '@/lib/media';
import { HomeHeading } from '@/components/Section';
import { FiArrowRight } from 'react-icons/fi';
import { TbLeaf, TbMapPins, TbMountain } from 'react-icons/tb';

const ICONS = [TbMountain, TbMapPins, TbLeaf];

export const OriginTeaser: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.origin;
  const image = media.HOME_ORIGIN;

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto grid max-w-[1624px] items-center gap-10 safe-x lg:grid-cols-2 lg:gap-14">
        <div>
          <HomeHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {t.highlights.map((label, i) => {
              const Icon = ICONS[i];
              return (
                <li key={label} className="flex items-center gap-3">
                  <Icon strokeWidth={1.5} className="h-10 w-10 shrink-0 text-wari-green" />
                  <span className="text-sm font-semibold leading-snug text-wari-navy lg:text-base">{label}</span>
                </li>
              );
            })}
          </ul>
          <Link
            href={`/${locale}${routes.origin}`}
            className="mt-8 inline-flex items-center gap-2 font-semibold text-wari-navy no-underline hover:text-wari-green-hover"
          >
            {t.cta} <FiArrowRight />
          </Link>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl lg:aspect-[2.1/1]">
          <Image
            src={image.src}
            alt={image.alt[locale]}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};
