'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBriefcase } from 'react-icons/fi';

export const Hero: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale].hero;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[85vh] flex flex-col justify-center">
      {/* Background overlay with animated glowing circles representing Soil (green) and Water (blue) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Crystalline mesh pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 md:py-24 text-center lg:text-left">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Contenido Izquierda */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex self-center lg:self-start items-center gap-1.5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-400 font-semibold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Wari Trading S.A.C.
            </motion.div>

            {/* Título Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 font-headings text-balance"
            >
              La fuerza de nuestra <span className="gradient-text-earth font-black">tierra</span>,<br className="hidden sm:inline" />{' '}
              la pureza de nuestra <span className="gradient-text-water font-black">agua</span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-slate-400 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {t.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href={`/${locale}#contact`} className="btn-primary no-underline text-center justify-center">
                {t.ctaQuote}
                <FiArrowRight />
              </Link>
              
              <Link href={`/${locale}/portal`} className="btn-outline-white no-underline text-center justify-center">
                <FiBriefcase />
                {t.ctaPortal}
              </Link>
            </motion.div>

          </div>

          {/* Gráfico Derecha (Visual Premium - Fotografía Río Apurímac) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full max-w-md relative"
            >
              {/* Decorative outer glow ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2.25rem] blur-xl opacity-75 animate-pulse"></div>

              {/* Main image container */}
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group">
                <img
                  src="/images/apurimac_jungle.png"
                  alt="Río Apurímac, Selva Peruana"
                  className="w-full h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                {/* Floating Glassmorphism Tag at top-left */}
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {locale === 'es' ? 'Origen Natural' : 'Natural Origin'}
                  </span>
                </div>

                {/* Content Overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                      {t.cardTag}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {locale === 'es' ? 'Valle del Río Apurímac (VRAEM)' : 'Apurimac River Valley (VRAEM)'}
                    </h3>
                  </div>

                  <div className="h-px bg-white/10"></div>
                  
                  <div className="flex justify-between items-center text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                      {t.cardSustainable}
                    </span>
                    <span className="font-semibold text-emerald-400">{t.cardOrganic}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                      {t.cardAllies}
                    </span>
                    <span className="font-semibold text-cyan-400">{t.cardDevida}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
