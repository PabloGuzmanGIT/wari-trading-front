'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { useAuth } from '@/context/AuthContext';
import { 
  FiArrowLeft, FiUser, FiMail, FiPlus, FiLogOut, FiCheckCircle, 
  FiPackage, FiGlobe, FiDatabase, FiAward 
} from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';

export default function PortalPage() {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale];

  const { user, token, login, logout, isLoading } = useAuth();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Portal dashboard data state
  const [portalData, setPortalData] = useState<any>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // Form para registrar nueva entrega de Productor
  const [prodProduct, setProdProduct] = useState('Palta Hass');
  const [prodWeight, setProdWeight] = useState('');
  const [prodPricePen, setProdPricePen] = useState('');
  const [prodLocation, setProdLocation] = useState('');
  const [prodStatusMsg, setProdStatusMsg] = useState('');

  // Action state for Admin negotiation
  const [negotiatingLotId, setNegotiatingLotId] = useState<number | null>(null);
  const [negotiatingPrice, setNegotiatingPrice] = useState('');

  const fetchPortalData = async () => {
    if (!token) return;
    setPortalLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/portal/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPortalData(data);
      }
    } catch (err) {
      console.error('Error fetching portal data:', err);
    } finally {
      setPortalLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortalData();
    } else {
      setPortalData(null);
    }
  }, [token]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    setLoginSubmitting(true);
    const success = await login(email, password);
    setLoginSubmitting(false);
    if (!success) {
      setLoginError(true);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError(false);
  };

  const handleAddHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodWeight) return;
    
    setProdStatusMsg(locale === 'es' ? 'Registrando lote...' : 'Registering lot...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/portal/harvest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product: prodProduct,
          weight_kg: parseFloat(prodWeight),
          proposed_price_pen_kg: prodPricePen ? parseFloat(prodPricePen) : null,
          location: prodLocation || 'No especificada'
        })
      });
      
      if (res.ok) {
        setProdStatusMsg(locale === 'es' ? 'Lote registrado. Wari Trading revisará y negociará el precio contigo.' : 'Lot registered. Wari Trading will review and negotiate the price with you.');
        await fetchPortalData();
        setProdWeight('');
        setProdPricePen('');
        setProdLocation('');
      } else {
        setProdStatusMsg(locale === 'es' ? 'Error al registrar el lote.' : 'Error registering the lot.');
      }
    } catch (err) {
      console.error('Error adding harvest:', err);
      setProdStatusMsg(locale === 'es' ? 'Error de conexión.' : 'Connection error.');
    } finally {
      setTimeout(() => setProdStatusMsg(''), 3500);
    }
  };

  const handleHarvestAction = async (harvestId: number, action: string, price?: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/portal/harvest/${harvestId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          price_pen_kg: price
        })
      });
      if (res.ok) {
        await fetchPortalData();
      }
    } catch (err) {
      console.error('Error performing harvest action:', err);
    }
  };

  const handleHarvestAgreePrice = (harvestId: number, currentProposed: number | null) => {
    setNegotiatingLotId(harvestId);
    setNegotiatingPrice(currentProposed ? currentProposed.toString() : '4.50');
  };

  const handleConfirmAgreePrice = async (harvestId: number) => {
    const price = parseFloat(negotiatingPrice);
    if (isNaN(price) || price <= 0) {
      alert(locale === 'es' ? 'Precio inválido' : 'Invalid price');
      return;
    }
    
    await handleHarvestAction(harvestId, 'agree_price', price);
    setNegotiatingLotId(null);
    setNegotiatingPrice('');
  };

  if (isLoading) {
    return (
      <div className="section-padding bg-slate-50 flex-grow min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-sm italic">{locale === 'es' ? 'Cargando portal...' : 'Loading portal...'}</p>
      </div>
    );
  }

  return (
    <div className="section-padding bg-slate-50 flex-grow min-h-screen">
      <div className="container max-w-5xl">
        
        {/* Back Link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 text-sm font-semibold mb-8 cursor-pointer no-underline"
        >
          <FiArrowLeft />
          {locale === 'es' ? 'Volver a Inicio' : 'Back Home'}
        </Link>

        {/* 1. VISTA DE INICIO DE SESIÓN */}
        {!token ? (
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
            
            {/* Formulario */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl min-w-0">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.portal.loginTitle}</h1>
                <p className="text-xs text-slate-500">{t.portal.subtitle}</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t.contact.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input text-sm"
                    placeholder="usuario@dominio.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {locale === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginSubmitting}
                  className="btn-primary w-full justify-center text-sm cursor-pointer mt-2"
                >
                  {loginSubmitting ? (locale === 'es' ? 'Cargando...' : 'Loading...') : t.portal.loginBtn}
                </button>

                {loginError && (
                  <p className="text-red-500 text-xs font-semibold text-center mt-2">
                    {locale === 'es' ? 'Credenciales incorrectas. Verifique e intente de nuevo.' : 'Incorrect credentials. Please check and try again.'}
                  </p>
                )}
              </form>
            </div>

            {/* Relleno de Credenciales Demo */}
            <div className="space-y-6 min-w-0">
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100/50 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <FiDatabase className="text-emerald-600" />
                  {t.portal.selectRole}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {locale === 'es'
                    ? 'Haga clic en cualquiera de los roles para autocompletar las credenciales correspondientes a la simulación:'
                    : 'Click any of the roles to autofill the corresponding credentials for the simulation:'}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleDemoFill('admin@hallpayaku.com', 'admin123')}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-xl text-left text-xs font-bold text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>{t.portal.adminRole}</span>
                    <span className="text-[10px] text-slate-400">admin@hallpayaku.com</span>
                  </button>

                  <button
                    onClick={() => handleDemoFill('productor@hallpayaku.com', 'productor123')}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-xl text-left text-xs font-bold text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>{t.portal.productorRole}</span>
                    <span className="text-[10px] text-slate-400">productor@hallpayaku.com</span>
                  </button>

                  <button
                    onClick={() => handleDemoFill('comprador@hallpayaku.com', 'comprador123')}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-xl text-left text-xs font-bold text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>{t.portal.compradorRole}</span>
                    <span className="text-[10px] text-slate-400">comprador@hallpayaku.com</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          
          // 2. VISTA DE DASHBOARD OPERATIVO AUTENTICADO
          <div className="space-y-8">
            
            {/* Header de Sesión */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
                  {locale === 'es' ? 'Sesión Activa' : 'Active Session'}
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                  {t.portal.welcome} {locale === 'es' ? user?.name : user?.name_en}
                </h1>
                <div className="flex gap-2 items-center text-xs font-bold text-emerald-700 mt-1">
                  <FiUser size={12} />
                  <span>{locale === 'es' ? 'Rol' : 'Role'}: {user?.role.toUpperCase()}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <FiLogOut />
                {t.portal.logoutBtn}
              </button>
            </div>

            {portalLoading ? (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm italic">
                {locale === 'es' ? 'Cargando datos del panel...' : 'Loading dashboard data...'}
              </div>
            ) : portalData ? (
              <div className="space-y-8">
                
                {/* 2.1 DASHBOARD ROL: ADMINISTRADOR */}
                {user?.role === 'admin' && (
                  <div className="grid md:grid-cols-12 gap-8">
                    
                    {/* Estadísticas de la empresa */}
                    <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {Object.entries(portalData.stats || {}).map(([key, val]: any) => (
                        <div key={key} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="text-lg font-extrabold text-slate-800">
                            {typeof val === 'number' && key.includes('usd') ? `$${val.toLocaleString()}` : val}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Mensajes Recibidos (Inbox) */}
                    <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <FiMail className="text-emerald-600" />
                        {t.portal.adminInbox}
                      </h3>

                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        {portalData.received_contacts && portalData.received_contacts.length > 0 ? (
                          portalData.received_contacts.map((msg: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">{msg.name} ({msg.country})</span>
                                <span className="text-[9px] text-slate-400">{new Date(msg.date_received).toLocaleDateString()}</span>
                              </div>
                              <div className="text-slate-500 font-semibold">{msg.email} | {msg.company || (locale === 'es' ? 'Sin Empresa' : 'No Company')}</div>
                              <div className="bg-white p-2 rounded-lg border border-slate-200">
                                <strong>{t.contact.interest}:</strong> {msg.product_interest}
                                {msg.volume_tons && <span> | <strong>{locale === 'es' ? 'Volumen' : 'Volume'}:</strong> {msg.volume_tons} TM</span>}
                              </div>
                              <p className="text-slate-600 italic">"{msg.message}"</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic py-8 text-center">{t.portal.adminNoInbox}</p>
                        )}
                      </div>
                    </div>

                    {/* Tablero Completo de Demandas B2B (Muestra nombres y correos corporativos!) */}
                    <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <FiDatabase className="text-cyan-600" />
                        {t.portal.adminDemands}
                      </h3>

                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        {portalData.detailed_demands && portalData.detailed_demands.map((d: any) => (
                          <div key={d.id} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-emerald-800">{d.product}</span>
                              <span className="text-[9px] text-slate-400">{d.date_posted}</span>
                            </div>
                            <div className="space-y-1 text-slate-500">
                              <div><strong>{t.portal.compName}:</strong> {d.company_name}</div>
                              <div><strong>{t.portal.compTax}:</strong> {d.company_tax_id}</div>
                              <div><strong>{t.portal.compEmail}:</strong> {d.contact_email}</div>
                              <div><strong>{locale === 'es' ? 'Destino' : 'Destination'}:</strong> {d.destination_port} ({d.quantity_tons} TM)</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gestión de Cosechas y Ofertas de Productores */}
                    <div className="md:col-span-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <FiPackage className="text-emerald-600" />
                        {locale === 'es' ? 'Gestión de Cosechas y Ofertas de Productores' : 'Producer Harvests & Offers Management'}
                      </h3>

                      <div className="overflow-x-auto">
                        {portalData.producer_deliveries && portalData.producer_deliveries.length > 0 ? (
                          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                <th className="pb-3 pt-1 pl-2">{locale === 'es' ? 'Productor / Coop.' : 'Producer / Coop.'}</th>
                                <th className="pb-3 pt-1">{locale === 'es' ? 'Producto' : 'Product'}</th>
                                <th className="pb-3 pt-1">{locale === 'es' ? 'Peso / Ubicación' : 'Weight / Location'}</th>
                                <th className="pb-3 pt-1">{locale === 'es' ? 'Propuesta / Pagado' : 'Proposed / Paid'}</th>
                                <th className="pb-3 pt-1">{locale === 'es' ? 'Estado' : 'Status'}</th>
                                <th className="pb-3 pt-1 pr-2 text-right">{locale === 'es' ? 'Acciones' : 'Actions'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {portalData.producer_deliveries.map((del: any) => {
                                const statusColors: Record<string, string> = {
                                  'Completado': 'bg-emerald-100 text-emerald-800',
                                  'En Negociación': 'bg-amber-100 text-amber-800',
                                  'Precio Acordado': 'bg-cyan-100 text-cyan-800',
                                  'Registrado': 'bg-slate-100 text-slate-600',
                                };
                                const colorClass = statusColors[del.status] || 'bg-slate-100 text-slate-600';
                                const statusLabels: Record<string, string> = {
                                  'Registrado': 'Registered',
                                  'En Negociación': 'Negotiating',
                                  'Precio Acordado': 'Price Agreed',
                                  'Completado': 'Completed'
                                };
                                const statusLabel = locale === 'es' ? del.status : (statusLabels[del.status] || del.status);

                                return (
                                  <tr key={del.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 pl-2 font-bold text-slate-800 truncate max-w-[160px]">
                                      <div className="truncate max-w-[160px]">{del.producer_name}</div>
                                      <div className="text-[10px] text-slate-400 font-normal truncate max-w-[160px]">{del.producer_email}</div>
                                    </td>
                                    <td className="py-3 font-semibold text-emerald-800 truncate max-w-[140px]">{del.product}</td>
                                    <td className="py-3">
                                      <div className="font-bold text-slate-700">{del.weight_kg.toLocaleString()} kg</div>
                                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">📍 {del.location}</div>
                                    </td>
                                    <td className="py-3 font-bold text-slate-800">
                                      {del.price_paid_pen > 0 ? (
                                        <div>
                                          <div className="text-emerald-700 font-extrabold">S/. {del.price_paid_pen.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                          <div className="text-[9px] text-slate-400 font-normal">{locale === 'es' ? 'Acordado' : 'Agreed'}: S/. {del.proposed_price_pen_kg.toFixed(2)}/kg</div>
                                        </div>
                                      ) : del.proposed_price_pen_kg ? (
                                        <span className="text-slate-500">{locale === 'es' ? 'Prop' : 'Prop.'}: S/. {del.proposed_price_pen_kg.toFixed(2)}/kg</span>
                                      ) : (
                                        <span className="text-slate-300">—</span>
                                      )}
                                    </td>
                                    <td className="py-3">
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                                        {statusLabel}
                                      </span>
                                      <div className="text-[9px] text-slate-400 font-normal mt-0.5">{del.date}</div>
                                    </td>
                                    <td className="py-3 pr-2 text-right">
                                      <div className="flex justify-end items-center gap-1.5">
                                        {negotiatingLotId === del.id ? (
                                          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                            <span className="text-[9px] font-bold text-slate-400">S/.</span>
                                            <input
                                              type="number"
                                              step="0.01"
                                              min="0.01"
                                              value={negotiatingPrice}
                                              onChange={(e) => setNegotiatingPrice(e.target.value)}
                                              className="w-14 px-1.5 py-0.5 text-[10px] font-bold border border-slate-300 rounded focus:outline-none focus:border-emerald-500 text-slate-800"
                                              placeholder="0.00"
                                            />
                                            <button
                                              onClick={() => handleConfirmAgreePrice(del.id)}
                                              aria-label={locale === 'es' ? 'Confirmar' : 'Confirm'}
                                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold cursor-pointer transition-colors"
                                            >
                                              ✔
                                            </button>
                                            <button
                                              onClick={() => setNegotiatingLotId(null)}
                                              aria-label={locale === 'es' ? 'Cancelar' : 'Cancel'}
                                              className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-50 rounded text-[9px] font-bold cursor-pointer transition-colors"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex justify-end gap-1.5">
                                            {del.status === 'Registrado' && (
                                              <button
                                                onClick={() => handleHarvestAction(del.id, 'negotiate')}
                                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-bold text-[10px] cursor-pointer transition-colors"
                                              >
                                                {locale === 'es' ? 'Negociar' : 'Negotiate'}
                                              </button>
                                            )}
                                            
                                            {(del.status === 'Registrado' || del.status === 'En Negociación') && (
                                              <button
                                                onClick={() => handleHarvestAgreePrice(del.id, del.proposed_price_pen_kg)}
                                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[10px] cursor-pointer transition-colors"
                                              >
                                                {locale === 'es' ? 'Acordar Precio' : 'Agree Price'}
                                              </button>
                                            )}

                                            {del.status === 'Precio Acordado' && (
                                              <button
                                                onClick={() => handleHarvestAction(del.id, 'complete')}
                                                className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-lg font-bold text-[10px] cursor-pointer transition-colors"
                                              >
                                                {locale === 'es' ? 'Completar' : 'Complete'}
                                              </button>
                                            )}
                                            
                                            {del.status === 'Completado' && (
                                              <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-1">
                                                <FiCheckCircle /> {locale === 'es' ? 'Listo' : 'Done'}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center py-8 text-slate-400 italic text-xs">
                            {locale === 'es' ? 'No hay ofertas de cosecha registradas.' : 'No registered harvest offers.'}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2.2 DASHBOARD ROL: PRODUCTOR */}
                {user?.role === 'productor' && (
                  <div className="grid md:grid-cols-12 gap-8">
                    
                    {/* Detalles de Cooperativa */}
                    <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <FiAward className="text-emerald-600" />
                          {t.portal.prodCoop}
                        </h3>
                        {portalData.cooperative_details && (
                          <div className="space-y-3 text-xs mt-4">
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-semibold">{locale === 'es' ? 'Nombre' : 'Name'}:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[140px]">{portalData.cooperative_details.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-semibold">{locale === 'es' ? 'Ubicación' : 'Location'}:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[140px]">{portalData.cooperative_details.location}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-semibold">{locale === 'es' ? 'Socios Activos' : 'Active Members'}:</span>
                              <span className="font-bold text-slate-800">{portalData.cooperative_details.members}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 font-semibold">{locale === 'es' ? 'Convenio DEVIDA' : 'DEVIDA Agreement'}:</span>
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {locale === 'es' ? 'Activo' : 'Active'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Caja Precios del Productor */}
                      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-xs space-y-2 mt-4">
                        <div className="font-bold text-emerald-900">{locale === 'es' ? 'Precios de Compra del Día' : "Today's Purchase Prices"}:</div>
                        <div className="flex justify-between text-slate-700">
                          <span>{locale === 'es' ? 'Cacao Orgánico (Seco)' : 'Organic Cocoa (Dry)'}:</span>
                          <span className="font-extrabold">S/. {portalData.price_history_reference.cacao_premium_pen_kg.toFixed(2)} / kg</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>{locale === 'es' ? 'Café Pergamino Especial' : 'Special Parchment Coffee'}:</span>
                          <span className="font-extrabold">S/. {portalData.price_history_reference.cacao_base_pen_kg.toFixed(2)} / kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Entregas y Registro */}
                    <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      
                      {/* Registro de Cosecha / Venta */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5 mb-1">
                          <FiPlus className="text-cyan-600" />
                          {t.portal.prodAddLot}
                        </h3>
                        <p className="text-[10px] text-slate-400 mb-4">
                          {locale === 'es'
                            ? 'Registra el stock disponible para venta. Wari Trading revisará tu oferta y negociará el precio final contigo directamente.'
                            : 'Register the stock available for sale. Wari Trading will review your offer and negotiate the final price directly with you.'}
                        </p>

                        {prodStatusMsg ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2 text-emerald-800">
                            <FiCheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                            <p className="text-xs font-bold">{prodStatusMsg}</p>
                          </div>
                        ) : (
                          <form onSubmit={handleAddHarvest} className="space-y-3">
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                  {t.portal.prodFormProduct}
                                </label>
                                <select value={prodProduct} onChange={(e) => setProdProduct(e.target.value)} className="form-input text-xs cursor-pointer">
                                  <option value="Palta Hass">Palta Hass</option>
                                  <option value="Cacao Orgánico">Cacao Criollo Fino</option>
                                  <option value="Café Especial">Café Pergamino Especial</option>
                                  <option value="Mango Kent">Mango Kent</option>
                                  <option value="Espárrago Verde">Espárrago Verde</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                  {t.portal.prodFormWeight} (kg) *
                                </label>
                                <input type="number" required min="1" value={prodWeight} onChange={(e) => setProdWeight(e.target.value)} className="form-input text-xs" placeholder="Ej: 500" />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                  {locale === 'es' ? 'Precio propuesto (S/./kg)' : 'Proposed price (S/./kg)'}
                                </label>
                                <input type="number" step="0.01" min="0.01" value={prodPricePen} onChange={(e) => setProdPricePen(e.target.value)} className="form-input text-xs" placeholder="Ej: 4.20 (opcional)" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                  {locale === 'es' ? 'Ubicación del producto' : 'Product location'}
                                </label>
                                <input type="text" value={prodLocation} onChange={(e) => setProdLocation(e.target.value)} className="form-input text-xs" placeholder="Ej: Satipo, Junín" />
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">
                              {locale === 'es'
                                ? 'El precio indicado es una propuesta. Wari Trading negociará el precio final antes de confirmar el acuerdo de compra.'
                                : 'The indicated price is a proposal. Wari Trading will negotiate the final price before confirming the purchase agreement.'}
                            </p>
                            <button type="submit" className="btn-primary !text-xs !py-2.5 !px-5 cursor-pointer flex items-center gap-1.5">
                              <FiPlus size={13} />
                              {t.portal.submitHarvest}
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Lista de Entregas con pipeline de estado */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5 mb-4">
                          <FiPackage className="text-slate-600" />
                          {t.portal.prodDeliveries}
                        </h3>

                        {/* Pipeline visual */}
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-4 overflow-x-auto pb-1">
                          {['Registrado', 'En Negociación', 'Precio Acordado', 'Completado'].map((stage, i) => {
                            const stageLabels: Record<string, string> = {
                              'Registrado': 'Registered',
                              'En Negociación': 'Negotiating',
                              'Precio Acordado': 'Price Agreed',
                              'Completado': 'Completed'
                            };
                            return (
                              <React.Fragment key={stage}>
                                <span className="whitespace-nowrap bg-slate-100 px-2 py-1 rounded-full">
                                  {locale === 'es' ? stage : stageLabels[stage]}
                                </span>
                                {i < 3 && <span className="text-slate-300">→</span>}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        <div className="space-y-3 max-h-[240px] overflow-y-auto">
                          {portalData.your_deliveries && portalData.your_deliveries.map((del: any, idx: number) => {
                            const statusColors: Record<string, string> = {
                              'Completado': 'bg-emerald-100 text-emerald-800',
                              'En Negociación': 'bg-amber-100 text-amber-800',
                              'Precio Acordado': 'bg-cyan-100 text-cyan-800',
                              'Registrado': 'bg-slate-100 text-slate-600',
                            };
                            const colorClass = statusColors[del.status] || 'bg-slate-100 text-slate-600';
                            const statusLabels: Record<string, string> = {
                              'Registrado': 'Registered',
                              'En Negociación': 'Negotiating',
                              'Precio Acordado': 'Price Agreed',
                              'Completado': 'Completed'
                            };
                            const statusLabel = locale === 'es' ? del.status : (statusLabels[del.status] || del.status);
                            return (
                              <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-800 truncate max-w-[160px]">{del.product}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{del.date} • {del.weight_kg.toLocaleString()} kg</div>
                                    {del.location && <div className="text-[10px] text-slate-400 truncate max-w-[160px]">📍 {del.location}</div>}
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    {del.price_paid_pen > 0 ? (
                                      <div className="font-extrabold text-slate-900">S/. {del.price_paid_pen.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    ) : del.proposed_price_pen_kg ? (
                                      <div className="text-slate-400 text-[10px]">{locale === 'es' ? 'Prop' : 'Prop.'}: S/. {del.proposed_price_pen_kg.toFixed(2)}/kg</div>
                                    ) : (
                                      <div className="text-slate-300 text-[10px]">—</div>
                                    )}
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${colorClass}`}>
                                      {statusLabel}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* 2.3 DASHBOARD ROL: COMPRADOR */}
                {user?.role === 'comprador' && (
                  <div className="grid md:grid-cols-12 gap-8">
                    
                    {/* Trazabilidad en tiempo real de embarques */}
                    <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <FiPackage className="text-emerald-600" />
                        {t.portal.compLogistics}
                      </h3>

                      <div className="space-y-4">
                        {portalData.logistics_status && portalData.logistics_status.map((item: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs space-y-3">
                            <div className="flex justify-between items-center gap-2">
                              <span className="font-bold text-slate-800 truncate max-w-[160px]">{locale === 'es' ? 'Lote' : 'Lot'}: {item.lot_code}</span>
                              <span className="bg-cyan-100 text-cyan-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                {item.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-slate-500">
                              <div className="truncate max-w-full"><strong>{locale === 'es' ? 'Producto' : 'Product'}:</strong> {item.product}</div>
                              <div className="truncate max-w-full"><strong>{locale === 'es' ? 'Puerto Destino' : 'Destination Port'}:</strong> {item.destination}</div>
                              <div className="text-emerald-600"><strong>{t.portal.compEta}:</strong> {item.eta}</div>
                            </div>
                            <div className="pt-2 border-t border-slate-200">
                              <Link
                                href={`/${locale}/traceability?code=${item.lot_code}`}
                                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 no-underline"
                              >
                                {locale === 'es' ? 'Ver Ficha de Trazabilidad Completa →' : 'View Full Traceability Sheet →'}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requerimientos del Comprador */}
                    <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <FiGlobe className="text-cyan-600" />
                        {t.portal.compMyActive}
                      </h3>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {portalData.my_active_requests && portalData.my_active_requests.length > 0 ? (
                          portalData.my_active_requests.map((req: any) => (
                            <div key={req.id} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs flex justify-between items-center">
                              <div>
                                <div className="font-bold text-slate-800">{locale === 'es' ? req.product : req.product_en}</div>
                                <div className="text-slate-400 mt-0.5">{req.quantity_tons} TM • Puerto: {locale === 'es' ? req.destination_port : req.destination_port_en}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-emerald-700">{req.target_price}</div>
                                <div className="text-[9px] text-slate-400 mt-1">{req.date_posted}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="space-y-3 py-8 text-center">
                            <p className="text-xs text-slate-500 italic">{t.portal.noDemands}</p>
                            <Link
                              href={`/${locale}/demand-board`}
                              className="btn-primary !text-xs !py-2 !px-4 inline-flex no-underline"
                            >
                              {locale === 'es' ? 'Registrar Nueva Demanda' : 'Register New Requirement'}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <p className="text-xs text-red-500">{locale === 'es' ? 'Error al cargar datos. Cierre sesión e intente de nuevo.' : 'Error loading data. Log out and try again.'}</p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
