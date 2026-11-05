'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { translations, type Locale } from '@/locales/translations';
import type { NeedKey } from '@/locales/pages';
import { company, emailFor } from '@/lib/company';
import { media } from '@/lib/media';
import { FiCheck, FiCheckCircle, FiChevronDown, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import {
  TbBuildingCommunity, TbBuildingFactory2, TbCalendar, TbClipboardText, TbHeartHandshake, TbLeaf,
  TbMail, TbMapPin, TbPhone, TbRosetteDiscountCheck, TbSend, TbShieldCheck, TbShoppingCart, TbStack2,
  TbTag, TbTruck, TbUser, TbUsersGroup, TbWorld,
} from 'react-icons/tb';
import { API_BASE_URL } from '@/lib/config';

type IconType = React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

const NEED_ICONS: Record<NeedKey, IconType> = {
  grain: TbShoppingCart,
  processing: TbBuildingFactory2,
  brand: TbTag,
  sell: TbHeartHandshake,
  eudr: TbShieldCheck,
};
const NEEDS = Object.keys(NEED_ICONS) as NeedKey[];
const WHY_ICONS: IconType[] = [TbLeaf, TbRosetteDiscountCheck, TbTruck, TbUsersGroup];

const EMPTY = {
  name: '', email: '', phone: '', company: '', country: '',
  products: [] as string[], otherProduct: '', volume: '', when: '', incoterm: '',
  ownGrain: '', frequency: '', members: '', region: '', message: '',
  grainState: '', commitment: '',
  website: '', // trampa antispam: oculto para personas, los bots lo llenan
};

/** "10 TM" → 10 · "5,000 kg" → 5 · sin unidad usa `defaultKg`. Sin número → null. */
export function parseVolumeTons(raw: string, defaultKg: boolean): number | null {
  const text = raw.trim().toLowerCase();
  const match = text.match(/\d[\d.,]*/);
  if (!match) return null;
  const digits = match[0].replace(/,(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
  const value = parseFloat(digits);
  if (!Number.isFinite(value)) return null;
  const inKg = /\bkg|kilo/.test(text) || (defaultKg && !/\b(tm|mt|t|ton)/.test(text));
  return inKg ? value / 1000 : value;
}

/**
 * Formulario comercial por tipo de solicitud. Solo muestra los campos del caso
 * elegido. El backend (/api/contact) recibe el mismo payload de siempre: los
 * campos específicos van etiquetados en `message`.
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

  const [need, setNeed] = useState<NeedKey>(initialNeed ?? 'grain');
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [productsMissing, setProductsMissing] = useState(false);

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const isSell = need === 'sell';
  // Grano se cotiza en TM; maquila y marca en kg (lotes desde 5–25 kg).
  const volumeInKg = need === 'processing' || need === 'brand';
  const productOptions = need !== 'eudr' ? t.products[need] : null;
  const otherOption = t.products.sell[t.products.sell.length - 1];
  const wantsOther = isSell && form.products.includes(otherOption);
  // Café y cacao son las dos primeras opciones de venta: solo ellos se venden seco o en baba.
  const asksGrainState = isSell && form.products.some((p) => t.products.sell.slice(0, 2).includes(p));
  const showPhone = need !== 'grain';
  const volumeLabel = t.volume.split(' (')[0];

  const selectNeed = (k: NeedKey) => {
    setNeed(k);
    set('products', []);
    setProductsMissing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productOptions && form.products.length === 0) {
      setProductsMissing(true);
      return;
    }
    setStatus('submitting');

    const products = form.products
      .map((p) => (wantsOther && p === otherOption ? form.otherProduct : p))
      .join(', ');
    const details: [string, string][] = [
      [t.needLabel, t.needs[need]],
      [t.phoneRequired, form.phone],
      [t.product, products],
      [volumeLabel, form.volume],
      [t.grainState, form.grainState],
      [t.commitment, form.commitment],
      [t.incoterm, form.incoterm],
      [t.ownGrain, form.ownGrain],
      [t.frequency, form.frequency],
      [t.members, form.members],
      [isSell ? t.regionSell : t.region, form.region],
      [isSell ? t.whenSell : t.when, form.when],
    ];
    const header = details.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          company: form.company || null,
          // Quien vende su producción opera en Perú: no se le pide país.
          country: isSell ? t.countries[0] : form.country,
          product_interest: products ? `${t.needs[need]} · ${products}` : t.needs[need],
          volume_tons: parseVolumeTons(form.volume, volumeInKg),
          message: form.message ? `${header}\n\n${form.message}` : header,
          website: form.website || null,
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
          ? `Hola ${company.name}, quiero hablar sobre: ${t.needs[need]}.`
          : `Hi ${company.name}, I'd like to talk about: ${t.needs[need]}.`,
      )}`
    : null;

  const NeedHeading = hideHeading ? 'h2' : 'h3';

  return (
    <div id="contact" className="mx-auto w-full max-w-[1240px] scroll-mt-28">
      {!hideHeading && (
        <div className="mb-8 text-center">
          <h2 className="font-body! text-3xl font-bold tracking-tight text-wari-navy sm:text-4xl">{title ?? t.title}</h2>
          <p className="mt-2 text-slate-600">{subtitle ?? t.subtitle}</p>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg sm:p-7">
        <NeedHeading className="font-body! mb-5 text-xl font-bold tracking-tight text-wari-navy sm:text-[1.7rem]">{t.needLabelLong}</NeedHeading>
        <fieldset>
          <legend className="sr-only">{t.needLabelLong}</legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {NEEDS.map((k) => {
              const Icon = NEED_ICONS[k];
              const active = need === k;
              const card = t.needCards[k];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => selectNeed(k)}
                  aria-pressed={active}
                  className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors lg:flex-col lg:gap-1 lg:px-3 lg:py-4 lg:text-center ${
                    active ? 'border-wari-deep bg-[#eff7e6]' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {active && (
                    <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-wari-deep text-white">
                      <FiCheck size={13} />
                    </span>
                  )}
                  {k === 'sell' && !active && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-wari-deep px-2 py-0.5 text-[10px] font-bold text-white">{t.newBadge}</span>
                  )}
                  <Icon size={36} strokeWidth={1.5} className="shrink-0 text-wari-deep" />
                  <span>
                    <span className="block font-bold leading-tight text-wari-navy">{card.t}</span>
                    <span className="mt-1 block pr-6 text-xs leading-snug text-slate-600 lg:pr-0">{card.d}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-5 grid gap-6 rounded-3xl border border-slate-200 bg-white p-3 shadow-lg sm:p-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-9">
        <aside className="order-last flex flex-col overflow-hidden rounded-2xl bg-[#f1f7ec] lg:order-first">
          <div className="p-6">
            <h3 className="font-body! mb-5 text-xl font-bold leading-tight tracking-tight text-wari-navy sm:text-2xl">{t.whyTitle}</h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {t.whyItems.map((item, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium leading-snug text-wari-navy">
                    <Icon size={34} strokeWidth={1.5} className="shrink-0 text-wari-deep" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative mt-auto hidden aspect-[292/326] lg:block">
            <Image src={media.CONTACT_PANEL.src} alt={media.CONTACT_PANEL.alt[locale]} fill sizes="300px" className="object-cover" />
          </div>
        </aside>

        <div className="px-2 py-3 sm:px-3 lg:py-5 lg:pr-6">
          {status === 'success' ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-[#f1f7ec] p-8 text-center text-wari-navy">
              <FiCheckCircle size={44} className="text-wari-deep" />
              <p className="text-lg font-bold">{t.success}</p>
              <button onClick={() => setStatus('idle')} className="mt-2 cursor-pointer rounded-full bg-wari-deep px-5 py-2.5 text-sm font-semibold text-white">{t.again}</button>
            </div>
          ) : (
            <>
              <h3 className="font-body! text-2xl font-bold tracking-tight text-wari-navy sm:text-[1.75rem]">
                {t.requestLabel} <span className="text-wari-deep">{t.requests[need].t}</span>
              </h3>
              <p className="mb-6 mt-1 text-slate-700">{t.requests[need].d}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
                </div>

                <Row>
                  <Field label={`${t.name} *`} icon={TbUser}>
                    <input type="text" required autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} className={INPUT} placeholder={locale === 'es' ? 'Tu nombre' : 'Your name'} />
                  </Field>
                  {isSell ? (
                    <Field label={`${t.phoneRequired} *`} icon={TbPhone}>
                      <input type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={INPUT} placeholder="+51 9..." />
                    </Field>
                  ) : (
                    <Field label={`${t.email} *`} icon={TbMail}>
                      <input type="email" required autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={INPUT} placeholder={locale === 'es' ? 'tu@empresa.com' : 'you@company.com'} />
                    </Field>
                  )}
                </Row>

                {isSell ? (
                  <Row>
                    <Field label={t.emailOptional} icon={TbMail}>
                      <input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={`${t.regionSell} *`} icon={TbMapPin}>
                      <input type="text" required value={form.region} onChange={(e) => set('region', e.target.value)} className={INPUT} placeholder={t.regionPlaceholder} />
                    </Field>
                  </Row>
                ) : (
                  <Row>
                    <Field label={need === 'eudr' ? `${t.organization} *` : t.company} icon={TbBuildingCommunity}>
                      <input type="text" required={need === 'eudr'} autoComplete="organization" value={form.company} onChange={(e) => set('company', e.target.value)} className={INPUT} placeholder={locale === 'es' ? 'Nombre de tu empresa' : 'Your company name'} />
                    </Field>
                    <Field label={`${t.country} *`} icon={TbWorld}>
                      <Select required value={form.country} onChange={(v) => set('country', v)} placeholder={t.selectCountry} options={t.countries} />
                    </Field>
                  </Row>
                )}

                {showPhone && !isSell && (
                  <Field label={t.phone} icon={TbPhone}>
                    <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={INPUT} />
                  </Field>
                )}

                {productOptions && (
                  <div className="grid gap-4 sm:grid-cols-[1.45fr_1fr]">
                    <div>
                      <FieldLabel>{`${isSell ? t.productsSell : t.productsLabel} *`}</FieldLabel>
                      <ProductPicker
                        options={productOptions}
                        selected={form.products}
                        placeholder={t.productsPlaceholder}
                        onChange={(next) => { set('products', next); setProductsMissing(false); }}
                      />
                      {productsMissing && <p role="alert" className="mt-1.5 text-xs font-semibold text-red-600">{t.productsError}</p>}
                    </div>
                    <Field label={need === 'grain' || isSell ? `${volumeLabel} *` : volumeLabel} icon={TbStack2}>
                      <input type="text" required={need === 'grain' || isSell} value={form.volume} onChange={(e) => set('volume', e.target.value)} className={INPUT} placeholder={t.volumePlaceholder} />
                    </Field>
                  </div>
                )}

                {wantsOther && (
                  <Field label={`${t.otherProduct} *`} icon={TbTag}>
                    <input type="text" required value={form.otherProduct} onChange={(e) => set('otherProduct', e.target.value)} className={INPUT} placeholder={t.otherPlaceholder} />
                  </Field>
                )}

                {isSell && (
                  <Row>
                    {asksGrainState && (
                      <Field label={t.grainState} icon={TbLeaf}>
                        <Select value={form.grainState} onChange={(v) => set('grainState', v)} placeholder={t.productPlaceholder} options={t.grainStates} />
                      </Field>
                    )}
                    <Field label={t.commitment} icon={TbHeartHandshake}>
                      <Select value={form.commitment} onChange={(v) => set('commitment', v)} placeholder={t.productPlaceholder} options={[t.commitmentYes, t.commitmentNo]} />
                    </Field>
                  </Row>
                )}

                {need === 'grain' && (
                  <Row>
                    <Field label={t.incoterm} icon={TbTruck}>
                      <Select value={form.incoterm} onChange={(v) => set('incoterm', v)} placeholder={t.incotermPlaceholder} options={t.incoterms} />
                    </Field>
                    <Field label={t.when} icon={TbCalendar}>
                      <input type="text" value={form.when} onChange={(e) => set('when', e.target.value)} className={INPUT} placeholder={t.whenPlaceholder} />
                    </Field>
                  </Row>
                )}

                {(need === 'processing' || need === 'brand') && (
                  <Row>
                    <Field label={t.frequency} icon={TbCalendar}>
                      <Select value={form.frequency} onChange={(v) => set('frequency', v)} placeholder={t.productPlaceholder} options={t.frequencies} />
                    </Field>
                    <Field label={t.when} icon={TbCalendar}>
                      <input type="text" value={form.when} onChange={(e) => set('when', e.target.value)} className={INPUT} placeholder={t.whenPlaceholder} />
                    </Field>
                  </Row>
                )}

                {need === 'processing' && (
                  <div>
                    <FieldLabel>{t.ownGrain}</FieldLabel>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {[t.ownGrainYes, t.ownGrainNo].map((o) => (
                        <label key={o} className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${form.ownGrain === o ? 'border-wari-deep bg-[#eff7e6]' : 'border-slate-200'}`}>
                          <input type="radio" name="ownGrain" value={o} checked={form.ownGrain === o} onChange={(e) => set('ownGrain', e.target.value)} className="accent-[#12690f]" />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {need === 'eudr' && (
                  <Row>
                    <Field label={t.members} icon={TbUsersGroup}>
                      <input type="number" min="1" value={form.members} onChange={(e) => set('members', e.target.value)} className={INPUT} placeholder="500" />
                    </Field>
                    <Field label={t.region} icon={TbMapPin}>
                      <input type="text" value={form.region} onChange={(e) => set('region', e.target.value)} className={INPUT} placeholder="Pichari, La Convención..." />
                    </Field>
                  </Row>
                )}

                {isSell && (
                  <Field label={t.whenSell} icon={TbCalendar}>
                    <input type="text" value={form.when} onChange={(e) => set('when', e.target.value)} className={INPUT} placeholder={t.whenSellPlaceholder} />
                  </Field>
                )}

                <div>
                  <FieldLabel>{t.detailLabel}</FieldLabel>
                  <div className="relative">
                    <TbClipboardText size={20} strokeWidth={1.5} className="pointer-events-none absolute left-3.5 top-3 text-slate-500" />
                    <textarea rows={3} value={form.message} onChange={(e) => set('message', e.target.value)} className="form-input resize-none pl-11! text-sm" placeholder={t.detailPlaceholder} />
                  </div>
                </div>

                {isSell && <p className="text-xs leading-relaxed text-slate-600">{t.sellNote}</p>}

                <button type="submit" disabled={status === 'submitting'} className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-wari-deep px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#0e5a0c] disabled:opacity-70">
                  <TbSend size={24} strokeWidth={1.6} />
                  {status === 'submitting' ? t.submitting : t.submit}
                </button>

                {status === 'error' && <p role="alert" className="text-center text-sm font-semibold text-red-600">{t.error}</p>}
              </form>

              <div className="mt-6 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
                {waHref && (
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 no-underline">
                    <FaWhatsapp size={36} className="shrink-0 text-[#25d366]" />
                    <span>
                      <span className="block font-bold text-wari-deep">{t.whatsapp}</span>
                      <span className="block text-sm text-slate-600">{t.whatsappSub}</span>
                    </span>
                  </a>
                )}
                {waHref && <span className="hidden h-11 w-px bg-slate-300 sm:block" aria-hidden="true" />}
                <a href={`mailto:${emailFor(locale)}`} className="flex items-center gap-3 no-underline">
                  <FiMail size={32} className="shrink-0 text-wari-navy" />
                  <span>
                    <span className="block font-bold text-wari-navy">{emailFor(locale)}</span>
                    <span className="block text-sm text-slate-600">{t.emailSub}</span>
                  </span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const INPUT = 'form-input pl-11! text-sm';

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid gap-4 sm:grid-cols-2">{children}</div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="mb-1.5 block text-sm font-bold text-wari-navy">{children}</span>
);

const Field: React.FC<{ label: string; icon: IconType; children: React.ReactNode }> = ({ label, icon: Icon, children }) => (
  <label className="block">
    <FieldLabel>{label}</FieldLabel>
    <span className="relative block">
      <Icon size={20} strokeWidth={1.5} className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500" />
      {children}
    </span>
  </label>
);

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly string[];
  required?: boolean;
}> = ({ value, onChange, placeholder, options, required }) => (
  <>
    <select required={required} value={value} onChange={(e) => onChange(e.target.value)} className={`${INPUT} cursor-pointer appearance-none pr-10!`}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    <FiChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
  </>
);

/** Selector múltiple con casillas: el `select` nativo no permite elegir varios cómodamente en móvil. */
const ProductPicker: React.FC<{
  options: readonly string[];
  selected: string[];
  placeholder: string;
  onChange: (next: string[]) => void;
}> = ({ options, selected, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggle = (option: string) =>
    onChange(selected.includes(option) ? selected.filter((p) => p !== option) : [...selected, option]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="form-input flex cursor-pointer items-center gap-3 pl-3.5! text-left text-sm"
      >
        <TbTag size={20} strokeWidth={1.5} className="shrink-0 text-slate-500" />
        <span className={`min-w-0 flex-1 truncate ${selected.length ? 'text-slate-900' : 'text-slate-600'}`}>
          {selected.length ? selected.join(', ') : placeholder}
        </span>
        <FiChevronDown size={18} className={`shrink-0 text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-800 hover:bg-slate-50">
              <input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} className="h-4 w-4 accent-[#12690f]" />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
