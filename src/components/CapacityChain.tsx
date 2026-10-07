import React from 'react';
import type { Locale } from '@/locales/translations';
import { pages } from '@/locales/pages';
import { SectionHeading } from '@/components/Section';
import { FiMapPin, FiCheckSquare, FiSettings, FiLayers, FiTruck } from 'react-icons/fi';

const ICONS = [FiMapPin, FiCheckSquare, FiSettings, FiLayers, FiTruck];

/** Diagrama de la cadena: acopio → calidad → planta → aliadas → despacho. */
export const CapacityChain: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.chain;

  return (
    <section className="section-padding bg-[#fbfbfa]">
      <div className="container">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <ol className="grid gap-4 lg:grid-cols-5 lg:gap-0 relative">
          {t.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <li key={step.t} className="relative flex lg:flex-col gap-4 lg:gap-0 lg:pr-5">
                {/* Conector: vertical en móvil, horizontal en desktop */}
                {i < t.steps.length - 1 && (
                  <span className="absolute left-6 top-14 bottom-[-1rem] w-px bg-emerald-200 lg:left-14 lg:right-0 lg:top-6 lg:bottom-auto lg:h-px lg:w-auto" aria-hidden="true" />
                )}
                <span className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-8 ring-[#fbfbfa]">
                  <Icon size={20} />
                </span>
                <div className="lg:mt-5 pb-2">
                  <div className="text-[11px] font-bold text-emerald-600 tracking-wider">0{i + 1}</div>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">{step.t}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
