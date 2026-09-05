import React from 'react';
import Link from 'next/link';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';
import { FiPackage, FiTool, FiTag, FiCheck, FiArrowRight } from 'react-icons/fi';

export const Offer: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].offer;

  const cards = [
    {
      icon: FiPackage,
      title: t.sourcingTitle,
      desc: t.sourcingDesc,
      points: t.sourcingPoints,
      href: `/${locale}#specs`,
      featured: true,
    },
    {
      icon: FiTool,
      title: t.maquilaTitle,
      desc: t.maquilaDesc,
      points: t.maquilaPoints,
      href: `/${locale}#maquila`,
    },
    {
      icon: FiTag,
      title: company.ownBrand ? `${t.brandTitle} · ${company.ownBrand}` : t.brandTitle,
      desc: t.brandDesc,
      points: t.brandPoints,
      href: `/${locale}#contact`,
    },
  ];

  return (
    <section id="offer" className="section-padding bg-slate-50 scroll-mt-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">{t.title}</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mb-4 rounded-full" />
          <p className="text-lg text-slate-500">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className={`bg-white rounded-3xl border p-8 flex flex-col ${c.featured ? 'border-emerald-500' : 'border-slate-200'}`}
              >
                <span className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500 mb-5">{c.desc}</p>
                <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <FiCheck className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link href={c.href} className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 no-underline">
                  {t.cta}
                  <FiArrowRight />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
