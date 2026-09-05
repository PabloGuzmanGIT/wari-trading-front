import type { Locale } from '@/locales/translations';
import { Hero } from '@/components/Hero';
import { AuthorityBar } from '@/components/AuthorityBar';
import { Offer } from '@/components/Offer';
import { Sourcing } from '@/components/Sourcing';
import { SpecSheets } from '@/components/SpecSheets';
import { PlantMaquila } from '@/components/PlantMaquila';
import { QualityProcess } from '@/components/QualityProcess';
import { TraceabilityEudr } from '@/components/TraceabilityEudr';
import { Certifications } from '@/components/Certifications';
import { SocialProof } from '@/components/SocialProof';
import { CompanyFacts } from '@/components/CompanyFacts';
import { Faq } from '@/components/Faq';
import { ContactForm } from '@/components/ContactForm';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === 'en' ? 'en' : 'es';

  return (
    <div className="flex flex-col">
      <Hero locale={locale} />
      <AuthorityBar locale={locale} />
      <Offer locale={locale} />
      <Sourcing locale={locale} />
      <SpecSheets locale={locale} />
      <PlantMaquila locale={locale} />
      <QualityProcess locale={locale} />
      <TraceabilityEudr locale={locale} />
      <Certifications locale={locale} />
      <SocialProof locale={locale} />
      <CompanyFacts locale={locale} />
      <Faq locale={locale} />
      <section className="section-padding bg-white">
        <ContactForm locale={locale} />
      </section>
    </div>
  );
}
