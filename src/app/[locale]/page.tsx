import type { Locale } from '@/locales/translations';
import { pages } from '@/locales/pages';
import { Hero } from '@/components/Hero';
import { AuthorityBar } from '@/components/AuthorityBar';
import { CapacityChain } from '@/components/CapacityChain';
import { ProductCards } from '@/components/ProductCards';
import { MaquilaBanner } from '@/components/MaquilaBanner';
import { OriginTeaser } from '@/components/OriginTeaser';
import { EudrTeaser } from '@/components/EudrTeaser';
import { MarketTeaser } from '@/components/MarketTeaser';
import { ContactForm } from '@/components/ContactForm';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === 'en' ? 'en' : 'es';
  const t = pages[locale].home.quote;

  return (
    <div className="flex flex-col">
      <Hero locale={locale} />
      <AuthorityBar locale={locale} />
      <CapacityChain locale={locale} />
      <ProductCards locale={locale} />
      <MaquilaBanner locale={locale} />
      <OriginTeaser locale={locale} />
      <EudrTeaser locale={locale} />
      <MarketTeaser locale={locale} />
      <section className="section-padding bg-white">
        <ContactForm locale={locale} title={t.title} subtitle={t.subtitle} />
      </section>
    </div>
  );
}
