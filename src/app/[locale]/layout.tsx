import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { BottomTabBar } from "@/components/BottomTabBar";
import { WhatsappButton } from "@/components/WhatsappButton";
import { HtmlLang } from "@/components/HtmlLang";
import { SITE_URL, company, sameAs } from "@/lib/company";
import type { Locale } from "@/locales/translations";

// Prerenderiza /es y /en en build (no hay cookies()/headers() en el árbol).
// Las rutas hijas que consultan la API (blog) siguen siendo dinámicas/ISR.
export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

const KEYWORDS = {
  es: [
    "café pergamino Perú", "comprar café pergamino VRAEM", "acopio de café VRAEM",
    "cacao CCN-51 Perú", "cacao corriente VRAEM", "proveedor de cacao Perú",
    "maquila de café Perú", "maquila de cacao Perú", "servicio de tostado por encargo",
    "licor de cacao por encargo", "chocolate marca blanca Perú", "marca privada café",
    "café y cacao Ayacucho", "exportación café verde Perú", "trazabilidad EUDR cooperativas",
  ],
  en: [
    "Peru parchment coffee", "buy green coffee VRAEM", "Peruvian coffee supplier",
    "CCN-51 cocoa Peru", "bulk cocoa Peru supplier", "cocoa beans Peru FOB Callao",
    "toll roasting Peru", "cocoa toll processing Peru", "private label chocolate Peru",
    "cocoa liquor supplier Peru", "VRAEM coffee and cocoa", "EUDR traceability Peru",
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const isEs = raw !== "en";
  const locale: Locale = isEs ? "es" : "en";
  const title = `${company.name} | ${company.tagline[locale]}`;
  const description = company.metaDescription[locale];
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
    logo: `${SITE_URL}/icon-512.png`,
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
      "coffee toll processing", "cocoa toll processing", "cocoa liquor", "private label chocolate", "EUDR compliance", "VRAEM", "Peru agricultural exports",
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

  // Modelado como Service (no Product): es un acopiador/comercializador B2B sin
  // precio fijo ni catálogo minorista. Un `Product` sin offers/review/aggregateRating
  // se marca como inválido en el informe "Fragmentos de productos" de Search Console.
  const products = [
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#supply-coffee`,
      name: locale === "es" ? "Abastecimiento de café pergamino del VRAEM" : "VRAEM parchment coffee sourcing",
      serviceType: locale === "es" ? "Acopio y comercialización de café pergamino en volumen" : "Bulk parchment coffee sourcing and trading",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: ["PE", "Worldwide"],
      description:
        locale === "es"
          ? `Café pergamino en volumen del VRAEM (Ayacucho, Perú). Humedad 11–12%, sacos de yute 69 kg. Venta EXW Ayacucho / entrega Lima; exportación como café oro vía casa exportadora (FOB Callao). Hasta ${company.stats.coffeeTonsPerYear} TM/año.`
          : `Bulk parchment coffee from the VRAEM (Ayacucho, Peru). 11–12% moisture, 69 kg jute bags. Sold EXW Ayacucho / delivered Lima; exported as green coffee via export house (FOB Callao). Up to ${company.stats.coffeeTonsPerYear} MT/year.`,
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#supply-cocoa`,
      name: locale === "es" ? "Abastecimiento de cacao CCN-51 y corriente del VRAEM" : "VRAEM CCN-51 and common cocoa sourcing",
      serviceType: locale === "es" ? "Acopio y comercialización de cacao en grano" : "Cocoa bean sourcing and trading",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: ["PE", "Worldwide"],
      description:
        locale === "es"
          ? `Cacao CCN-51 y cacao corriente / mezcla regional del VRAEM. Humedad < 7,5%, fermentación verificada, sacos de yute 64 kg. Hasta ${company.stats.cocoaTonsPerYear} TM/año.`
          : `CCN-51 and common / regional-blend cocoa from the VRAEM. < 7.5% moisture, verified fermentation, 64 kg jute bags. Up to ${company.stats.cocoaTonsPerYear} MT/year.`,
    },
  ];

  const service = {
    "@type": "Service",
    "@id": `${SITE_URL}/#toll-processing`,
    name: locale === "es" ? "Maquila de café y cacao" : "Coffee and cocoa toll processing",
    serviceType:
      locale === "es"
        ? "Tostado de café y cacao, nibs, licor, pasta y chocolate por encargo; pilado, polvo y empaque con plantas aliadas"
        : "Toll roasting of coffee and cocoa, nibs, liquor, paste and chocolate; hulling, powder and packaging via partner plants",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "PE",
    url: `${SITE_URL}/${locale}/maquila`,
    description:
      locale === "es"
        ? `Planta propia con habilitación sanitaria en Ayacucho. Tostado de café desde ${company.plant.coffeeRoasterKgBatch} kg; tostado de cacao (${company.plant.cocoaRoasterKgBatch} kg/lote), nibs, licor, pasta y chocolate desde ${company.plant.refinerKgBatch} kg. Plantas aliadas para pilado, polvo de cacao, empaque y volumen.`
        : `Own sanitary-licensed plant in Ayacucho. Coffee roasting from ${company.plant.coffeeRoasterKgBatch} kg; cocoa roasting (${company.plant.cocoaRoasterKgBatch} kg/batch), nibs, liquor, paste and chocolate from ${company.plant.refinerKgBatch} kg. Partner plants for hulling, cocoa powder, packaging and volume.`,
  };

  const jsonLd = { "@context": "https://schema.org", "@graph": [org, website, ...products, service] };

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
