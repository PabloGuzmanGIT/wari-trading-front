import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/locales/translations';
import { pages, routes, quoteHref } from '@/locales/pages';
import { SectionHeading } from '@/components/Section';
import { FiArrowRight, FiShield } from 'react-icons/fi';

export const EudrTeaser: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.eudr;

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="rounded-3xl bg-[#0f172a] text-white p-8 sm:p-12 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} dark />
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={quoteHref(locale, 'eudr')} className="btn-primary no-underline justify-center">
                {t.cta} <FiArrowRight />
              </Link>
              <Link href={`/${locale}${routes.traceability}`} className="btn-outline-white no-underline justify-center">
                {t.more}
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:col-span-4 justify-center">
            <div className="w-40 h-40 rounded-full border border-white/15 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center">
                <FiShield size={44} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
