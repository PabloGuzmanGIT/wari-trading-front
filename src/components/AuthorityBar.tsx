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
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1624px] py-10 safe-x lg:py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="lg:border-l lg:border-slate-200 lg:pl-8 lg:first:border-0 lg:first:pl-0">
              {/* El antetítulo reserva su línea aunque esté vacío, para alinear las cifras */}
              <div className="h-4 text-[11px] font-bold uppercase tracking-[0.14em] text-wari-green">{s.pre}</div>
              <div className="mt-1 text-3xl font-bold tracking-tight text-wari-navy sm:text-4xl lg:text-5xl">{s.v}</div>
              <div className="mt-1 text-sm font-medium text-slate-600 lg:text-base">{s.l}</div>
            </div>
          ))}
        </div>
        {company.plant.sanitaryPermit && (
          <div className="mt-8 flex">
            <SanitarySeal label={t.plant} />
          </div>
        )}
      </div>
    </section>
  );
};
