'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiArrowLeft, FiSearch, FiCpu, FiDroplet, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';

interface LotData {
  lot_code: string;
  product: string;
  product_en: string;
  cooperative: string;
  cooperative_en: string;
  region: string;
  harvest_date: string;
  packing_date: string;
  soil_metrics: {
    ph: number;
    organic_matter: string;
    organic_matter_en: string;
    type: string;
    type_en: string;
  };
  water_metrics: {
    source: string;
    source_en: string;
    purity_level: string;
    irrigation_type: string;
    irrigation_type_en: string;
  };
  destination_port: string;
  destination_port_en: string;
  shipment_date: string;
  status: string;
  status_en: string;
}

export default function TraceabilityPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale];

  const [code, setCode] = useState('');
  const [lotInfo, setLotInfo] = useState<LotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // QR Simulator State
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const fetchLotInfo = async (searchCode: string) => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setSearched(true);
    setNotFound(false);
    setLotInfo(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/traceability/${searchCode.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setLotInfo(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryCode = searchParams?.get('code');
    if (queryCode) {
      setCode(queryCode);
      fetchLotInfo(queryCode);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLotInfo(code);
  };

  // Simulación de Escaneo QR con la Cámara
  const triggerQrScanner = () => {
    setScanning(true);
    setScanMessage(locale === 'es' ? 'Iniciando cámara...' : 'Starting camera...');

    // Simular encendido de cámara y detección de código tras 2.5 segundos
    setTimeout(() => {
      setScanMessage(locale === 'es' ? 'Enfocando código QR del empaque...' : 'Focusing on package QR code...');
    }, 1000);

    setTimeout(() => {
      const demoCodes = ['HY-2026-PL01', 'HY-2026-CC03'];
      const randomCode = demoCodes[Math.floor(Math.random() * demoCodes.length)];
      setScanMessage(locale === 'es' ? `¡QR Detectado! Código: ${randomCode}` : `QR Detected! Code: ${randomCode}`);
      setCode(randomCode);
      
      // Esperar un instante y buscar
      setTimeout(() => {
        setScanning(false);
        fetchLotInfo(randomCode);
      }, 800);
    }, 2500);
  };

  return (
    <div className="section-padding bg-slate-50 flex-grow min-h-screen">
      <div className="container max-w-4xl">
        
        {/* Back Link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 text-sm font-semibold mb-8 cursor-pointer no-underline"
        >
          <FiArrowLeft />
          {locale === 'es' ? 'Volver a Inicio' : 'Back Home'}
        </Link>

        {/* Encabezado */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {t.traceability.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
            {t.traceability.subtitle}
          </p>
        </div>

        {/* Controles de Entrada */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 items-start">
          
          {/* Formulario Manual */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {locale === 'es' ? 'Código de Lote' : 'Lot Code'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder={t.traceability.placeholder}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="form-input text-sm pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <FiSearch size={16} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || scanning}
                className="btn-primary w-full justify-center text-sm cursor-pointer"
              >
                {t.traceability.btnSearch}
              </button>
            </form>
          </div>

          {/* Simulador de Escáner QR (Valor PWA) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-6">
            <h3 className="text-sm font-bold text-slate-800">{locale === 'es' ? 'Escanear Caja en Puerto / Campo' : 'Scan Box at Port / Field'}</h3>
            <p className="text-xs text-slate-400">
              {locale === 'es'
                ? 'Utilice el escáner nativo de la PWA para leer la etiqueta QR del lote.'
                : 'Use the native PWA scanner to read the lot QR label.'}
            </p>

            {scanning ? (
              <div className="relative aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-4 border border-slate-800 overflow-hidden">
                {/* Línea roja láser animada */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-md shadow-red-500/50 top-1/2 animate-bounce"></div>
                <span className="text-[10px] text-white font-semibold text-center animate-pulse" aria-live="polite">
                  {scanMessage}
                </span>
                <button
                  onClick={() => setScanning(false)}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white font-bold text-[9px] px-2 py-1 rounded-lg cursor-pointer"
                >
                  {t.traceability.closeScanner}
                </button>
              </div>
            ) : (
              <button
                onClick={triggerQrScanner}
                disabled={loading}
                className="btn-secondary w-full justify-center !text-xs !py-2.5 cursor-pointer"
              >
                {t.traceability.btnScanner}
              </button>
            )}
          </div>

        </div>

        {/* Carga */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 text-xs italic">{locale === 'es' ? 'Buscando lote en base de datos...' : 'Searching for lot in database...'}</p>
          </div>
        )}

        {/* No Encontrado */}
        {notFound && !loading && (
          <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-3xl p-8 text-center shadow-sm">
            <p className="font-semibold text-sm mb-2">{t.traceability.notFound}</p>
          </div>
        )}

        {/* Detalles del Lote Encontrado */}
        {lotInfo && !loading && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            
            {/* Header Lote */}
            <div className="gradient-bg-brand text-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-200">
                  {locale === 'es' ? 'Lote de Exportación Verificado' : 'Verified Export Lot'}
                </span>
                <h2 className="text-2xl font-black font-headings mt-1">
                  {lotInfo.lot_code}
                </h2>
              </div>
              <div className="bg-white/20 border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <FiCheckCircle />
                {locale === 'es' ? lotInfo.status : lotInfo.status_en}
              </div>
            </div>

            {/* Ficha Técnica Grid */}
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Bloque 1: Resumen y Fechas */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {locale === 'es' ? 'Producto' : 'Product'}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {locale === 'es' ? lotInfo.product : lotInfo.product_en}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.traceability.originTitle}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                    <FiMapPin className="text-emerald-600" />
                    {locale === 'es' ? lotInfo.cooperative : lotInfo.cooperative_en}
                  </span>
                  <span className="text-xs text-slate-500 block">{lotInfo.region}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.traceability.destinationPort}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {locale === 'es' ? lotInfo.destination_port : lotInfo.destination_port_en}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.traceability.harvestDate}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    {lotInfo.harvest_date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.traceability.packingDate}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    {lotInfo.packing_date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t.traceability.shipmentDate}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    {lotInfo.shipment_date}
                  </span>
                </div>
              </div>

              {/* Bloque 2: Hallpa (Tierra) & Yaku (Agua) */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Hallpa Cards */}
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                  <h3 className="text-base font-bold text-emerald-800 flex items-center gap-2 mb-4 border-b border-emerald-100 pb-2">
                    <FiCpu className="text-emerald-600" />
                    {t.traceability.soilTitle}
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">{t.traceability.soilPh}:</span>
                      <span className="font-extrabold text-slate-800">{lotInfo.soil_metrics.ph}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">{t.traceability.soilMatter}:</span>
                      <span className="font-extrabold text-slate-800">
                        {locale === 'es' ? lotInfo.soil_metrics.organic_matter : lotInfo.soil_metrics.organic_matter_en}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">{t.traceability.soilType}:</span>
                      <span className="font-extrabold text-slate-800">
                        {locale === 'es' ? lotInfo.soil_metrics.type : lotInfo.soil_metrics.type_en}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Yaku Cards */}
                <div className="p-6 rounded-2xl bg-cyan-50/50 border border-cyan-100/50">
                  <h3 className="text-base font-bold text-cyan-800 flex items-center gap-2 mb-4 border-b border-cyan-100 pb-2">
                    <FiDroplet className="text-cyan-600" />
                    {t.traceability.waterTitle}
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">{t.traceability.waterSource}:</span>
                      <span className="font-extrabold text-slate-800">
                        {locale === 'es' ? lotInfo.water_metrics.source : lotInfo.water_metrics.source_en}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">{t.traceability.waterPurity}:</span>
                      <span className="font-extrabold text-slate-800">{lotInfo.water_metrics.purity_level}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">{t.traceability.waterIrrigation}:</span>
                      <span className="font-extrabold text-slate-800">
                        {locale === 'es' ? lotInfo.water_metrics.irrigation_type : lotInfo.water_metrics.irrigation_type_en}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
