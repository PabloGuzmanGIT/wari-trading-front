'use client';

import React, { useState } from 'react';
import { translations, type Locale } from '@/locales/translations';
import { FiChevronDown } from 'react-icons/fi';

export const Faq: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-slate-50 scroll-mt-24">
      <div className="container max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 text-center">{t.title}</h2>

        <div className="space-y-3">
          {t.items.map((item, i) => (
            <div key={item.q} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-slate-900 text-sm sm:text-base">{item.q}</span>
                <FiChevronDown className={`flex-shrink-0 text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
