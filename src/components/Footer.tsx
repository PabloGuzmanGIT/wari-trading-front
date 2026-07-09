'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiPhone, FiMapPin, FiFileText } from 'react-icons/fi';

export const Footer: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale].footer;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        
        {/* Marca */}
        <div className="space-y-2">
          <div className="font-headings font-extrabold text-white text-lg tracking-tight">
            HALLPA <span className="text-cyan-500">YAKU</span> S.A.C.
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            © {new Date().getFullYear()} {t.rights}
          </p>
        </div>

        {/* Datos Corporativos */}
        <div className="flex flex-col sm:flex-row gap-6 md:gap-12 justify-center text-xs">
          
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <FiMapPin className="text-emerald-500" size={16} />
            <span>{t.address}</span>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <FiPhone className="text-cyan-500" size={16} />
            <span>{t.phone}</span>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <FiFileText className="text-slate-500" size={16} />
            <span>{t.ruc}</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
