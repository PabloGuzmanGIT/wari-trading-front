import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { BottomTabBar } from "@/components/BottomTabBar";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  const title = isEs
    ? "Wari Trading S.A.C. | Agroexportación Peruana"
    : "Wari Trading S.A.C. | Peruvian Agro-Export";
  const description = isEs
    ? "Líderes en exportación de productos agrícolas peruanos de alta calidad: paltas, mangos, higos, espárragos, café y cacao. Cultivo sostenible junto a cooperativas locales."
    : "Leaders in the export of high-quality Peruvian agricultural products: avocados, mangoes, figs, asparagus, coffee, and cocoa. Sustainable farming together with local cooperatives.";
  const url = `${SITE_URL}/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/es`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Wari Trading S.A.C.",
      locale: isEs ? "es_PE" : "en_US",
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // JSON-LD Structured Data para SEO/GEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Wari Trading S.A.C.",
    "description": "Empresa peruana exportadora de productos agrícolas y pesqueros de alta calidad.",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "telephone": "+51 1 564-8811",
    "taxID": "20516488116",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jr. José María Morellos 120, Urb. Maranga, Dpto. 1",
      "addressLocality": "San Miguel",
      "addressRegion": "Lima",
      "addressCountry": "PE",
      "postalCode": "15086"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -12.0792,
      "longitude": -77.0984
    },
    "sameAs": [
      "https://www.facebook.com/hallpayaku",
      "https://www.linkedin.com/company/hallpayaku"
    ]
  };

  return (
    <>
      {/* Inyección de Datos Estructurados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Sticky band: Ticker + Header together */}
      <div className="sticky top-0 z-50 w-full">
        <PriceTicker />
        <Header />
      </div>
      <main className="flex-grow flex flex-col pb-16 md:pb-0">{children}</main>
      <BottomTabBar />
      <Footer />
    </>
  );
}
