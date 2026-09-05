'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { translations } from '@/locales/translations';
import { useAuth } from '@/context/AuthContext';
import {
  FiArrowLeft, FiUser, FiAlertTriangle,
  FiPlus, FiDollarSign, FiCalendar,
  FiBell, FiCheck, FiX, FiCheckCircle, FiLayers
} from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const rawLocale = params?.locale as string;
  const locale: 'es' | 'en' = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const t = translations[locale];

  const { user, token, isLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'hoy' | 'promedio' | 'semana' | 'plan' | 'sensores'>('hoy');

  // Estados de datos por pestaña
  const [pricesData, setPricesData] = useState<any>(null);
  const [promedioData, setPromedioData] = useState<any>(null);
  const [semanaData, setSemanaData] = useState<any>(null);
  const [planData, setPlanData] = useState<any>(null);
  const [sensorsData, setSensorsData] = useState<any>(null);

  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Formularios
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editPublishedPrice, setEditPublishedPrice] = useState('');
  const [editExportPrice, setEditExportPrice] = useState('');

  // Registro rápido de lote
  const [loteProduct, setLoteProduct] = useState('cafe_pergamino');
  const [loteKg, setLoteKg] = useState('');
  const [lotePriceCompra, setLotePriceCompra] = useState('');
  const [lotePriceVenta, setLotePriceVenta] = useState('');
  const [loteComprador, setLoteComprador] = useState('');
  const [loteHumedad, setLoteHumedad] = useState('');
  const [loteCostos, setLoteCostos] = useState('1.15');
  const [loteStatusMsg, setLoteStatusMsg] = useState('');

  // Modal de acción sobre lote
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Registro de evento de mercado
  const [eventTitle, setEventTitle] = useState('');
  const [eventDetail, setEventDetail] = useState('');
  const [eventImpact, setEventImpact] = useState('neutro');
  const [eventProduct, setEventProduct] = useState('cafe_pergamino');
  const [eventStatusMsg, setEventStatusMsg] = useState('');

  // Proteger ruta: Si no es admin y no está cargando, redirigir
  useEffect(() => {
    if (!isLoading && (!token || !isAdmin)) {
      router.push(`/${locale}/portal`);
    }
  }, [isLoading, token, isAdmin, router, locale]);

  // Cargar datos de la pestaña activa
  const fetchTabData = async (tab: typeof activeTab) => {
    if (!token) return;
    setLoading(true);
    setErrorMsg('');
    try {
      let tabPath = '';
      if (tab === 'hoy') tabPath = 'prices';
      else if (tab === 'sensores') tabPath = 'sensors';
      else if (tab === 'plan') tabPath = 'plan-vs-real';
      else if (tab === 'promedio') tabPath = 'promedio-dia';
      else tabPath = tab;
      const endpoint = `${API_BASE_URL}/api/dashboard/${tabPath}`;
      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (tab === 'hoy') setPricesData(data);
        else if (tab === 'promedio') setPromedioData(data);
        else if (tab === 'semana') setSemanaData(data);
        else if (tab === 'plan') setPlanData(data);
        else if (tab === 'sensores') setSensorsData(data);
      } else {
        setErrorMsg(locale === 'es' ? 'Error al cargar los datos del panel.' : 'Error loading dashboard data.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(locale === 'es' ? 'Error de conexión con la API.' : 'API connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !isAdmin) return;
    const loadTab = async () => { await fetchTabData(activeTab); };
    loadTab();
  }, [token, isAdmin, activeTab]);

  // Publicar Precio del Día
  const handlePublishPrice = async (prodKey: string, theoryMax: number, tc: number, intl: number) => {
    const published = parseFloat(editPublishedPrice);
    const exportRef = editExportPrice ? parseFloat(editExportPrice) : null;

    if (isNaN(published) || published <= 0) {
      alert(locale === 'es' ? 'Ingrese un precio válido' : 'Enter a valid price');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/prices/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          producto: prodKey,
          compra_publicada_skg: published,
          venta_ref_skg: exportRef,
          cotizacion_intl: intl,
          tipo_cambio: tc,
          compra_max_skg: theoryMax
        })
      });

      if (res.ok) {
        setEditingProduct(null);
        setEditPublishedPrice('');
        setEditExportPrice('');
        fetchTabData('hoy');
      } else {
        alert(locale === 'es' ? 'Error al publicar precio.' : 'Error publishing price.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Guardar Lote Rápido
  const handleAddLote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loteKg || !lotePriceCompra) {
      setLoteStatusMsg(locale === 'es' ? 'Complete los campos obligatorios.' : 'Fill in required fields.');
      return;
    }

    setLoteStatusMsg(locale === 'es' ? 'Registrando...' : 'Registering...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/lotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          producto: loteProduct,
          kg: parseFloat(loteKg),
          precio_compra_skg: parseFloat(lotePriceCompra),
          precio_venta_pactado_skg: lotePriceVenta ? parseFloat(lotePriceVenta) : null,
          comprador: loteComprador || null,
          humedad_pct: loteHumedad ? parseFloat(loteHumedad) : null,
          costos_skg: parseFloat(loteCostos)
        })
      });

      if (res.ok) {
        setLoteStatusMsg(locale === 'es' ? 'Lote registrado con éxito.' : 'Lote registered successfully.');
        setLoteKg('');
        setLotePriceCompra('');
        setLotePriceVenta('');
        setLoteComprador('');
        setLoteHumedad('');
        fetchTabData('semana');
      } else {
        setLoteStatusMsg(locale === 'es' ? 'Error al registrar lote.' : 'Error registering lote.');
      }
    } catch (err) {
      console.error(err);
      setLoteStatusMsg(locale === 'es' ? 'Error de conexión.' : 'Connection error.');
    } finally {
      setTimeout(() => setLoteStatusMsg(''), 3000);
    }
  };

  // Guardar Evento de Mercado
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDetail) {
      setEventStatusMsg(locale === 'es' ? 'Complete los campos del evento.' : 'Fill in event fields.');
      return;
    }

    setEventStatusMsg(locale === 'es' ? 'Registrando...' : 'Registering...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: eventTitle,
          detalle: eventDetail,
          impacto: eventImpact,
          producto: eventProduct
        })
      });

      if (res.ok) {
        setEventStatusMsg(locale === 'es' ? 'Noticia publicada.' : 'Event published.');
        setEventTitle('');
        setEventDetail('');
        fetchTabData('semana');
      } else {
        setEventStatusMsg(locale === 'es' ? 'Error al registrar.' : 'Error registering.');
      }
    } catch (err) {
      console.error(err);
      setEventStatusMsg(locale === 'es' ? 'Error de conexión.' : 'Connection error.');
    } finally {
      setTimeout(() => setEventStatusMsg(''), 3000);
    }
  };

  // Cancelar lote (transacción)
  const handleCancelLote = async () => {
    if (!selectedLote || !actionComment.trim()) {
      alert(locale === 'es' ? 'Por favor ingrese un comentario explicativo.' : 'Please enter an explanatory comment.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/lotes/${selectedLote.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comentario: actionComment })
      });

      if (res.ok) {
        alert(locale === 'es' ? 'Transacción cancelada correctamente y caja reembolsada.' : 'Transaction successfully canceled and cash refunded.');
        setSelectedLote(null);
        setActionComment('');
        // Refrescar pestaña activa
        fetchTabData(activeTab);
      } else {
        const errData = await res.json();
        alert(errData.detail || (locale === 'es' ? 'Error al cancelar la transacción.' : 'Error canceling transaction.'));
      }
    } catch (err) {
      console.error(err);
      alert(locale === 'es' ? 'Error de conexión.' : 'Connection error.');
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar venta del lote (descalzar)
  const handleDeleteLoteSale = async () => {
    if (!selectedLote || !actionComment.trim()) {
      alert(locale === 'es' ? 'Por favor ingrese un comentario explicativo.' : 'Please enter an explanatory comment.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/lotes/${selectedLote.id}/delete-sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comentario: actionComment })
      });

      if (res.ok) {
        alert(locale === 'es' ? 'Venta eliminada del lote correctamente.' : 'Sale successfully removed from batch.');
        setSelectedLote(null);
        setActionComment('');
        // Refrescar pestaña activa
        fetchTabData(activeTab);
      } else {
        const errData = await res.json();
        alert(errData.detail || (locale === 'es' ? 'Error al eliminar la venta.' : 'Error removing sale.'));
      }
    } catch (err) {
      console.error(err);
      alert(locale === 'es' ? 'Error de conexión.' : 'Connection error.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- CÁLCULO DE GRÁFICOS SVG PARA PLAN VS REAL ---
  const svgLineCharts = useMemo(() => {
    if (!planData || !planData.comparativa_mensual) return null;
    const data = planData.comparativa_mensual;
    const padding = 40;
    const w = 500;
    const h = 200;

    // Obtener rangos mínimos y máximos para escala Y (Caja)
    const allCajas = data.flatMap((d: any) => [d.caja_plan, d.caja_real].filter(v => v !== null && v !== undefined));
    const minY = Math.min(...allCajas) * 0.95;
    const maxY = Math.max(...allCajas) * 1.05;
    const rangeY = maxY - minY;

    // Convertir datos a coordenadas (X, Y)
    const pointsPlan: [number, number][] = [];
    const pointsReal: [number, number][] = [];

    data.forEach((d: any, i: number) => {
      const x = padding + (i * (w - padding * 2)) / (data.length - 1);

      const yPlan = h - padding - ((d.caja_plan - minY) * (h - padding * 2)) / rangeY;
      pointsPlan.push([x, yPlan]);

      if (d.caja_real !== null && d.caja_real !== undefined) {
        const yReal = h - padding - ((d.caja_real - minY) * (h - padding * 2)) / rangeY;
        pointsReal.push([x, yReal]);
      }
    });

    const createPath = (points: [number, number][]) => {
      if (points.length === 0) return '';
      return `M ${points[0][0]} ${points[0][1]} ` + points.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(' ');
    };

    return {
      pointsPlan,
      pointsReal,
      pathPlan: createPath(pointsPlan),
      pathReal: createPath(pointsReal),
      w,
      h,
      minY,
      maxY,
      padding
    };
  }, [planData]);

  if (isLoading || (loading && !pricesData && !semanaData && !planData && !sensorsData)) {
    return (
      <div className="section-padding bg-[#070a13] flex-grow min-h-screen flex items-center justify-center">
        <p className="text-slate-400 text-sm italic animate-pulse">{locale === 'es' ? 'Cargando Panel de Control...' : 'Loading Control Panel...'}</p>
      </div>
    );
  }

  if (!token || !isAdmin) {
    return (
      <div className="section-padding bg-[#070a13] flex-grow min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <FiAlertTriangle size={48} className="mx-auto text-red-500 animate-bounce" />
          <h1 className="text-xl font-bold text-slate-100">{locale === 'es' ? 'Acceso Restringido' : 'Restricted Access'}</h1>
          <p className="text-xs text-slate-400">{locale === 'es' ? 'Este panel es exclusivo para administradores de Wari Trading Co S.A.C.' : 'This panel is exclusive to administrators of Wari Trading Co S.A.C.'}</p>
          <Link href={`/${locale}/portal`} className="btn-primary block text-center no-underline mt-4">
            {locale === 'es' ? 'Volver al Portal' : 'Return to Portal'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-[#070a13] flex-grow min-h-screen text-slate-200">
      <div className="container max-w-6xl">

        {/* Barra superior de navegación */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/portal`}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-400 hover:text-slate-100 transition-all cursor-pointer no-underline"
              title={t.dashboard?.backPortal || 'Volver'}
            >
              <FiArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-headings tracking-tight text-white mb-0.5 leading-tight">
                {t.dashboard?.title || 'Panel de Control de Acopio'}
              </h1>
              <p className="text-xs text-slate-400 m-0">
                {t.dashboard?.subtitle || 'Monitoreo financiero y cotizaciones del día.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-full text-xs font-bold text-emerald-400 flex items-center gap-1.5 shadow-md">
              <FiUser size={12} />
              <span>{user?.name} ({user?.role.toUpperCase()})</span>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Dashboard */}
        <div className="flex bg-slate-900/60 border border-slate-800 p-1.5 rounded-full mb-8 overflow-x-auto gap-1">
          {(['hoy', 'promedio', 'semana', 'plan', 'sensores'] as const).map((tab) => {
            const labels = {
              hoy: t.dashboard?.tabHoy || 'HOY',
              promedio: locale === 'es' ? 'PROMEDIO DEL DÍA' : 'DAILY AVERAGE',
              semana: t.dashboard?.tabSemana || 'SEMANA',
              plan: t.dashboard?.tabPlan || 'PLAN vs REAL',
              sensores: t.dashboard?.tabSensores || 'SENSORES'
            };
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-6 text-xs font-bold font-headings rounded-full transition-all cursor-pointer whitespace-nowrap ${active
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Mensaje de Error global */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <FiAlertTriangle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* CONTENIDO DE PESTAÑAS */}
        <AnimatePresence mode="wait">
          {activeTab === 'hoy' && pricesData && (
            <motion.div
              key="hoy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Alerta de volatilidad */}
              {pricesData.volatilidad_alerta && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3 animate-pulse">
                  <FiAlertTriangle size={18} className="text-red-500 shrink-0" />
                  <div>
                    <strong className="font-bold block uppercase">{locale === 'es' ? 'ALERTA DE VOLATILIDAD' : 'VOLATILITY ALERT'}</strong>
                    <span>{locale === 'es' ? 'Las cotizaciones internacionales variaron más de 5% hoy. Recalcular precios antes de acopiar.' : 'International prices fluctuated over 5% today. Recalculate before buying.'}</span>
                  </div>
                </div>
              )}

              {/* Tarjetas de Producto */}
              <div className="grid md:grid-cols-3 gap-6">
                {Object.values(pricesData.productos || {}).map((p: any) => {
                  const hasPrice = p.compra_publicada_skg !== null && p.compra_publicada_skg !== undefined;
                  const spread = hasPrice ? ((p.venta_ref_skg - p.compra_publicada_skg) / p.compra_publicada_skg) * 100 : null;

                  // Semáforo de spread: verde >= 3.3%, ambar 2.5-3.3%, rojo < 2.5%
                  const spreadColorClass = !spread ? 'text-slate-400'
                    : spread >= 3.5 ? 'text-emerald-400'
                      : spread >= 2.5 ? 'text-amber-400'
                        : 'text-red-400';

                  return (
                    <div key={p.producto} className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl relative flex flex-col justify-between">
                      {p.publicado && (
                        <div className="absolute top-0 right-0 bg-emerald-500/10 border-b border-l border-emerald-500/20 text-emerald-400 text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                          <FiCheck size={10} />
                          {locale === 'es' ? 'Publicado' : 'Published'}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{locale === 'es' ? 'Paridad e ICE' : 'Parity & ICE'}</span>
                          <h3 className="text-lg font-bold text-white font-headings">{p.nombre}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900 text-xs">
                          <div>
                            <span className="text-[9px] text-slate-500 block mb-0.5">{locale === 'es' ? 'Cotización' : 'Cotisation'}</span>
                            <span className="font-bold text-slate-300">{p.cotizacion_intl.toLocaleString()} {p.unidad_intl}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block mb-0.5">T/C (USD/PEN)</span>
                            <span className="font-bold text-slate-300">S/. {p.tipo_cambio.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                            <span className="text-slate-400">{t.dashboard?.theoreticalMax || 'Compra Máxima (Fórmula)'}</span>
                            <span className="font-bold text-slate-200">S/. {p.compra_max_skg.toFixed(2)}/kg</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                            <span className="text-slate-400">{t.dashboard?.publishedPrice || 'Compra Publicada'}</span>
                            <span className="font-extrabold text-emerald-400">
                              {hasPrice ? `S/. ${p.compra_publicada_skg.toFixed(2)}/kg` : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                            <span className="text-slate-400">{t.dashboard?.exportRef || 'Venta Ref. Exportador'}</span>
                            <span className="font-bold text-slate-300">S/. {p.venta_ref_skg.toFixed(2)}/kg</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 font-bold">
                            <span className="text-slate-400">{t.dashboard?.spread || 'Spread Implícito'}</span>
                            <span className={`${spreadColorClass}`}>
                              {spread ? `${spread.toFixed(1)}%` : '—'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón de Modificación/Publicación */}
                      <div className="mt-6 pt-4 border-t border-slate-800/80">
                        {editingProduct === p.producto ? (
                          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">P. Compra</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editPublishedPrice}
                                  onChange={(e) => setEditPublishedPrice(e.target.value)}
                                  placeholder={p.compra_max_skg.toFixed(2)}
                                  className="w-full bg-slate-900 border border-slate-700/50 rounded-lg py-2 px-3 text-white font-bold focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-500 uppercase mb-1">P. Venta Ref</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editExportPrice}
                                  onChange={(e) => setEditExportPrice(e.target.value)}
                                  placeholder={p.venta_ref_skg.toFixed(2)}
                                  className="w-full bg-slate-900 border border-slate-700/50 rounded-lg py-2 px-3 text-white font-bold focus:outline-none focus:border-cyan-500"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePublishPrice(p.producto, p.compra_max_skg, p.tipo_cambio, p.cotizacion_intl)}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-[10px] font-bold py-1.5 rounded-full cursor-pointer transition-all shadow-md"
                              >
                                ✔ {locale === 'es' ? 'Publicar' : 'Publish'}
                              </button>
                              <button
                                onClick={() => setEditingProduct(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 text-[10px] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-all"
                              >
                                <FiX />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProduct(p.producto);
                              setEditPublishedPrice(hasPrice ? p.compra_publicada_skg.toString() : p.compra_max_skg.toFixed(2));
                              setEditExportPrice(p.venta_ref_skg.toString());
                            }}
                            className="w-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 rounded-full text-slate-300 hover:text-white text-xs font-bold py-2.5 transition-all cursor-pointer shadow-sm"
                          >
                            ✏ {t.dashboard?.publishBtn || 'Publicar Precio'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lotes Sin Calzar */}
              <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <FiAlertTriangle className="text-red-500 shrink-0" />
                  {t.dashboard?.uncalzedWarning || 'Lotes sin venta calzada (¡Acción Requerida!)'}
                </h3>

                <div className="space-y-3">
                  {pricesData.lotes_sin_calzar && pricesData.lotes_sin_calzar.length > 0 ? (
                    pricesData.lotes_sin_calzar.map((lot: any) => (
                      <div
                        key={lot.id}
                        onClick={() => {
                          setSelectedLote(lot);
                          setActionComment(lot.comentario || '');
                        }}
                        className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex justify-between items-center text-xs cursor-pointer hover:bg-red-500/10 transition-colors"
                        title={locale === 'es' ? 'Haga clic para gestionar transacciones y ventas' : 'Click to manage transaction and sales'}
                      >
                        <div className="space-y-1">
                          <div className="flex gap-2 items-center">
                            <span className="font-bold text-red-400">Lote #{lot.id}</span>
                            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{lot.producto.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="text-slate-400">
                            <strong>{lot.kg.toLocaleString()} kg</strong> a S/. {lot.precio_compra_skg.toFixed(2)}/kg
                          </div>
                          <div className="text-[10px] text-slate-500">Comprado el: {lot.fecha_compra}</div>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-red-500 uppercase bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/10 tracking-wider">
                            {locale === 'es' ? '¡SIN VENTA!' : 'UNMATCHED!'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 italic text-xs flex flex-col items-center gap-2">
                      <FiCheckCircle size={28} className="text-emerald-500" />
                      <span>{t.dashboard?.noUncalzed || 'Todos los lotes están debidamente calzados con ventas comprometidas.'}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'promedio' && promedioData && (
            <motion.div
              key="promedio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Resumen general de hoy */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      {locale === 'es' ? 'Volumen Total Hoy' : 'Total Volume Today'}
                    </span>
                    <span className="text-2xl font-extrabold text-white font-headings">
                      {promedioData.general.total_kg.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FiLayers size={22} />
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      {locale === 'es' ? 'Capital Desplegado Hoy' : 'Capital Deployed Today'}
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-headings">
                      S/. {promedioData.general.total_monto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <FiDollarSign size={22} />
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      {locale === 'es' ? 'Transacciones de Hoy' : 'Today\'s Transactions'}
                    </span>
                    <span className="text-2xl font-extrabold text-white font-headings">
                      {promedioData.general.lotes_count} {locale === 'es' ? 'lotes' : 'batches'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-full bg-slate-800 border border-slate-700/50 text-slate-400">
                    <FiCalendar size={22} />
                  </div>
                </div>
              </div>

              {/* Grid de Productos - Promedios */}
              <div className="grid md:grid-cols-3 gap-6">
                {Object.values(promedioData.productos || {}).map((p: any) => {
                  const hasPurchases = p.total_kg > 0;
                  const diff = hasPurchases && p.precio_publicado > 0 ? p.precio_promedio - p.precio_publicado : null;
                  const pctDiff = diff && p.precio_publicado > 0 ? (diff / p.precio_publicado) * 100 : null;

                  // Color de la diferencia: si pagamos más del publicado es rojo (sobrepago), si pagamos menos o igual es verde
                  const diffColorClass = !diff ? 'text-slate-400'
                    : diff > 0.05 ? 'text-red-400' // Pagamos más que el publicado
                      : diff < -0.05 ? 'text-emerald-400' // Pagamos menos (descuento/ahorro)
                        : 'text-slate-300';

                  return (
                    <div key={p.producto} className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                            {locale === 'es' ? 'Resumen Diario' : 'Daily Summary'}
                          </span>
                          <h3 className="text-lg font-bold text-white font-headings">{p.nombre}</h3>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                            <span className="text-slate-400">{locale === 'es' ? 'Volumen Acopiado' : 'Volume Collected'}</span>
                            <span className="font-bold text-slate-200">{p.total_kg.toLocaleString()} kg</span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                            <span className="text-slate-400">{locale === 'es' ? 'Monto Invertido' : 'Amount Invested'}</span>
                            <span className="font-bold text-slate-200">S/. {p.total_monto.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                            <span className="text-slate-400">{locale === 'es' ? 'P. Promedio Real' : 'Real Avg Price'}</span>
                            <span className="font-extrabold text-white text-sm">
                              {hasPurchases ? `S/. ${p.precio_promedio.toFixed(2)}/kg` : '—'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                            <span className="text-slate-400">{locale === 'es' ? 'Precio Publicado' : 'Published Price'}</span>
                            <span className="font-bold text-slate-300">
                              {p.precio_publicado > 0 ? `S/. ${p.precio_publicado.toFixed(2)}/kg` : '—'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-1 font-bold">
                            <span className="text-slate-400">{locale === 'es' ? 'Desviación vs Pub.' : 'Deviation vs Pub.'}</span>
                            <span className={diffColorClass}>
                              {pctDiff !== null && diff !== null ? `${pctDiff > 0 ? '+' : ''}${pctDiff.toFixed(1)}% (${diff > 0 ? '+' : ''}S/. ${diff.toFixed(2)})` : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detalle de lotes de hoy */}
              <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
                  {locale === 'es' ? 'Lotes Comprados Hoy (Detalle)' : 'Batches Purchased Today (Detail)'}
                </h3>
                <div className="overflow-x-auto">
                  {promedioData.lotes && promedioData.lotes.length > 0 ? (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                          <th className="pb-2">Lote ID</th>
                          <th className="pb-2">Producto</th>
                          <th className="pb-2">Peso</th>
                          <th className="pb-2">P. Compra</th>
                          <th className="pb-2">Venta Pactada</th>
                          <th className="pb-2">Comprador</th>
                          <th className="pb-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promedioData.lotes.map((l: any) => (
                          <tr
                            key={l.id}
                            onClick={() => {
                              setSelectedLote(l);
                              setActionComment(l.comentario || '');
                            }}
                            className="border-b border-slate-900 hover:bg-slate-950/40 transition-colors cursor-pointer"
                            title={locale === 'es' ? 'Haga clic para gestionar transacciones y ventas' : 'Click to manage transaction and sales'}
                          >
                            <td className="py-2.5 font-bold text-slate-400">#{l.id}</td>
                            <td className="py-2.5 font-semibold text-emerald-400">
                              {l.producto === 'cafe_pergamino' ? 'Café Pergamino' : l.producto === 'cacao_conv' ? 'Cacao Convencional' : 'Cacao Fino de Aroma'}
                            </td>
                            <td className="py-2.5 text-slate-200">{l.kg.toLocaleString()} kg</td>
                            <td className="py-2.5 text-slate-300">S/. {l.precio_compra_skg.toFixed(2)}/kg</td>
                            <td className="py-2.5">
                              {l.precio_venta_pactado_skg ? (
                                <span className="text-cyan-400">S/. {l.precio_venta_pactado_skg.toFixed(2)}/kg</span>
                              ) : (
                                <span className="text-red-500 font-extrabold uppercase text-[9px] bg-red-500/10 px-1.5 py-0.5 rounded">¡Sin calzar!</span>
                              )}
                            </td>
                            <td className="py-2.5 text-slate-400">{l.comprador || '—'}</td>
                            <td className="py-2.5">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${l.estado === 'cobrado' ? 'bg-emerald-500/10 text-emerald-400'
                                  : l.estado === 'entregado' ? 'bg-cyan-500/10 text-cyan-400'
                                    : l.estado === 'cancelado' ? 'bg-red-500/10 text-red-400'
                                      : 'bg-slate-800 text-slate-400'
                                }`}>
                                {l.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12 text-slate-500 italic text-xs">
                      {locale === 'es' ? 'No se han registrado compras el día de hoy todavía.' : 'No purchases have been registered today yet.'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'semana' && semanaData && (
            <motion.div
              key="semana"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-12 gap-8"
            >
              {/* Resumen Físico y Financiero */}
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      {locale === 'es' ? 'Kg Comprados' : 'Kg Acquired'}
                    </span>
                    <span className="text-2xl font-extrabold text-white font-headings">
                      {semanaData.kg_totales.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FiLayers size={22} />
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      {locale === 'es' ? 'Dinero Desplegado' : 'Capital Deployed'}
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-headings">
                      S/. {semanaData.dinero_desplegado.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <FiDollarSign size={22} />
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      {locale === 'es' ? 'Lotes Activos' : 'Active Batches'}
                    </span>
                    <span className="text-2xl font-extrabold text-white font-headings">
                      {semanaData.lotes?.length || 0} lotes
                    </span>
                  </div>
                  <div className="p-3.5 rounded-full bg-slate-800 border border-slate-700/50 text-slate-400">
                    <FiCalendar size={22} />
                  </div>
                </div>
              </div>

              {/* Registro rápido de lote comprado */}
              <div className="md:col-span-6 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <FiPlus className="text-emerald-500" />
                  {t.dashboard?.quickRegister || 'Registro Rápido de Lote (Compra)'}
                </h3>

                <form onSubmit={handleAddLote} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Producto *</label>
                      <select
                        value={loteProduct}
                        onChange={(e) => setLoteProduct(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="cafe_pergamino">Café Pergamino</option>
                        <option value="cacao_conv">Cacao Convencional</option>
                        <option value="cacao_fino">Cacao Fino de Aroma</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Peso Neto (kg) *</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="Ej: 5000"
                        value={loteKg}
                        onChange={(e) => setLoteKg(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">P. Compra (S/ por kg) *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 16.20"
                        value={lotePriceCompra}
                        onChange={(e) => setLotePriceCompra(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">P. Venta Pactado (Opcional)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 19.50"
                        value={lotePriceVenta}
                        onChange={(e) => setLotePriceVenta(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Comprador Comprometido</label>
                      <input
                        type="text"
                        placeholder="Ej: Sumaqao"
                        value={loteComprador}
                        onChange={(e) => setLoteComprador(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Humedad (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="12.5"
                        value={loteHumedad}
                        onChange={(e) => setLoteHumedad(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-3 pt-3">
                    <div className="flex-grow">
                      <span className="text-[10px] text-slate-500 block mb-1">{locale === 'es' ? 'Costo Operativo Fijo por Kg' : 'Operational Cost per Kg'}</span>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={loteCostos}
                          onChange={(e) => setLoteCostos(e.target.value)}
                          className="w-20 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 text-center font-bold"
                        />
                        <span className="text-[10px] text-slate-500 self-center">PEN / kg</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-md shrink-0 whitespace-nowrap"
                    >
                      {locale === 'es' ? 'Registrar Compra' : 'Save Purchase'}
                    </button>
                  </div>
                  {loteStatusMsg && (
                    <p className="text-[11px] text-emerald-400 font-semibold italic text-center mt-2">{loteStatusMsg}</p>
                  )}
                </form>
              </div>

              {/* Registro de Evento y Volatilidad del Mercado */}
              <div className="md:col-span-6 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <FiBell className="text-cyan-500" />
                    {locale === 'es' ? 'Registrar Evento de Mercado' : 'Post Market Event'}
                  </h3>

                  <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Título del Evento *</label>
                      <input
                        type="text"
                        placeholder="Ej: Caída de stock en depósitos de ICE"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Detalle del Impacto *</label>
                      <textarea
                        rows={2}
                        placeholder="Describa el hecho y las implicaciones para el acopio..."
                        value={eventDetail}
                        onChange={(e) => setEventDetail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Impacto</label>
                        <select
                          value={eventImpact}
                          onChange={(e) => setEventImpact(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                        >
                          <option value="alcista">📈 Alcista (Bullish)</option>
                          <option value="bajista">📉 Bajista (Bearish)</option>
                          <option value="neutro">⚖ Neutro (Neutral)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Producto Relacionado</label>
                        <select
                          value={eventProduct}
                          onChange={(e) => setEventProduct(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none"
                        >
                          <option value="cafe_pergamino">Café</option>
                          <option value="cacao_conv">Cacao Convencional</option>
                          <option value="cacao_fino">Cacao Fino de Aroma</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-600 text-slate-200 hover:text-white font-bold py-2 px-5 rounded-full cursor-pointer transition-all shadow-sm"
                      >
                        {t.dashboard?.addEventBtn || 'Publicar Noticia'}
                      </button>
                    </div>
                    {eventStatusMsg && (
                      <p className="text-[11px] text-cyan-400 font-semibold italic text-center mt-1">{eventStatusMsg}</p>
                    )}
                  </form>
                </div>
              </div>

              {/* Feed de Eventos Recientes de la Semana */}
              <div className="md:col-span-12 grid md:grid-cols-12 gap-8">

                {/* Lotes Comprados en la semana */}
                <div className="md:col-span-8 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
                    {locale === 'es' ? 'Lotes Registrados esta Semana' : 'Registered Batches this Week'}
                  </h3>
                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-2">
                    {semanaData.lotes && semanaData.lotes.length > 0 ? (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                            <th className="pb-2">Lote ID</th>
                            <th className="pb-2">Producto</th>
                            <th className="pb-2">Peso</th>
                            <th className="pb-2">P. Compra</th>
                            <th className="pb-2">Venta Pactada</th>
                            <th className="pb-2">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semanaData.lotes.map((l: any) => (
                            <tr
                              key={l.id}
                              onClick={() => {
                                setSelectedLote(l);
                                setActionComment(l.comentario || '');
                              }}
                              className="border-b border-slate-900 hover:bg-slate-950/40 transition-colors cursor-pointer"
                              title={locale === 'es' ? 'Haga clic para gestionar transacciones y ventas' : 'Click to manage transaction and sales'}
                            >
                              <td className="py-2.5 font-bold text-slate-400">#{l.id}</td>
                              <td className="py-2.5 font-semibold text-emerald-400">{l.producto.replace(/_/g, ' ')}</td>
                              <td className="py-2.5 text-slate-200">{l.kg.toLocaleString()} kg</td>
                              <td className="py-2.5 text-slate-300">S/. {l.precio_compra_skg.toFixed(2)}</td>
                              <td className="py-2.5 font-bold">
                                {l.precio_venta_pactado_skg ? (
                                  <span className="text-cyan-400">S/. {l.precio_venta_pactado_skg.toFixed(2)}</span>
                                ) : (
                                  <span className="text-red-500 font-extrabold uppercase text-[9px] bg-red-500/10 px-1.5 py-0.5 rounded">¡Sin calzar!</span>
                                )}
                              </td>
                              <td className="py-2.5">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${l.estado === 'cobrado' ? 'bg-emerald-500/10 text-emerald-400'
                                    : l.estado === 'entregado' ? 'bg-cyan-500/10 text-cyan-400'
                                      : l.estado === 'cancelado' ? 'bg-red-500/10 text-red-400'
                                        : 'bg-slate-800 text-slate-400'
                                  }`}>
                                  {l.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-12">{locale === 'es' ? 'No hay compras registradas en esta semana todavía.' : 'No purchases registered this week yet.'}</p>
                    )}
                  </div>
                </div>

                {/* Notificaciones y Feed de Mercado */}
                <div className="md:col-span-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
                    {t.dashboard?.feedTitle || 'Noticias y Eventos de Volatilidad'}
                  </h3>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {semanaData.eventos_mercado && semanaData.eventos_mercado.length > 0 ? (
                      semanaData.eventos_mercado.map((ev: any) => {
                        const impColors = {
                          alcista: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
                          bajista: 'border-red-500/30 bg-red-500/5 text-red-400',
                          neutro: 'border-slate-800 bg-slate-950/20 text-slate-300'
                        };
                        const colorClass = (impColors as any)[ev.impacto] || impColors.neutro;

                        return (
                          <div key={ev.id} className={`border p-4 rounded-2xl text-xs space-y-1.5 ${colorClass}`}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">{ev.titulo}</span>
                              <span className="text-[8px] text-slate-500">{ev.fecha}</span>
                            </div>
                            <p className="text-slate-400 italic text-[11px] leading-relaxed">&ldquo;{ev.detail || ev.detalle}&rdquo;</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 italic text-center py-12">{locale === 'es' ? 'Sin eventos de mercado registrados.' : 'No market events posted.'}</p>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {activeTab === 'plan' && planData && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
               {/* KPIs de contraste */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 md:p-6 shadow-xl text-center">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{t.dashboard?.kpiCiclos || 'Ciclos Cerrados'}</span>
                   <span className="text-xl font-extrabold text-white font-headings">{planData.kpis.ciclos_completados}</span>
                 </div>
                 <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 md:p-6 shadow-xl text-center">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{t.dashboard?.kpiCollection || 'Promedio Cobro'}</span>
                   <span className="text-xl font-extrabold text-white font-headings">{planData.kpis.dias_promedio_cobro} días</span>
                 </div>
                 <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 md:p-6 shadow-xl text-center">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{locale === 'es' ? 'Margen Promedio Real' : 'Avg Real Margin'}</span>
                   <span className="text-xl font-extrabold text-emerald-400 font-headings">{planData.kpis.margen_neto_promedio_pct}%</span>
                 </div>
                 <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 md:p-6 shadow-xl text-center">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{locale === 'es' ? 'Equilibrio Requerido' : 'Required Breakeven'}</span>
                   <span className="text-xl font-extrabold text-slate-400 font-headings">{planData.kpis.equilibrio_margen_pct}%</span>
                 </div>
               </div>

              {/* Gráficos de Contraste */}
              <div className="grid md:grid-cols-2 gap-8">

                {/* Gráfico 1: Caja Acumulada Real vs Plan (Line Chart SVG) */}
                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
                    📈 {t.dashboard?.chartCashTitle || 'Caja Acumulada Real vs Plan'}
                  </h3>

                  {svgLineCharts && (
                    <div className="space-y-4">
                      <div className="relative h-56 bg-slate-950/40 border border-slate-900 rounded-2xl p-2 flex items-center justify-center">
                        <svg viewBox={`0 0 ${svgLineCharts.w} ${svgLineCharts.h}`} className="w-full h-full">
                          {/* Grid Lines */}
                          {[0, 1, 2, 3].map((gridIdx) => {
                            const valY = svgLineCharts.h - svgLineCharts.padding - (gridIdx * (svgLineCharts.h - svgLineCharts.padding * 2)) / 3;
                            return (
                              <line
                                key={gridIdx}
                                x1={svgLineCharts.padding}
                                y1={valY}
                                x2={svgLineCharts.w - svgLineCharts.padding}
                                y2={valY}
                                stroke="rgba(255, 255, 255, 0.05)"
                                strokeDasharray="3,3"
                              />
                            );
                          })}

                          {/* Line Plan (Cyan) */}
                          <path
                            d={svgLineCharts.pathPlan}
                            fill="none"
                            stroke="#0891b2"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="opacity-75"
                          />

                          {/* Line Real (Emerald) */}
                          <path
                            d={svgLineCharts.pathReal}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />

                          {/* Data points */}
                          {svgLineCharts.pointsPlan.map((p, idx) => (
                            <circle key={`p-${idx}`} cx={p[0]} cy={p[1]} r="4" fill="#0891b2" />
                          ))}
                          {svgLineCharts.pointsReal.map((p, idx) => (
                            <circle key={`r-${idx}`} cx={p[0]} cy={p[1]} r="4.5" fill="#10b981" />
                          ))}

                          {/* Labels X Axis */}
                          {planData.comparativa_mensual.map((d: any, idx: number) => {
                            const x = svgLineCharts.padding + (idx * (svgLineCharts.w - svgLineCharts.padding * 2)) / (planData.comparativa_mensual.length - 1);
                            // Solo mostrar alternados para no sobrecargar
                            if (idx % 2 !== 0) return null;
                            return (
                              <text
                                key={`lx-${idx}`}
                                x={x}
                                y={svgLineCharts.h - svgLineCharts.padding / 2 + 5}
                                fill="#64748b"
                                fontSize="9"
                                textAnchor="middle"
                                fontWeight="bold"
                              >
                                {d.mes}
                              </text>
                            );
                          })}
                        </svg>
                      </div>
                      <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-1.5 rounded-full bg-cyan-600" />
                          <span className="text-slate-400">Plan: S/. Proyectado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-slate-200">Real: S/. Caja Acumulada</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gráfico 2: Margen Real vs Plan (Bar Chart SVG) */}
                <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
                    📊 {t.dashboard?.chartMarginTitle || 'Fulfillment de Margen Neto Mensual'}
                  </h3>

                  {planData.comparativa_mensual && (
                    <div className="space-y-4">
                      <div className="relative h-56 bg-slate-950/40 border border-slate-900 rounded-2xl p-2 flex items-center justify-center">
                        <svg viewBox="0 0 500 200" className="w-full h-full">
                          {/* Y-axis grids */}
                          {[0, 1, 2, 3].map((g) => {
                            const y = 30 + (g * 120) / 3;
                            return <line key={g} x1="40" y1={y} x2="460" y2={y} stroke="rgba(255,255,255,0.03)" />;
                          })}

                          {planData.comparativa_mensual.slice(0, 6).map((d: any, idx: number) => {
                            const xBase = 50 + idx * 70;
                            // Altura proporcional (Meta típica de margen es S/ 20,300)
                            const maxVal = 25000;
                            const hPlan = (d.margen_plan / maxVal) * 120;
                            const hReal = d.margen_real !== null ? (d.margen_real / maxVal) * 120 : 0;

                            return (
                              <g key={idx}>
                                {/* Meta Bar (Grayish blue) */}
                                <rect
                                  x={xBase}
                                  y={150 - hPlan}
                                  width="14"
                                  height={hPlan}
                                  fill="rgba(100, 116, 139, 0.2)"
                                  rx="3"
                                />
                                {/* Real Bar (Cyan/Green gradient simulated by color) */}
                                {d.margen_real !== null && (
                                  <rect
                                    x={xBase + 16}
                                    y={150 - hReal}
                                    width="14"
                                    height={hReal}
                                    fill={d.margen_real >= d.margen_plan ? '#10b981' : '#0891b2'}
                                    rx="3"
                                  />
                                )}
                                {/* Label X */}
                                <text
                                  x={xBase + 15}
                                  y="170"
                                  fill="#64748b"
                                  fontSize="9"
                                  textAnchor="middle"
                                  fontWeight="bold"
                                >
                                  {d.mes}
                                </text>
                                {/* Label values on top of real bars */}
                                {d.margen_real !== null && (
                                  <text
                                    x={xBase + 23}
                                    y={142 - hReal}
                                    fill="#f8fafc"
                                    fontSize="7"
                                    textAnchor="middle"
                                    fontWeight="extrabold"
                                  >
                                    {Math.round(d.margen_real / 1000)}k
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                      <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-slate-700/60" />
                          <span className="text-slate-400">Meta: S/. Planificada</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-emerald-500" />
                          <span className="text-slate-200">Real: S/. Obtenido</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'sensores' && sensorsData && (
            <motion.div
              key="sensores"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" />
                  {t.dashboard?.validadorSensores || 'Semáforo de Sensores Operativos'}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sensorsData.sensores.map((s: any) => {
                  const stateConfig = {
                    verde: {
                      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                      badge: 'bg-emerald-500 text-[#070a13]',
                      label: locale === 'es' ? 'ÓPTIMO' : 'OPTIMAL'
                    },
                    ambar: {
                      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
                      badge: 'bg-amber-500 text-[#070a13]',
                      label: locale === 'es' ? 'AMENAZA' : 'WARNING'
                    },
                    rojo: {
                      bg: 'bg-red-500/10 border-red-500/30 text-red-400',
                      badge: 'bg-red-500 text-white animate-pulse',
                      label: locale === 'es' ? 'CRÍTICO' : 'CRITICAL'
                    }
                  };
                  const config = (stateConfig as any)[s.estado] || stateConfig.verde;

                  return (
                    <div key={s.id} className={`border rounded-3xl p-6 md:p-8 shadow-lg flex flex-col justify-between space-y-4 ${config.bg}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{s.nombre}</h4>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${config.badge}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="text-2xl font-black font-headings text-white">
                          {s.valor}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 text-[10px] space-y-1 text-slate-400">
                        <div>
                          <strong>{t.dashboard?.metaLabel || 'Meta'}:</strong> {s.meta}
                        </div>
                        <div>
                          <strong className="text-red-400">{t.dashboard?.alarmLabel || 'Alarma'}:</strong> {s.alarma}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Acciones de Lote */}
        {selectedLote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white font-headings">
                  {locale === 'es' ? `Gestionar Lote #${selectedLote.id}` : `Manage Batch #${selectedLote.id}`}
                </h3>
                <button
                  onClick={() => {
                    setSelectedLote(null);
                    setActionComment('');
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <FiX size={16} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">{locale === 'es' ? 'Producto' : 'Product'}</span>
                    <span className="font-bold text-emerald-400 capitalize">
                      {selectedLote.producto.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">{locale === 'es' ? 'Volumen (kg)' : 'Volume (kg)'}</span>
                    <span className="font-bold text-white">
                      {selectedLote.kg.toLocaleString()} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">{locale === 'es' ? 'Precio Compra' : 'Buy Price'}</span>
                    <span className="font-bold text-white">
                      S/. {selectedLote.precio_compra_skg.toFixed(2)}/kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">{locale === 'es' ? 'Estado Actual' : 'Current State'}</span>
                    <span className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded-full ${selectedLote.estado === 'cancelado' ? 'bg-red-500/10 text-red-400'
                        : selectedLote.estado === 'cobrado' ? 'bg-emerald-500/10 text-emerald-400'
                          : selectedLote.estado === 'entregado' ? 'bg-cyan-500/10 text-cyan-400'
                            : 'bg-slate-800 text-slate-400'
                      }`}>
                      {selectedLote.estado}
                    </span>
                  </div>
                </div>

                {(selectedLote.comprador || selectedLote.precio_venta_pactado_skg) && (
                  <div className="bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/10 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-slate-500 block mb-0.5">{locale === 'es' ? 'Venta Comprometida' : 'Committed Sale'}</span>
                      <strong className="text-cyan-400">{selectedLote.comprador || '—'}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block mb-0.5">{locale === 'es' ? 'Precio Venta' : 'Sell Price'}</span>
                      <strong className="text-cyan-400">
                        S/. {selectedLote.precio_venta_pactado_skg ? selectedLote.precio_venta_pactado_skg.toFixed(2) : '—'}/kg
                      </strong>
                    </div>
                  </div>
                )}

                {/* Comentario Histórico/Actual */}
                {selectedLote.comentario && (
                  <div className="p-4 bg-slate-950/20 rounded-2xl border border-slate-800/40 text-[11px] leading-relaxed text-slate-400 italic">
                    <strong>{locale === 'es' ? 'Nota registrada:' : 'Registered note:'}</strong> &ldquo;{selectedLote.comentario}&rdquo;
                  </div>
                )}

                {/* Input de Comentario */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {locale === 'es' ? 'Comentario / Justificación *' : 'Comment / Justification *'}
                  </label>
                  <textarea
                    rows={3}
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    placeholder={locale === 'es' ? 'Escriba el motivo de la cancelación o eliminación de la venta...' : 'Write the reason for cancellation or sale removal...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2 px-3 text-slate-200 focus:outline-none focus:border-red-500"
                    disabled={actionLoading}
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2 pt-2">
                {selectedLote.estado !== 'cancelado' && (
                  <div className="flex gap-2">
                    {/* Botón Eliminar Venta */}
                    {(selectedLote.comprador || selectedLote.precio_venta_pactado_skg) && (
                      <button
                        onClick={handleDeleteLoteSale}
                        disabled={actionLoading || !actionComment.trim()}
                        className="flex-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/20 text-cyan-400 font-bold py-2.5 px-4 rounded-full cursor-pointer transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed text-center"
                        title={locale === 'es' ? 'Resetea el comprador y precio venta a sin calzar' : 'Resets buyer and selling price to unmatched'}
                      >
                        {locale === 'es' ? 'Eliminar Venta' : 'Remove Sale'}
                      </button>
                    )}

                    {/* Botón Cancelar Transacción */}
                    <button
                      onClick={handleCancelLote}
                      disabled={actionLoading || !actionComment.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-full cursor-pointer transition-all text-xs disabled:opacity-40 disabled:cursor-not-allowed text-center shadow-lg shadow-red-600/10"
                      title={locale === 'es' ? 'Marca el lote como cancelado y devuelve egreso a caja' : 'Marks batch as canceled and refunds cash'}
                    >
                      {locale === 'es' ? 'Cancelar Transacción' : 'Cancel Transaction'}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedLote(null);
                    setActionComment('');
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 font-bold py-2.5 px-4 rounded-full cursor-pointer transition-all text-xs text-center"
                >
                  {locale === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
