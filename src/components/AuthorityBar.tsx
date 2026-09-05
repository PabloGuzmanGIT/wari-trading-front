import React from 'react';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';
import { FiCheckCircle } from 'react-icons/fi';

export const AuthorityBar: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].authority;
  const mt = locale === 'es' ? ' TM' : ' MT';

  const numeric = [
    { value: company.stats.yearsOperating, label: t.years },
    { value: company.stats.tonsPerYear, label: t.tons, suffix: mt },
    { value: company.stats.collectionPoints, label: t.points },
    { value: company.stats.producers, label: t.producers },
  ].filter((s) => s.value != null) as { value: number; label: string; suffix?: string }[];

  const qualitative = [
    ...(company.familyInTradeSince ? [t.family] : []),
    company.origin.admin,
    t.plant,
    t.bilingual,
  ];

  return (
    <section className="bg-white border-y border-slate-100">
      <div className="container py-8">
        {numeric.length >= 3 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {numeric.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {s.value.toLocaleString(locale === 'es' ? 'es-PE' : 'en-US')}{s.suffix ?? ''}
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm">
            {numeric.map((s) => (
              <span key={s.label} className="flex items-baseline gap-1.5 font-medium text-slate-700">
                <span className="text-lg font-extrabold text-slate-900">
                  {s.value.toLocaleString(locale === 'es' ? 'es-PE' : 'en-US')}{s.suffix ?? ''}
                </span>
                <span className="text-slate-500">{s.label}</span>
              </span>
            ))}
            {numeric.length > 0 && <span className="hidden sm:block w-px h-5 bg-slate-200" />}
            {qualitative.map((q) => (
              <span key={q} className="flex items-center gap-2 text-slate-600 font-medium">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                {q}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
