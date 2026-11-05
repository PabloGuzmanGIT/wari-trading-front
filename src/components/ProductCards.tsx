import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/locales/translations';
import { pages, routes, quoteHref } from '@/locales/pages';
import { media } from '@/lib/media';
import { HomeHeading } from '@/components/Section';
import { FiArrowRight } from 'react-icons/fi';
import { TbCoffee, TbFlame, TbGrain, TbLeaf } from 'react-icons/tb';

// Mismo orden que `home.products.items`.
const CARDS = [
  { Icon: TbCoffee, image: media.COFFEE_MAIN },
  { Icon: TbLeaf, image: media.COCOA_MAIN },
  { Icon: TbGrain, image: media.COCOA_NIBS },
  { Icon: TbFlame, image: media.ROASTED_COFFEE },
];

export const ProductCards: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.products;

  return (
    <section id="products" className="scroll-mt-28 bg-wari-cream py-14 lg:py-20">
      <div className="mx-auto max-w-[1624px] safe-x">
        <HomeHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} center />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {t.items.map((item, i) => {
            const { Icon, image } = CARDS[i];
            const specHref = `/${locale}${routes[item.slug as keyof typeof routes]}`;
            return (
              <article key={item.t} className="group flex flex-col overflow-hidden rounded-2xl bg-wari-forest text-white">
                <Link href={specHref} tabIndex={-1} aria-hidden="true" className="relative block aspect-[2.2/1] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-1 gap-3">
                    <Icon strokeWidth={1.5} className="h-7 w-7 shrink-0 text-wari-lime" />
                    <div>
                      <h3 className="font-body! text-lg font-bold leading-snug text-white">{item.t}</h3>
                      <p className="mt-0.5 text-sm text-white/80">{item.d}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
                    <Link href={specHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white no-underline hover:text-wari-lime">
                      {t.spec} <FiArrowRight size={15} />
                    </Link>
                    <Link
                      href={quoteHref(locale, item.slug === 'derivatives' ? 'processing' : 'grain')}
                      className="text-xs font-semibold text-white/80 no-underline hover:text-white"
                    >
                      {t.sample}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
