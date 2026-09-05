import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { BottomTabBar } from "@/components/BottomTabBar";
import { WhatsappButton } from "@/components/WhatsappButton";
import { HtmlLang } from "@/components/HtmlLang";
import { SITE_URL, company, sameAs } from "@/lib/company";
import { translations, type Locale } from "@/locales/translations";

// Prerenderiza /es y /en en build (no hay cookies()/headers() en el árbol).
// Las rutas hijas que consultan la API (blog) siguen siendo dinámicas/ISR.
export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

const KEYWORDS = {
  es: [
    "café pergamino Perú", "comprar café pergamino VRAEM", "acopio de café VRAEM",
    "cacao CCN-51 Perú", "cacao corriente VRAEM", "proveedor de cacao Perú",
    "maquila de café Perú", "servicio de tostado por encargo", "pilado de café pergamino",
    "café y cacao Ayacucho", "exportación café verde Perú",
  ],
  en: [
    "Peru parchment coffee", "buy green coffee VRAEM", "Peruvian coffee supplier",
    "CCN-51 cocoa Peru", "bulk cocoa Peru supplier", "cocoa beans Peru FOB Callao",
    "toll roasting Peru", "small batch coffee processing Peru", "VRAEM coffee and cocoa",
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const isEs = raw !== "en";
  const locale: Locale = isEs ? "es" : "en";
  const title = `${company.name} | ${company.tagline[locale]}`;
  const description = company.description[locale];
  const url = `${SITE_URL}/${locale}`;

  return {
    title: { absolute: title },
    description,
    keywords: KEYWORDS[locale],
    applicationName: company.name,
    authors: [{ name: company.legalName }],
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
      siteName: company.name,
      locale: isEs ? "es_PE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const { locale: raw } = await params;
  const locale: Locale = raw === "en" ? "en" : "es";

  const org = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: company.legalName,
    alternateName: company.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: company.description[locale],
    email: company.email.general,
    ...(company.phone ? { telephone: company.phone } : {}),
    ...(company.ruc ? { taxID: company.ruc } : {}),
    ...(company.foundedYear ? { foundingDate: String(company.foundedYear) } : {}),
    address: {
      "@type": "PostalAddress",
      ...(company.address.street ? { streetAddress: company.address.street } : {}),
      ...(company.address.locality ? { addressLocality: company.address.locality } : {}),
      addressRegion: company.address.region,
      addressCountry: company.address.country,
      ...(company.address.postalCode ? { postalCode: company.address.postalCode } : {}),
    },
    ...(company.geo ? { geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng } } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        name: "Ventas Perú",
        email: company.email.es,
        ...(company.phone ? { telephone: company.phone } : {}),
        availableLanguage: ["es"],
        areaServed: "PE",
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        name: "International sales",
        email: company.email.en,
        ...(company.phone ? { telephone: company.phone } : {}),
        availableLanguage: ["en", "es"],
        areaServed: "Worldwide",
      },
    ],
    areaServed: ["PE", "Worldwide"],
    knowsAbout: [
      "parchment coffee", "green coffee sourcing", "CCN-51 cocoa", "cocoa trading",
      "coffee toll processing", "EUDR compliance", "VRAEM", "Peru agricultural exports",
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: company.name,
    inLanguage: [locale === "es" ? "es-PE" : "en-US"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const products = [
    {
      "@type": "Product",
      name: locale === "es" ? "Café pergamino del VRAEM" : "VRAEM parchment coffee",
      category: "Green coffee / parchment coffee",
      brand: { "@id": `${SITE_URL}/#organization` },
      description:
        locale === "es"
          ? `Café pergamino en volumen del VRAEM (Ayacucho, Perú). Humedad 11–12%, sacos de yute 69 kg. Venta EXW Ayacucho / entrega Lima; exportación como café oro vía casa exportadora (FOB Callao). Hasta ${company.stats.coffeeTonsPerYear} TM/año.`
          : `Bulk parchment coffee from the VRAEM (Ayacucho, Peru). 11–12% moisture, 69 kg jute bags. Sold EXW Ayacucho / delivered Lima; exported as green coffee via export house (FOB Callao). Up to ${company.stats.coffeeTonsPerYear} MT/year.`,
      areaServed: ["PE", "Worldwide"],
    },
    {
      "@type": "Product",
      name: locale === "es" ? "Cacao CCN-51 y corriente del VRAEM" : "VRAEM CCN-51 and common cocoa",
      category: "Cocoa beans",
      brand: { "@id": `${SITE_URL}/#organization` },
      description:
        locale === "es"
          ? `Cacao CCN-51 y cacao corriente / mezcla regional del VRAEM. Humedad < 7,5%, fermentación verificada, sacos de yute 64 kg. Hasta ${company.stats.cocoaTonsPerYear} TM/año.`
          : `CCN-51 and common / regional-blend cocoa from the VRAEM. < 7.5% moisture, verified fermentation, 64 kg jute bags. Up to ${company.stats.cocoaTonsPerYear} MT/year.`,
      areaServed: ["PE", "Worldwide"],
    },
  ];

  const service = {
    "@type": "Service",
    name: locale === "es" ? "Maquila de café y cacao a pequeña escala" : "Small-scale coffee and cocoa toll processing",
    serviceType: locale === "es" ? "Tostado, pilado, molienda y empaque por encargo" : "Toll roasting, hulling, milling and packaging",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "PE",
    description: company.description[locale],
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${locale}/#faq`,
    mainEntity: translations[locale].faq.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  const jsonLd = { "@context": "https://schema.org", "@graph": [org, website, ...products, service, faqPage] };

  return (
    <>
      <HtmlLang locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="sticky top-0 z-50 w-full">
        <PriceTicker />
        <Header />
      </div>
      <main className="flex-grow flex flex-col">{children}</main>
      <WhatsappButton />
      <BottomTabBar />
      <Footer />
    </>
  );
}
