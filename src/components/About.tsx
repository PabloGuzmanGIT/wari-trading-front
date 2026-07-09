'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiUsers, FiAward, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export const About: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale].about;

  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative SVG shapes */}
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute left-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="container">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            {t.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-lg text-slate-500 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Contenido Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Texto de Nosotros */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              {t.desc1}
            </p>
            
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              {t.desc2}
            </p>

            {/* DEVIDA Badge Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-cyan-50/70 border border-emerald-100 flex gap-4 items-start shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/10">
                <FiAward size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base mb-1">
                  {t.devidaTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  {t.devidaDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas e Imagen / Gráfico */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Stats Cards */}
            <div className="flex flex-col sm:flex-row gap-4">
              
              <div className="flex-1 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="text-emerald-600 mb-3">
                  <FiAward size={28} />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">19</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.stat1}
                </div>
              </div>

              <div className="flex-1 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="text-cyan-600 mb-3">
                  <FiUsers size={28} />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">150+</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.stat2}
                </div>
              </div>

            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-lg gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider leading-none">
                  {t.stat3}
                </div>
                <div className="text-3xl font-extrabold tracking-tight leading-none">15k+ MT</div>
              </div>
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">
                <FiTrendingUp size={22} />
              </div>
            </div>

            {/* Compromiso List */}
            <div className="space-y-3 pt-2">
              {t.commitments.map((commitment, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                  <span>{commitment}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
