'use client';

import React, { useState } from 'react';
import { translations, type Locale } from '@/locales/translations';
import { company, emailFor } from '@/lib/company';
import { FiSend, FiCheckCircle, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { API_BASE_URL } from '@/lib/config';

export const ContactForm: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].contact;

  const [form, setForm] = useState({
    name: '', email: '', company: '', country: '',
    product_interest: '', incoterm: '', volume_tons: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const message = form.incoterm
        ? `[${t.incoterm}: ${form.incoterm}] ${form.message}`
        : form.message;
      const payload = {
        name: form.name,
        email: form.email,
        company: form.company || null,
        country: form.country,
        product_interest: form.product_interest,
        volume_tons: form.volume_tons ? parseFloat(form.volume_tons) : null,
        message,
      };
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', company: '', country: '', product_interest: '', incoterm: '', volume_tons: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const waHref = company.whatsapp
    ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(locale === 'es' ? `Hola ${company.name}, quiero cotizar.` : `Hi ${company.name}, I'd like a quote.`)}`
    : null;

  return (
    <div id="contact" className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl max-w-2xl mx-auto scroll-mt-24">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.title}</h2>
        <p className="text-sm text-slate-500">{t.subtitle}</p>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-center flex flex-col items-center gap-3">
          <FiCheckCircle size={40} className="text-emerald-500" />
          <p className="font-bold">{t.success}</p>
          <button onClick={() => setStatus('idle')} className="btn-primary !text-xs !py-2 !px-4 mt-2 cursor-pointer">{t.again}</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={`${t.name} *`}><input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className="form-input text-sm" /></Field>
            <Field label={`${t.email} *`}><input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="form-input text-sm" /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t.company}><input type="text" value={form.company} onChange={(e) => set('company', e.target.value)} className="form-input text-sm" /></Field>
            <Field label={`${t.country} *`}><input type="text" required value={form.country} onChange={(e) => set('country', e.target.value)} className="form-input text-sm" /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={`${t.interest} *`}>
              <select required value={form.product_interest} onChange={(e) => set('product_interest', e.target.value)} className="form-input text-sm cursor-pointer">
                <option value="">{t.interestPlaceholder}</option>
                {t.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label={t.incoterm}><input type="text" value={form.incoterm} onChange={(e) => set('incoterm', e.target.value)} className="form-input text-sm" placeholder="FOB Callao, EXW..." /></Field>
          </div>
          <Field label={t.volume}><input type="number" step="0.1" min="0.1" value={form.volume_tons} onChange={(e) => set('volume_tons', e.target.value)} className="form-input text-sm" placeholder="15.5" /></Field>
          <Field label={`${t.message} *`}><textarea required rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} className="form-input text-sm resize-none" /></Field>

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center cursor-pointer">
            {status === 'submitting' ? t.submitting : t.submit}
            <FiSend />
          </button>

          {status === 'error' && <p className="text-red-500 text-xs font-semibold text-center">{t.error}</p>}

          <div className="flex flex-col items-center gap-2 pt-1">
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-semibold text-[#25D366] hover:underline">
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
