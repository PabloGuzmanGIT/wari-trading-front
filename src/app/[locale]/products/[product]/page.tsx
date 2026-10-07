import Link from 'next/link';
import type { Metadata } from 'next';
import { translations } from '@/locales/translations';
import { pages, routes, quoteHref } from '@/locales/pages';
import { pageMetadata, toLocale } from '@/lib/seo';
import { PageHeader, SanitarySeal } from '@/components/Section';
import { SpecTable } from '@/components/SpecSheets';
import { ContactForm } from '@/components/ContactForm';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const PRODUCTS = ['coffee', 'cocoa', 'derivatives'] as const;
type Product = (typeof PRODUCTS)[number];

interface Props {
  params: Promise<{ locale: string; product: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ product }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, product } = await params;
  const locale = toLocale(raw);
  const t = pages[locale].products[product as Product];
  return pageMetadata(locale, routes[product as Product], t.title, t.subtitle);
}

export default async function ProductPage({ params }: Props) {
  const { locale: raw, product: slug } = await params;
  const locale = toLocale(raw);
  const product = slug as Product;
  const t = pages[locale].products;
  const p = t[product];
  const specs = translations[locale].specs;
  const quoteNeed = product === 'derivatives' ? 'processing' : 'grain';

  return (
    <div className="flex flex-col">
      <PageHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={quoteHref(locale, quoteNeed)} className="btn-primary no-underline justify-center">
            {t.sample} <FiArrowRight />
          </Link>
          {'moq' in p && (
            <span className="inline-flex items-center justify-center gap-2 text-sm text-slate-300 border border-white/15 rounded-full px-5 py-2.5">
              {t.moqLabel}: <strong className="text-white">{p.moq}</strong>
            </span>
          )}
        </div>
      </PageHeader>

      {product === 'derivatives' ? (
        <section className="section-padding bg-white">
          <div className="container">
            <div className="mb-8"><SanitarySeal label={pages[locale].maquila.seal} /></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.derivatives.items.map((item) => (
                <article key={item.t} className="rounded-2xl border border-slate-200 p-6 flex flex-col">
                  <span className={`self-start text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 mb-4 ${item.own ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item.own ? t.derivatives.ownLabel : t.derivatives.partnerLabel}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mb-1">{item.t}</h2>
                  <p className="text-sm text-slate-500 flex-1">{item.d}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                    <span className="text-slate-400">{t.moqLabel}: </span>
                    <strong className="text-slate-800">{item.moq}</strong>
                  </div>
                </article>
              ))}
            </div>
            <Link href={`/${locale}${routes.maquila}`} className="inline-flex items-center gap-1.5 mt-8 text-sm font-semibold text-emerald-700 no-underline hover:text-emerald-900">
              {translations[locale].nav.maquila} <FiArrowRight />
            </Link>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-white">
          <div className="container grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-4">
              {t[product].offers.map((o) => (
                <div key={o.t} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <FiCheck className="text-emerald-500 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <h2 className="font-bold text-slate-900">{o.t}</h2>
                    <p className="text-sm text-slate-500 mt-1">{o.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-7">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 mb-4">{t.specTitle}</h2>
              <SpecTable name={specs[product].name} rows={specs[product].rows} />
              <p className="text-xs text-slate-400 mt-3">{specs.subtitle}</p>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-[#fbfbfa]">
        <ContactForm locale={locale} initialNeed={quoteNeed} />
      </section>
    </div>
  );
}
