import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/locales/translations';
import { pages, needRoute, type NeedKey } from '@/locales/pages';
import { FiArrowRight, FiPackage, FiTool, FiTag, FiShield } from 'react-icons/fi';

const ICONS: Record<NeedKey, React.ComponentType<{ size?: number; className?: string }>> = {
  grain: FiPackage,
  processing: FiTool,
  brand: FiTag,
  eudr: FiShield,
};

export const Hero: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.hero;

  return (
    <section className="relative bg-[#0f172a] text-white overflow-hidden">
      {/* TODO: reemplazar por foto/video propio (planta o almacén) cuando esté seleccionado. */}
      <Image
        src="/images/apurimac_jungle.jpg"
        alt={t.imageAlt}
        fill
        preload
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#0f172a]/75" aria-hidden="true" />

      <div className="relative container pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 border border-white/20 text-emerald-200 font-medium px-3 py-1.5 rounded-full text-xs tracking-wider uppercase mb-6 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            {t.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.06] mb-6 text-balance">
            {t.title}
          </h1>
          <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">{t.doorsTitle}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {t.doors.map((d) => {
              const Icon = ICONS[d.key];
              return (
                <Link
                  key={d.key}
                  href={`/${locale}${needRoute[d.key]}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-emerald-300/60 p-5 no-underline transition-colors backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                      <Icon size={20} />
                    </span>
                    <FiArrowRight className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <div className="font-headings font-bold text-white text-lg leading-snug">{d.t}</div>
                    <div className="text-sm text-slate-300 mt-1">{d.d}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
