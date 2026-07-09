'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';

export const ContactForm: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';
  const t = translations[locale].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    product_interest: '',
    volume_tons: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const payload = {
        ...formData,
        volume_tons: formData.volume_tons ? parseFloat(formData.volume_tons) : null
      };

      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          country: '',
          product_interest: '',
          volume_tons: '',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div id="contact" className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{t.title}</h3>
        <p className="text-xs sm:text-sm text-slate-500">{t.subtitle}</p>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-center flex flex-col items-center justify-center gap-3">
          <FiCheckCircle size={40} className="text-emerald-500 animate-bounce" />
          <p className="font-bold">{t.success}</p>
          <button
            onClick={() => setStatus('idle')}
            className="btn-primary !text-xs !py-2 !px-4 mt-2 cursor-pointer"
          >
            Volver a Enviar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t.name} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input text-sm"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t.email} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Empresa */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t.company}
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="form-input text-sm"
              />
            </div>
            {/* País */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t.country} *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="form-input text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Producto Interés */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t.interest} *
              </label>
              <select
                required
                value={formData.product_interest}
                onChange={(e) => setFormData({ ...formData, product_interest: e.target.value })}
                className="form-input text-sm cursor-pointer"
              >
                <option value="">{t.interestPlaceholder}</option>
                <option value="Palta Hass">Palta Hass (Avocado)</option>
                <option value="Cacao Orgánico">Cacao Criollo Fino (Cocoa)</option>
                <option value="Mango Kent">Mango Kent</option>
                <option value="Higos Frescos">Higos Frescos (Figs)</option>
                <option value="Espárrago Verde">Espárrago Verde (Asparagus)</option>
                <option value="Legumbres">Legumbres / Judías (Beans)</option>
              </select>
            </div>
            {/* Volumen */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t.volume}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.volume_tons}
                onChange={(e) => setFormData({ ...formData, volume_tons: e.target.value })}
                className="form-input text-sm"
                placeholder="Ej: 15.5"
              />
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t.message} *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="form-input text-sm resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-primary w-full justify-center cursor-pointer"
            >
              {status === 'submitting' ? 'Enviando...' : t.submit}
              <FiSend />
            </button>
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-xs font-semibold text-center mt-2 animate-pulse">
              Hubo un error al enviar el formulario. Intente de nuevo.
            </p>
          )}
        </form>
      )}
    </div>
  );
};
