import React from 'react';
import type { Locale } from '@/locales/translations';
import { pages } from '@/locales/pages';
import { company } from '@/lib/company';
import { SanitarySeal } from '@/components/Section';

/** Cifras verificables. Un dato en null en company.ts no se muestra. */
export const AuthorityBar: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.stats;
  const fmt = (n: number) => n.toLocaleString(locale === 'es' ? 'es-PE' : 'en-US');

  const stats = [
    company.familyInTradeSince ? { v: String(company.familyInTradeSince), pre: t.since, l: t.family } : null,
    company.foundedYear ? { v: String(company.foundedYear), pre: t.since, l: t.founded } : null,
    company.stats.tonsPerYear ? { v: fmt(company.stats.tonsPerYear), l: t.tons } : null,
    company.stats.collectionPoints ? { v: fmt(company.stats.collectionPoints), l: t.points } : null,
  ].filter(Boolean) as { v: string; pre?: string; l: string }[];

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="container py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
          {stats.map((s) => (
            <div key={s.l} className="text-center lg:text-left lg:border-l lg:border-slate-200 lg:pl-6 first:border-0 first:pl-0">
              {/* El antetítulo reserva su línea aunque esté vacío, para alinear las cifras */}
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 h-4">{s.pre}</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-headings">{s.v}</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
        {company.plant.sanitaryPermit && (
          <div className="mt-8 flex justify-center lg:justify-start">
            <SanitarySeal label={t.plant} />
          </div>
        )}
      </div>
    </section>
  );
};
