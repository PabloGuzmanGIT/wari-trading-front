'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { company, sameAs, emailFor } from '@/lib/company';
import { FiPhone, FiMapPin, FiFileText, FiMail } from 'react-icons/fi';

export const Footer: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale].footer;

  const addressParts = [
    company.address.street,
    company.address.locality,
    company.address.region,
    'Perú',
  ].filter(Boolean);
  const addressLine = addressParts.length > 1 ? addressParts.join(', ') : t.pending;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 safe-x mt-auto relative z-10">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3 text-sm">

        <div className="space-y-2">
          <div className="font-headings font-extrabold text-white text-lg tracking-tight">
            {company.name}
          </div>
          <p className="text-xs text-slate-500 max-w-xs">{t.tagline}</p>
          <p className="text-xs text-slate-600 pt-2">© {new Date().getFullYear()} {company.legalName}. {t.rights}</p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{t.contactLabel}</div>
          <div className="flex items-center gap-2"><FiMapPin className="text-emerald-500 flex-shrink-0" size={15} /><span>{addressLine}</span></div>
          {company.phone && <div className="flex items-center gap-2"><FiPhone className="text-cyan-400 flex-shrink-0" size={15} /><span>{company.phone}</span></div>}
          <div className="flex items-center gap-2"><FiMail className="text-cyan-400 flex-shrink-0" size={15} /><a href={`mailto:${emailFor(locale)}`} className="text-slate-400 hover:text-white no-underline">{emailFor(locale)}</a></div>
          {sameAs.length > 0 && (
            <div className="flex gap-3 pt-1">
              {sameAs.map((url) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white no-underline">
                  {new URL(url).hostname.replace('www.', '')}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{t.legalLabel}</div>
          <div className="flex items-center gap-2"><FiFileText className="text-slate-500 flex-shrink-0" size={15} /><span>{company.legalName}</span></div>
          <div className="flex items-center gap-2 pl-6"><span>RUC: {company.ruc || t.pending}</span></div>
          <Link href={`/${locale}/portal`} className="inline-block text-xs text-slate-600 hover:text-slate-300 no-underline pt-3">
            {translations[locale].nav.portal} →
          </Link>
        </div>

      </div>
    </footer>
  );
};
