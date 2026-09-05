import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { translations, type Locale } from '@/locales/translations';
import { FiArrowRight } from 'react-icons/fi';

export const Hero: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].hero;

  return (
    <section className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto safe-x w-full py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 flex flex-col text-center lg:text-left">
            <span className="inline-flex self-center lg:self-start items-center gap-2 border border-white/15 text-emerald-300 font-medium px-3 py-1.5 rounded-full text-xs tracking-wider uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.badge}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 font-headings text-balance">
              {t.title}
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
              <Link href={`/${locale}#sourcing`} className="btn-primary no-underline justify-center">
                {t.ctaSourcing}
                <FiArrowRight />
              </Link>
              <Link href={`/${locale}#maquila`} className="btn-outline-white no-underline justify-center">
                {t.ctaMaquila}
              </Link>
              <Link href={`/${locale}#offer`} className="btn-outline-white no-underline justify-center">
                {t.ctaBrand}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full max-w-md">
              <div className="rounded-xl overflow-hidden border border-white/10">
                <div className="relative w-full h-[360px]">
                  <Image
                    src="/images/apurimac_jungle.jpg"
                    alt={locale === 'es' ? 'Valle del Río Apurímac, VRAEM' : 'Apurímac River Valley, VRAEM'}
                    fill
                    preload
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="bg-[#0b1220] border-t border-white/10 px-5 py-4">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">{t.cardTag}</div>
                  <div className="text-base font-bold text-white tracking-tight mt-0.5">{t.cardRegion}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
