'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Products } from '@/components/Products';
import { LogisticsSimulator } from '@/components/LogisticsSimulator';
import { ContactForm } from '@/components/ContactForm';
import { FiArrowRight, FiShield, FiCpu, FiCompass, FiSearch, FiGlobe } from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';

interface Demand {
  id: number;
  country: string;
  product: string;
  product_en: string;
  quantity_tons: number;
  target_price: string;
  destination_port: string;
  destination_port_en: string;
  date_posted: string;
}

export default function LocaleHomePage() {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale];

  const [recentDemands, setRecentDemands] = useState<Demand[]>([]);
  const [traceCode, setTraceCode] = useState('');

  // GEO Optimization - Detección local o internacional simulada en cliente
  const [geoCountry, setGeoCountry] = useState<'Peru' | 'International' | null>(null);

  useEffect(() => {
    // Simular detección geográfica basada en timezone o language del navegador
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.toLowerCase().includes('lima') || tz.toLowerCase().includes('bogota') || navigator.language.startsWith('es')) {
      setGeoCountry('Peru');
    } else {
      setGeoCountry('International');
    }

    // Obtener demandas recientes
    const fetchDemands = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/demands`);
        if (res.ok) {
          const data = await res.json();
          // Tomar solo las últimas 2
          setRecentDemands(data.slice(0, 2));
        }
      } catch (err) {
        console.error('Error fetching demands:', err);
      }
    };
    fetchDemands();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* GEO Targeted Alert - Micro-personalización */}
      {geoCountry && (
        <div className="bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 border-y border-emerald-500/10 py-3 px-4 sm:px-6 lg:px-8 text-center text-xs font-semibold text-slate-700 flex items-center justify-center gap-2">
          <FiGlobe className="text-cyan-600 flex-shrink-0" />
          {geoCountry === 'Peru' ? (
            <span className="max-w-2xl">
              🇵🇪 Mostrando información para: <strong>Perú</strong> (Precios locales habilitados y enlaces directos con DEVIDA).
            </span>
          ) : (
            <span className="max-w-2xl">
              🌐 Sourcing destination: <strong>International Markets</strong> (Direct sea transport rates, logistics stubs, and currency in USD).
            </span>
          )}
        </div>
      )}

      {/* 2. Nosotros (About) */}
      <About />

      {/* 3. Catálogo de Productos */}
      <Products />

      {/* 4. Módulos Interactivos (B2B Demand Board & Traceability search) */}
      <section className="section-padding bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]"></div>

        <div className="container">
          
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Lado Izquierdo: Tablero B2B Preview */}
            <div className="glass-card-dark p-8 rounded-3xl border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <FiShield size={20} />
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {t.demands.title}
                  </h3>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm mb-6">
                  {t.demands.subtitle}
                </p>

                {/* Lista de Demandas Recientes */}
                <div className="space-y-4 mb-6">
                  {recentDemands.length > 0 ? (
                    recentDemands.map((d) => (
                      <div
                        key={d.id}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center gap-4 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-200">
                            {t.demands.anonymous} {d.country}
                          </div>
                          <div className="text-slate-400 mt-1">
                            {locale === 'es' ? d.product : d.product_en} • {d.quantity_tons} TM
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {t.demands.verified}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1">{d.date_posted}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-20 flex items-center justify-center text-slate-500 text-xs italic">
                      {locale === 'es' ? 'Cargando requerimientos...' : 'Loading requirements...'}
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/${locale}/demand-board`}
                className="btn-outline-white !text-xs !py-2.5 !px-5 self-start no-underline"
              >
                {locale === 'es' ? 'Ver Todo el Tablero' : 'View Full Board'}
                <FiArrowRight />
              </Link>
            </div>

            {/* Lado Derecho: Buscador Trazabilidad Lote */}
            <div className="glass-card-dark p-8 rounded-3xl border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                    <FiCpu size={20} />
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {t.traceability.title}
                  </h3>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm mb-6">
                  {t.traceability.subtitle}
                </p>

                {/* Buscador Input */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t.traceability.placeholder}
                      value={traceCode}
                      onChange={(e) => setTraceCode(e.target.value)}
                      className="form-input !bg-white/10 !border-white/10 !text-white placeholder-slate-500 focus:!border-cyan-500 pr-10 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <FiSearch size={16} />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    {locale === 'es' ? (
                      <>Códigos muestra para prueba: <strong className="text-cyan-400">HY-2026-PL01</strong> (Palta) y <strong className="text-cyan-400">HY-2026-CC03</strong> (Cacao).</>
                    ) : (
                      <>Sample codes for testing: <strong className="text-cyan-400">HY-2026-PL01</strong> (Avocado) and <strong className="text-cyan-400">HY-2026-CC03</strong> (Cacao).</>
                    )}
                  </p>
                </div>
              </div>

              <Link
                href={`/${locale}/traceability?code=${traceCode}`}
                className="btn-primary !bg-gradient-to-r !from-cyan-500 !to-cyan-600 hover:!shadow-cyan-500/20 !text-xs !py-2.5 !px-5 self-start no-underline"
              >
                {t.traceability.btnSearch}
                <FiArrowRight />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Simulador de Logística */}
      <section className="section-padding bg-slate-50">
        <div className="container text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {locale === 'es' ? 'Simulación Logística de Carga' : 'Cargo Logistics Simulation'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {locale === 'es'
              ? 'Calcule de forma directa las condiciones de transporte marítimo para su destino.'
              : 'Directly calculate the sea transport conditions for your destination.'}
          </p>
        </div>
        <LogisticsSimulator />
      </section>

      {/* 6. Formulario de Contacto y Cotización */}
      <section className="section-padding bg-white relative">
        <ContactForm />
      </section>

    </div>
  );
}
