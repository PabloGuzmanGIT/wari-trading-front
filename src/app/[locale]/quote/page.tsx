import type { Metadata } from 'next';
import { pages, routes, type NeedKey } from '@/locales/pages';
import { pageMetadata, toLocale } from '@/lib/seo';
import { PageHeader } from '@/components/Section';
import { ContactForm } from '@/components/ContactForm';

const NEEDS: NeedKey[] = ['grain', 'processing', 'brand', 'eudr'];

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = pages[locale].quote;
  return pageMetadata(locale, routes.quote, t.title, t.subtitle);
}

export default async function QuotePage({ params, searchParams }: Props) {
  const locale = toLocale((await params).locale);
  const raw = (await searchParams).need;
  const need = NEEDS.find((n) => n === raw);
  const t = pages[locale].quote;

  return (
    <div className="flex flex-col">
      <PageHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="section-padding bg-[#fbfbfa]">
        {/* key: si cambia ?need= en la misma página, el formulario se reinicia con esa opción */}
        <ContactForm key={need ?? 'none'} locale={locale} initialNeed={need} hideHeading />
      </section>
    </div>
  );
}
