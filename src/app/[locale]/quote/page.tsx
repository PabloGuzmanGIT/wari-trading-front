import type { Metadata } from 'next';
import Image from 'next/image';
import { pages, routes, type NeedKey } from '@/locales/pages';
import { pageMetadata, toLocale } from '@/lib/seo';
import { media } from '@/lib/media';
import { ContactForm } from '@/components/ContactForm';

const NEEDS: NeedKey[] = ['grain', 'processing', 'brand', 'sell', 'eudr'];

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
  const image = media.HOME_HERO;

  return (
    <div className="flex flex-col bg-[#f7f9fb]">
      <section className="relative isolate overflow-hidden bg-[#10231f] text-white">
        <Image
          src={image.src}
          alt={image.alt[locale]}
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover object-right"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,34,60,.9)_0%,rgba(11,34,60,.6)_45%,rgba(11,34,60,.05)_72%)]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-wari-navy/55 lg:hidden" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#f7f9fb] to-transparent" aria-hidden="true" />
        <div className="mx-auto max-w-[1240px] px-4 pb-32 pt-12 sm:px-6 sm:pb-36 sm:pt-16 lg:pl-10 lg:pt-20 xl:pr-0">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] sm:text-sm">
            {t.eyebrow}
            <span className="h-px w-14 bg-wari-lime" aria-hidden="true" />
          </p>
          <h1 className="font-body! mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t.displayLead} <span className="text-wari-lime">{t.displayAccent}</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-snug sm:text-xl">{t.displaySubtitle}</p>
        </div>
      </section>
      <section className="relative z-10 -mt-20 px-4 pb-16 sm:-mt-24 sm:px-6 lg:pb-24">
        {/* key: si cambia ?need= en la misma página, el formulario se reinicia con esa opción */}
        <ContactForm key={need ?? 'none'} locale={locale} initialNeed={need} hideHeading />
      </section>
    </div>
  );
}
