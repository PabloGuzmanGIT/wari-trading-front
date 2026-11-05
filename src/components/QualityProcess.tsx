import React from 'react';
import Image from 'next/image';
import { translations, type Locale } from '@/locales/translations';
import { media } from '@/lib/media';
import { TbClock, TbDroplet, TbMapPin, TbRoute, TbTestPipe } from 'react-icons/tb';

// Mismo orden que `quality.points`.
const ICONS = [TbDroplet, TbTestPipe, TbRoute, TbMapPin, TbClock];

export const QualityProcess: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].quality;

  return (
    <section id="quality" className="relative isolate scroll-mt-24 overflow-hidden bg-[#10231f] py-12 text-white lg:py-16">
      <Image src={media.HOME_ORIGIN.src} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[#10231f]/75" aria-hidden="true" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-14">
        <h2 className="font-body! text-3xl font-bold tracking-tight">{t.title}</h2>
        <span className="mt-2 block h-1 w-16 bg-wari-lime" aria-hidden="true" />
        <p className="mt-3 text-white/90 sm:text-lg">{t.subtitle}</p>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {t.points.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <li key={p.t} className={`text-center lg:px-5 ${i > 0 ? 'lg:border-l lg:border-white/25' : ''}`}>
                <Icon size={44} strokeWidth={1.4} className="mx-auto text-wari-lime" />
                <h3 className="font-body! mt-2 font-bold">{p.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/90">{p.d}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
