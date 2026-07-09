'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { useAuth } from '@/context/AuthContext';
import { 
  FiArrowLeft, FiPlus, FiLock, FiCheckCircle, FiShield, 
  FiFileText, FiSend, FiX, FiPackage
} from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';

interface Demand {
  id: number;
  country: string;
  country_code: string;
  product: string;
  product_en: string;
  quantity_tons: number;
  target_price: string;
  destination_port: string;
  destination_port_en: string;
  date_posted: string;
  is_verified: boolean;
}

export default function DemandBoardPage() {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale];
  const { user, token } = useAuth();

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    company_name: '', company_tax_id: '', contact_email: '',
    country: '', country_code: '', product: '', product_en: '',
    quantity_tons: '', target_price: '', destination_port: '', destination_port_en: ''
  });

  // Offer state per demand card
  const [applyingTo, setApplyingTo] = useState<number | null>(null);
  const [offerData, setOfferData] = useState({ stock_kg: '', price_pen_kg: '', location: '' });
  const [offerStatus, setOfferStatus] = useState<Record<number, 'submitting' | 'sent'>>({});

  const fetchDemands = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/demands`);
      if (res.ok) setDemands(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDemands(); }, []);

  const handleCreateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const payload = { ...formData, quantity_tons: parseFloat(formData.quantity_tons) };
      const res = await fetch(`${API_BASE_URL}/api/demands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setFormStatus('success');
        fetchDemands();
        setFormData({ company_name: '', company_tax_id: '', contact_email: '', country: '', country_code: '', product: '', product_en: '', quantity_tons: '', target_price: '', destination_port: '', destination_port_en: '' });
      } else { setFormStatus('error'); }
    } catch (err) { console.error(err); setFormStatus('error'); }
  };

  const handleSubmitOffer = (demandId: number) => {
    if (!offerData.stock_kg || !offerData.price_pen_kg) return;
    setOfferStatus(prev => ({ ...prev, [demandId]: 'submitting' }));
    setTimeout(() => {
      setOfferStatus(prev => ({ ...prev, [demandId]: 'sent' }));
      setApplyingTo(null);
      setOfferData({ stock_kg: '', price_pen_kg: '', location: '' });
    }, 900);
  };

  return (
    <div className="section-padding bg-slate-50 flex-grow min-h-screen">
      <div className="container max-w-5xl">

        <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 text-sm font-semibold mb-8 cursor-pointer no-underline">
          <FiArrowLeft /> {locale === 'es' ? 'Volver a Inicio' : 'Back Home'}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t.demands.title}</h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">{t.demands.subtitle}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-1.5 self-start cursor-pointer shadow-md">
            <FiPlus /> {t.demands.postCta}
          </button>
        </div>

        {/* Contextual banner for producers */}
        {user?.role === 'productor' && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-3">
            <FiPackage className="text-emerald-600 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-sm font-bold text-emerald-900">
                {locale === 'es' ? '¡Encuentra compradores para tu cosecha!' : 'Find buyers for your harvest!'}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                {locale === 'es'
                  ? 'Pulsa "Quiero Proveer" en cualquier requerimiento, indica tu stock y precio propuesto. Wari Trading negociará el precio final contigo.'
                  : 'Click "I Want to Supply" on any requirement, enter your stock and proposed price. Wari Trading will negotiate the final price with you.'}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-40 flex items-center justify-center text-slate-500 text-sm italic">{locale === 'es' ? 'Cargando tablero...' : 'Loading board...'}</div>
        ) : demands.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {demands.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-all duration-300 flex flex-col gap-4">
                
                <div className="flex justify-between items-start gap-2">
                  <span className="font-headings font-extrabold text-sm text-slate-950 truncate max-w-[60%]">{t.demands.anonymous} {d.country}</span>
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                    <FiShield size={10} /> {t.demands.verified}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-emerald-800 -mt-2 truncate">{locale === 'es' ? d.product : d.product_en}</h3>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-slate-400 font-medium mb-0.5">{t.demands.quantity}</div>
                    <div className="font-bold text-slate-800">{d.quantity_tons} TM</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium mb-0.5">{t.demands.targetPrice}</div>
                    <div className="font-bold text-slate-800">{d.target_price}</div>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <div className="text-slate-400 font-medium mb-0.5">{t.demands.destination}</div>
                    <div className="font-bold text-slate-800 truncate">{locale === 'es' ? d.destination_port : d.destination_port_en}</div>
                  </div>
                </div>

                {/* === PRODUCTOR: QUIERO PROVEER FLOW === */}
                {user?.role === 'productor' && (
                  <div className="border-t border-slate-100 pt-3">
                    {offerStatus[d.id] === 'sent' ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-2">
                        <FiCheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={15} />
                        <div>
                          <p className="text-xs font-bold text-emerald-900">{locale === 'es' ? '¡Oferta enviada!' : 'Offer sent!'}</p>
                          <p className="text-[10px] text-emerald-700 mt-0.5">
                            {locale === 'es'
                              ? 'El equipo Wari Trading te contactará para negociar el precio final.'
                              : 'The Wari Trading team will contact you to negotiate the final price.'}
                          </p>
                        </div>
                      </div>
                    ) : applyingTo === d.id ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-800">
                            {locale === 'es' ? 'Tu oferta de suministro' : 'Your supply offer'}
                          </p>
                          <button onClick={() => setApplyingTo(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <FiX size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{locale === 'es' ? 'Stock (kg)' : 'Stock (kg)'}</label>
                            <input type="number" min="1" required value={offerData.stock_kg}
                              onChange={(e) => setOfferData({ ...offerData, stock_kg: e.target.value })}
                              className="form-input text-xs" placeholder="Ej: 2500" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{locale === 'es' ? 'Precio (S/./kg)' : 'Price (S/./kg)'}</label>
                            <input type="number" step="0.01" min="0.01" required value={offerData.price_pen_kg}
                              onChange={(e) => setOfferData({ ...offerData, price_pen_kg: e.target.value })}
                              className="form-input text-xs" placeholder="Ej: 4.20" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{locale === 'es' ? 'Ubicación del producto' : 'Product location'}</label>
                          <input type="text" value={offerData.location}
                            onChange={(e) => setOfferData({ ...offerData, location: e.target.value })}
                            className="form-input text-xs" placeholder="Ej: Satipo, Junín" />
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                          {locale === 'es'
                            ? 'El precio es una propuesta. Wari Trading negociará el precio final antes de confirmar.'
                            : 'The price is a proposal. Wari Trading will negotiate the final price before confirming.'}
                        </p>
                        <button
                          onClick={() => handleSubmitOffer(d.id)}
                          disabled={offerStatus[d.id] === 'submitting' || !offerData.stock_kg || !offerData.price_pen_kg}
                          className="btn-primary !text-xs !py-2 !px-4 w-full justify-center cursor-pointer flex items-center gap-1.5"
                        >
                          <FiSend size={12} />
                          {offerStatus[d.id] === 'submitting' ? (locale === 'es' ? 'Enviando...' : 'Sending...') : (locale === 'es' ? 'Enviar Oferta a Wari Trading' : 'Send Offer to Wari Trading')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setApplyingTo(d.id); setOfferData({ stock_kg: '', price_pen_kg: '', location: '' }); }}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        <FiSend size={13} />
                        {locale === 'es' ? 'Quiero Proveer este Lote' : 'I Want to Supply this Lot'}
                      </button>
                    )}
                  </div>
                )}

                {/* Not logged in prompt */}
                {!user && (
                  <div className="border-t border-slate-100 pt-3">
                    <Link href={`/${locale}/portal`}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors no-underline">
                      <FiLock size={13} />
                      {locale === 'es' ? 'Ingresar para Proveer o Comprar' : 'Log in to Supply or Buy'}
                    </Link>
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-100 pt-3 -mb-1">
                  <span>ID: HY-DEM-{d.id.toString().padStart(3, '0')}</span>
                  <span>{t.demands.date}: {d.date_posted}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 text-slate-500 italic text-sm">
            {locale === 'es' ? 'No hay demandas activas en este momento.' : 'There are no active requirements at this time.'}
          </div>
        )}

        {/* Modal Publicar Requerimiento */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
              <button onClick={() => { setShowModal(false); setFormStatus('idle'); }}
                aria-label={locale === 'es' ? 'Cerrar' : 'Close'}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-lg cursor-pointer">✕</button>

              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <FiFileText className="text-emerald-600" /> {t.demands.postTitle}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {locale === 'es'
                  ? 'Complete el formulario. Los detalles confidenciales no se publicarán en el listado general.'
                  : 'Complete the form. Confidential details will not be published in the general listing.'}
              </p>

              {!token || (user?.role !== 'comprador' && user?.role !== 'admin') ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 text-center flex flex-col items-center gap-3">
                  <FiLock size={36} className="text-amber-500" />
                  <p className="font-bold text-sm">{t.demands.loginRequired}</p>
                  <p className="text-xs text-amber-700">
                    {locale === 'es' ? 'Inicie sesión como Comprador' : 'Log in as a Buyer'}: <strong>comprador@hallpayaku.com</strong> / <strong>comprador123</strong>
                  </p>
                  <Link href={`/${locale}/portal`} onClick={() => setShowModal(false)}
                    className="btn-primary !bg-amber-600 hover:!bg-amber-700 !text-xs !py-2 !px-4 mt-2 no-underline">
                    {locale === 'es' ? 'Ir al Portal' : 'Go to Portal'}
                  </Link>
                </div>
              ) : formStatus === 'success' ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-center flex flex-col items-center gap-3">
                  <FiCheckCircle size={40} className="text-emerald-500" />
                  <p className="font-bold">{t.demands.successMsg}</p>
                  <button onClick={() => { setFormStatus('idle'); setShowModal(false); }} className="btn-primary !text-xs !py-2 !px-4 mt-2 cursor-pointer">
                    {locale === 'es' ? 'Cerrar Ventana' : 'Close Window'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateDemand} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formCompany} *</label>
                      <input type="text" required value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="form-input text-xs" placeholder="Ej: AgroImport Ltd" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formTax} *</label>
                      <input type="text" required value={formData.company_tax_id} onChange={(e) => setFormData({ ...formData, company_tax_id: e.target.value })} className="form-input text-xs" placeholder="Ej: DE987654321" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formEmail} *</label>
                      <input type="email" required value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="form-input text-xs" placeholder="Ej: sourcing@agroimport.de" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formCountry} *</label>
                      <input type="text" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value, country_code: e.target.value.substring(0,2).toUpperCase() })} className="form-input text-xs" placeholder="Ej: Alemania" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formProduct} *</label>
                      <input type="text" required value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="form-input text-xs" placeholder="Ej: Palta Hass fresca" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formProductEn} *</label>
                      <input type="text" required value={formData.product_en} onChange={(e) => setFormData({ ...formData, product_en: e.target.value })} className="form-input text-xs" placeholder="Ej: Fresh Hass Avocado" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formQty} *</label>
                      <input type="number" step="0.1" required value={formData.quantity_tons} onChange={(e) => setFormData({ ...formData, quantity_tons: e.target.value })} className="form-input text-xs" placeholder="Ej: 22.0" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formPrice} *</label>
                      <input type="text" required value={formData.target_price} onChange={(e) => setFormData({ ...formData, target_price: e.target.value })} className="form-input text-xs" placeholder="Ej: 2.35 USD/kg" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formPort} *</label>
                      <input type="text" required value={formData.destination_port} onChange={(e) => setFormData({ ...formData, destination_port: e.target.value })} className="form-input text-xs" placeholder="Ej: Puerto de Hamburgo" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{t.demands.formPortEn} *</label>
                      <input type="text" required value={formData.destination_port_en} onChange={(e) => setFormData({ ...formData, destination_port_en: e.target.value })} className="form-input text-xs" placeholder="Ej: Port of Hamburg" />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary !text-xs !py-2 !px-4 cursor-pointer">{locale === 'es' ? 'Cancelar' : 'Cancel'}</button>
                    <button type="submit" disabled={formStatus === 'submitting'} className="btn-primary !text-xs !py-2 !px-4 cursor-pointer">
                      {formStatus === 'submitting' ? (locale === 'es' ? 'Enviando...' : 'Sending...') : t.demands.submit}
                    </button>
                  </div>
                  {formStatus === 'error' && (
                    <p className="text-red-500 text-xs font-semibold text-center mt-2">{locale === 'es' ? 'Error al publicar. Verifique los datos e intente de nuevo.' : 'Error posting. Please check the data and try again.'}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
