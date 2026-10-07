'use client';

import React, { useState } from 'react';
import { translations, type Locale } from '@/locales/translations';
import type { NeedKey } from '@/locales/pages';
import { company, emailFor } from '@/lib/company';
import { FiSend, FiCheckCircle, FiMail, FiPackage, FiTool, FiTag, FiShield } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { API_BASE_URL } from '@/lib/config';

const NEED_ICONS: Record<NeedKey, React.ComponentType<{ size?: number; className?: string }>> = {
  grain: FiPackage,
  processing: FiTool,
  brand: FiTag,
  eudr: FiShield,
};
const NEEDS = Object.keys(NEED_ICONS) as NeedKey[];

const EMPTY = {
  name: '', email: '', phone: '', company: '', country: '',
  product: '', volume: '', when: '', incoterm: '',
  ownGrain: '', frequency: '', members: '', region: '', message: '',
};

/**
 * Formulario de cotización por necesidad: primero "¿qué necesitas?" y luego
 * solo los campos de ese caso. El backend (/api/contact) recibe el mismo
 * payload de siempre; los campos específicos van etiquetados en `message`.
 */
export const ContactForm: React.FC<{
  locale: Locale;
  initialNeed?: NeedKey;
  title?: string;
  subtitle?: string;
  /** Oculta el título cuando la página ya lo muestra (p. ej. /quote). */
  hideHeading?: boolean;
}> = ({ locale, initialNeed, title, subtitle, hideHeading }) => {
  const t = translations[locale].contact;

  const [need, setNeed] = useState<NeedKey | null>(initialNeed ?? null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Grano se cotiza en TM; maquila y marca en kg (lotes desde 5–25 kg).
  const volumeInKg = need === 'processing' || need === 'brand';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!need) return;
    setStatus('submitting');

    const details: [string, string][] = [
      [t.needLabel, t.needs[need]],
      [t.phone, form.phone],
      [t.product, form.product],
      [volumeInKg ? t.volumeKg : t.volumeTm, form.volume],
      [t.incoterm, form.incoterm],
      [t.ownGrain, form.ownGrain],
      [t.frequency, form.frequency],
      [t.members, form.members],
      [t.region, form.region],
      [t.when, form.when],
    ];
    const header = details.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
    const volume = parseFloat(form.volume);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || null,
          country: form.country,
          product_interest: form.product ? `${t.needs[need]} · ${form.product}` : t.needs[need],
          volume_tons: Number.isFinite(volume) ? (volumeInKg ? volume / 1000 : volume) : null,
          message: form.message ? `${header}\n\n${form.message}` : header,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm(EMPTY);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const waHref = company.whatsapp
    ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
        locale === 'es'
          ? `Hola ${company.name}, quiero cotizar${need ? `: ${t.needs[need]}` : ''}.`
          : `Hi ${company.name}, I'd like a quote${need ? `: ${t.needs[need]}` : ''}.`,
      )}`
    : null;

  const productOptions = need && need !== 'eudr' ? t.products[need] : null;

  return (
    <div id="contact" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto scroll-mt-28 w-full">
      {!hideHeading && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{title ?? t.title}</h2>
          <p className="text-sm text-slate-500">{subtitle ?? t.subtitle}</p>
        </div>
      )}

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-center flex flex-col items-center gap-3">
          <FiCheckCircle size={40} className="text-emerald-500" />
          <p className="font-bold">{t.success}</p>
          <button onClick={() => setStatus('idle')} className="btn-primary !text-xs !py-2 !px-4 mt-2 cursor-pointer">{t.again}</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.needLabel}</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {NEEDS.map((k) => {
                const Icon = NEED_ICONS[k];
                const active = need === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => { setNeed(k); set('product', ''); }}
                    aria-pressed={active}
                    className={`flex items-center gap-2.5 text-left rounded-xl border px-3.5 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                      active ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-emerald-600 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
                    {t.needs[k]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {need && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={`${t.name} *`}><input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className="form-input text-sm" /></Field>
                <Field label={`${t.email} *`}><input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="form-input text-sm" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={need === 'eudr' ? `${t.organization} *` : t.company}>
                  <input type="text" required={need === 'eudr'} value={form.company} onChange={(e) => set('company', e.target.value)} className="form-input text-sm" />
                </Field>
                <Field label={t.phone}><input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="form-input text-sm" /></Field>
              </div>

              {productOptions && (
                <Field label={`${t.product} *`}>
                  <select required value={form.product} onChange={(e) => set('product', e.target.value)} className="form-input text-sm cursor-pointer">
                    <option value="">{t.productPlaceholder}</option>
                    {productOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              )}

              {need === 'grain' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t.volumeTm}><input type="number" step="0.1" min="0.1" value={form.volume} onChange={(e) => set('volume', e.target.value)} className="form-input text-sm" placeholder="15" /></Field>
                  <Field label={t.incoterm}><input type="text" value={form.incoterm} onChange={(e) => set('incoterm', e.target.value)} className="form-input text-sm" placeholder="EXW Ayacucho, FOB Callao..." /></Field>
                </div>
              )}

              {(need === 'processing' || need === 'brand') && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t.volumeKg}><input type="number" step="1" min="1" value={form.volume} onChange={(e) => set('volume', e.target.value)} className="form-input text-sm" placeholder="50" /></Field>
                  <Field label={t.frequency}>
                    <select value={form.frequency} onChange={(e) => set('frequency', e.target.value)} className="form-input text-sm cursor-pointer">
                      <option value="">{t.productPlaceholder}</option>
                      {t.frequencies.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>
              )}

              {need === 'processing' && (
                <Field label={t.ownGrain}>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {[t.ownGrainYes, t.ownGrainNo].map((o) => (
                      <label key={o} className={`flex-1 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm cursor-pointer ${form.ownGrain === o ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                        <input type="radio" name="ownGrain" value={o} checked={form.ownGrain === o} onChange={(e) => set('ownGrain', e.target.value)} className="accent-emerald-600" />
                        {o}
                      </label>
                    ))}
                  </div>
                </Field>
              )}

              {need === 'eudr' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t.members}><input type="number" min="1" value={form.members} onChange={(e) => set('members', e.target.value)} className="form-input text-sm" placeholder="500" /></Field>
                  <Field label={t.region}><input type="text" value={form.region} onChange={(e) => set('region', e.target.value)} className="form-input text-sm" placeholder="Pichari, La Convención..." /></Field>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={`${t.country} *`}><input type="text" required value={form.country} onChange={(e) => set('country', e.target.value)} className="form-input text-sm" placeholder={locale === 'es' ? 'Perú' : 'Germany'} /></Field>
                <Field label={t.when}><input type="text" value={form.when} onChange={(e) => set('when', e.target.value)} className="form-input text-sm" placeholder={locale === 'es' ? 'Ej. noviembre' : 'e.g. November'} /></Field>
              </div>

              <Field label={t.messageOptional}><textarea rows={3} value={form.message} onChange={(e) => set('message', e.target.value)} className="form-input text-sm resize-none" /></Field>

              <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center cursor-pointer">
                {status === 'submitting' ? t.submitting : t.submit}
                <FiSend />
              </button>

              {status === 'error' && <p className="text-red-500 text-xs font-semibold text-center">{t.error}</p>}
            </>
          )}

          <div className="flex flex-col items-center gap-2 pt-1">
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-semibold text-[#1da851] hover:underline">
                <FaWhatsapp size={16} /> {t.whatsapp}
              </a>
            )}
            <a href={`mailto:${emailFor(locale)}`} className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 no-underline">
              <FiMail size={13} /> {emailFor(locale)}
            </a>
          </div>
        </form>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    {children}
  </div>
);
