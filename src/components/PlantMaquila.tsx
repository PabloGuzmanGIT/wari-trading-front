import React from 'react';
import Link from 'next/link';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';
import { FiArrowRight } from 'react-icons/fi';

export const PlantMaquila: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].maquila;

  const capacities = [
    { label: locale === 'es' ? 'Tostado' : 'Roasting', value: company.plant.roastingKgDay },
    { label: locale === 'es' ? 'Pilado' : 'Hulling', value: company.plant.hullingKgDay },
    { label: locale === 'es' ? 'Molienda' : 'Milling', value: company.plant.millingKgDay },
  ].filter((c) => c.value != null) as { label: string; value: number }[];

  return (
    <section id="maquila" className="section-padding bg-emerald-50 scroll-mt-24">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">{t.title}</h2>
          <div className="w-16 h-1 bg-emerald-500 mb-4 rounded-full" />
          <p className="text-lg text-slate-500">{t.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {t.services.map((s) => (
            <div key={s.t} className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-1">{s.t}</h3>
              <p className="text-sm text-slate-500">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">{t.capacityLabel}</div>
          {capacities.length > 0 ? (
            <div className="flex flex-wrap gap-8">
              {capacities.map((c) => (
                <div key={c.label}>
                  <div className="text-2xl font-extrabold text-slate-900">{c.value.toLocaleString()} <span className="text-sm font-medium text-slate-400">kg/día</span></div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">{c.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t.capacityPending}</p>
          )}
        </div>

        <Link href={`/${locale}#contact`} className="btn-primary no-underline mt-8">
          {t.cta}
          <FiArrowRight />
        </Link>
      </div>
    </section>
  );
};
