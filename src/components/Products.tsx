'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiCalendar, FiMapPin, FiCheck } from 'react-icons/fi';

interface ProductItem {
  id: string;
  name: string;
  desc: string;
  image: string;
  season: string;
  season_en: string;
  region: string;
  region_en: string;
  details: string[];
  details_en: string[];
}

export const Products: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale].products;

  const productList: ProductItem[] = [
    {
      id: 'avocado',
      name: t.avocadoName,
      desc: t.avocadoDesc,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=600&h=400',
      season: 'Abril - Setiembre',
      season_en: 'April - September',
      region: 'Ayacucho, Moquegua, Lima',
      region_en: 'Ayacucho, Moquegua, Lima',
      details: ['Calibres: 12 a 26', 'Materia Seca: 21% - 25%', 'Empaque: Cajas de cartón de 4kg'],
      details_en: ['Sizes: 12 to 26', 'Dry Matter: 21% - 25%', 'Packaging: 4kg cardboard boxes']
    },
    {
      id: 'cacao',
      name: t.cacaoName,
      desc: t.cacaoDesc,
      image: 'https://images.unsplash.com/photo-1542841201-99634da4a51e?auto=format&fit=crop&q=80&w=600&h=400',
      season: 'Todo el año (Pico Mayo - Agosto)',
      season_en: 'All year (Peak May - August)',
      region: 'Satipo (Junín), Oxapampa (Pasco)',
      region_en: 'Satipo (Junin), Oxapampa (Pasco)',
      details: ['Humedad: < 7%', 'Fermentación: > 85%', 'Sacos: Yute de 64kg'],
      details_en: ['Moisture: < 7%', 'Fermentation: > 85%', 'Bags: 64kg jute sacks']
    },
    {
      id: 'mango',
      name: t.mangoName,
      desc: t.mangoDesc,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600&h=400',
      season: 'Diciembre - Marzo',
      season_en: 'December - March',
      region: 'Tambogrande (Piura), Lambayeque',
      region_en: 'Tambogrande (Piura), Lambayeque',
      details: ['Calibres: 6 a 12', 'Grados Brix: 13° - 15°', 'Tratamiento de Agua Caliente'],
      details_en: ['Sizes: 6 to 12', 'Brix Degrees: 13° - 15°', 'Hot Water Treatment']
    },
    {
      id: 'fig',
      name: t.figName,
      desc: t.figDesc,
      image: '/images/figs.png',
      season: 'Noviembre - Mayo',
      season_en: 'November - May',
      region: 'Chilca (Lima), Tacna',
      region_en: 'Chilca (Lima), Tacna',
      details: ['Variedad: Black Mission', 'Selección manual rigurosa', 'Empaque: Clamshells en caja master'],
      details_en: ['Variety: Black Mission', 'Rigorous hand selection', 'Packaging: Clamshells in master box']
    },
    {
      id: 'asparagus',
      name: t.asparagusName,
      desc: t.asparagusDesc,
      image: '/images/asparagus.png',
      season: 'Todo el año',
      season_en: 'All year round',
      region: 'Ica, Trujillo (La Libertad)',
      region_en: 'Ica, Trujillo (La Libertad)',
      details: ['Calibres: S, M, L, XL', 'Enfriamiento rápido (Hydrocooling)', 'Cajas: 5kg atados'],
      details_en: ['Sizes: S, M, L, XL', 'Rapid cooling (Hydrocooling)', 'Boxes: 5kg bundles']
    },
    {
      id: 'beans',
      name: t.beansName,
      desc: t.beansDesc,
      image: '/images/beans.png',
      season: 'Mayo - Noviembre',
      season_en: 'May - November',
      region: 'Cajamarca, Arequipa',
      region_en: 'Cajamarca, Arequipa',
      details: ['Variedad: Frijol Negro, Castila', 'Humedad controlada: < 14%', 'Embolsado personalizado'],
      details_en: ['Variety: Black Bean, Castilla', 'Controlled moisture: < 14%', 'Custom bagging']
    }
  ];

  return (
    <section id="products" className="section-padding bg-slate-50">
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

        {/* Grid de Productos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productList.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Imagen con badge de origen */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 max-w-[85%] bg-white/90 backdrop-blur-sm border border-white/20 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <FiMapPin className="text-cyan-600 flex-shrink-0" />
                  <span className="truncate">{locale === 'es' ? product.region : product.region_en}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-sm mb-5 flex-1 line-clamp-3">
                  {product.desc}
                </p>

                {/* Detalles técnicos */}
                <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                  {(locale === 'es' ? product.details : product.details_en).map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <FiCheck className="text-emerald-500 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Temporada */}
                <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold px-3 py-2 rounded-xl">
                  <FiCalendar className="flex-shrink-0" />
                  <span>{t.season}: {locale === 'es' ? product.season : product.season_en}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
