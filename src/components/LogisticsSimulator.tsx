'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiAnchor, FiCompass, FiThermometer, FiDroplet, FiWind, FiClock } from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';

interface PortData {
  port: string;
  port_en: string;
  transit_days: number;
  temperature_c: number;
  humidity_pct: number;
  ventilation_cbm: number;
}

export const LogisticsSimulator: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale].logistics;

  const [ports, setPorts] = useState<PortData[]>([]);
  const [selectedPort, setSelectedPort] = useState<PortData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('avocado');

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/logistics/ports`);
        if (res.ok) {
          const data = await res.json();
          setPorts(data);
          if (data.length > 0) {
            setSelectedPort(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching ports:', err);
      }
    };
    fetchPorts();
  }, []);

  const handlePortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const port = ports.find((p) => p.port === e.target.value || p.port_en === e.target.value);
    if (port) setSelectedPort(port);
  };

  // Ajustes de temperatura según el producto seleccionado
  const getProductTuning = () => {
    switch (selectedProduct) {
      case 'avocado':
        return { tempOffset: 0, humOffset: 0, vent: 15 };
      case 'mango':
        return { tempOffset: 4.5, humOffset: 5, vent: 20 };
      case 'cacao':
        // Cacao seco no requiere reefer frío, sino contenedor seco ventilado (Coffee/Cacao standard)
        return { tempOffset: 12.0, humOffset: -20, vent: 5 };
      case 'fig':
        return { tempOffset: -4.5, humOffset: 5, vent: 10 };
      case 'asparagus':
        return { tempOffset: -3.5, humOffset: 10, vent: 25 };
      default:
        return { tempOffset: 0, humOffset: 0, vent: 15 };
    }
  };

  const tuning = getProductTuning();
  const calculatedTemp = selectedPort ? (selectedPort.temperature_c + tuning.tempOffset).toFixed(1) : '5.5';
  const calculatedHum = selectedPort ? Math.max(50, Math.min(95, selectedPort.humidity_pct + tuning.humOffset)) : 85;
  const calculatedVent = selectedPort ? tuning.vent : 15;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
          <FiCompass size={24} className="animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">{t.title}</h3>
          <p className="text-xs text-slate-500">{t.subtitle}</p>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* Selector de Puerto */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.portLabel}
          </label>
          <div className="relative">
            <select
              onChange={handlePortChange}
              value={selectedPort ? (locale === 'es' ? selectedPort.port : selectedPort.port_en) : ''}
              className="form-input appearance-none pr-10 cursor-pointer"
            >
              {ports.map((p, idx) => (
                <option key={idx} value={locale === 'es' ? p.port : p.port_en}>
                  {locale === 'es' ? p.port : p.port_en}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <FiAnchor size={16} />
            </div>
          </div>
        </div>

        {/* Selector de Producto */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.productLabel}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'avocado', label: t.productAvocado },
              { id: 'mango', label: t.productMango },
              { id: 'cacao', label: t.productCacao }
            ].map((prod) => (
              <button
                key={prod.id}
                onClick={() => setSelectedProduct(prod.id)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  selectedProduct === prod.id
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {prod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        {selectedPort && (
          <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
            
            {/* Tiempo Tránsito */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <FiClock className="text-cyan-600" />
                {t.transitTime}
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                {selectedPort.transit_days} {t.days}
              </span>
            </div>

            {/* Configuración Reefer */}
            <div className="grid grid-cols-3 gap-3">
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center gap-1">
                <FiThermometer className="text-emerald-500" size={20} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.tempShort}
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  {calculatedTemp}°C
                </span>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center gap-1">
                <FiDroplet className="text-cyan-500" size={20} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.humidityShort}
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  {calculatedHum}%
                </span>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center gap-1">
                <FiWind className="text-teal-500" size={20} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.ventilationShort}
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  {calculatedVent} cbm
                </span>
              </div>

            </div>

          </div>
        )}

        <p className="text-[10px] text-slate-400 italic mt-4 text-center">
          {t.infoText}
        </p>

      </div>
    </div>
  );
};
