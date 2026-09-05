/**
 * FUENTE DE VERDAD de la identidad de la empresa.
 *
 * Todo el sitio (metadata, JSON-LD, Footer, formulario de contacto, llms.txt)
 * lee de aquí. Cambiar un dato en este archivo lo cambia en todo el sitio.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Confirmado: razón social, RUC, dirección, teléfono/WhatsApp, dominio
 * (waritradingfoods.com) y correos por audiencia (ventas@ local / commercial@
 * internacional / info@ general).
 *
 * PENDIENTE de confirmar con el cliente (marcado con  // TODO ):
 *   - Nombre de la marca propia (retail)
 *   - Perfiles reales para `sameAs` (LinkedIn, Google Business Profile, redes)
 *   - Años operando (yearsOperating), N.º de productores, distritos/puntos de acopio
 *   - Cooperativas aliadas certificadas (+ certificadora) — hoy vacío a propósito
 *   - Capacidad de planta (kg/día por proceso)
 * No inventar datos: si algo no está confirmado, dejarlo en null / '' y la UI
 * lo omite.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://waritradingfoods.com';

export const company = {
  /** Nombre comercial que se muestra en el sitio. */
  name: 'Wari Trading Foods',
  /** Razón social para documentos legales, JSON-LD y footer. */
  legalName: 'Comercial Industrial RYM S.A.C.',
  ruc: '20494965594',
  /** Marca propia de café y cacao. */
  ownBrand: '', // TODO: nombre de la marca propia (retail)
  /** Año de constitución de la empresa (RYM S.A.C.). */
  foundedYear: 2009,
  /** Año aproximado desde el que la familia opera en café/cacao (narrativa). null = no se menciona. */
  familyInTradeSince: 1960,
  tagline: {
    es: 'Acopio y comercialización de café pergamino y cacao del VRAEM',
    en: 'Sourcing and trading of parchment coffee and cocoa from Peru’s VRAEM',
  },
  /** Descripción declarativa y factual (se usa en JSON-LD y llms.txt — clave para GEO). */
  description: {
    es: 'Empresa familiar peruana (VRAEM, Ayacucho) dedicada al acopio y la comercialización de café pergamino en volumen y cacao (CCN-51 y corriente). La familia opera en café y cacao desde los años 60; la empresa se constituyó en 2009. Abastece hasta 500 TM al año a casas exportadoras en Perú y ofrece servicio de maquila a pequeña escala (tostado, pilado, molienda y derivados) y marca propia.',
    en: 'Peruvian family business (VRAEM, Ayacucho) sourcing and trading bulk parchment coffee and cocoa (CCN-51 and common bean). The family has worked in coffee and cocoa since the 1960s; the company was incorporated in 2009. Supplies up to 500 MT per year to Peruvian export houses and offers small-scale toll processing (roasting, hulling, milling, derivatives) plus its own brand.',
  },
  /**
   * Correos por audiencia:
   *  - es: mercado local (Perú)
   *  - en: compradores internacionales / fuera de Perú
   *  - general: bandeja genérica
   */
  email: {
    es: 'ventas@waritradingfoods.com',
    en: 'commercial@waritradingfoods.com',
    general: 'info@waritradingfoods.com',
  },
  phone: '+51 921 451 334',
  /** WhatsApp en formato internacional sin signos. Vacío = no se muestra el botón. */
  whatsapp: '51921451334',
  address: {
    street: 'Jr. Salvador Cavero 351',
    locality: 'Ayacucho (Huamanga)',
    region: 'Ayacucho',
    country: 'PE',
    postalCode: '', // TODO (opcional)
  },
  /** La dirección es oficina + planta/almacén y se reciben visitas de compradores. */
  visitorsWelcome: true,
  /** Coordenadas de la planta/oficina. null = se omite del JSON-LD. */
  geo: null as { lat: number; lng: number } | null, // TODO

  /** Perfiles oficiales. Solo URLs reales — se usan en JSON-LD `sameAs` y footer. */
  social: {
    linkedin: '', // TODO
    facebook: '', // TODO
    instagram: '', // TODO
    googleBusiness: '', // TODO
  },

  /** Zona de operación. */
  origin: {
    region: 'VRAEM',
    admin: 'Ayacucho, Perú',
    districts: ['Sivia', 'Llochegua', 'Canayre', 'Pichari', 'Kimbiri', 'San Francisco'], // TODO: ajustar a los reales
  },

  /** Cifras de autoridad. null = no se muestra la tarjeta. */
  stats: {
    yearsOperating: null as number | null, // TODO: años operando (¿13?)
    /** Capacidad de abastecimiento anual, TM, café + cacao combinados. */
    tonsPerYear: 500,
    /** Desglose de la capacidad anual por producto (TM). */
    coffeeTonsPerYear: 150,
    cocoaTonsPerYear: 350,
    producers: null as number | null, // TODO: N.º de productores proveedores
    collectionPoints: null as number | null, // TODO: N.º de puntos de acopio
  },

  /**
   * Cooperativas aliadas con certificación (modelo puente).
   * VACÍO a propósito: aún no hay alianzas firmadas. Solo agregar cooperativas
   * con acuerdo real; el sitio ajusta el texto automáticamente.
   */
  alliedCoops: [] as { name: string; certifier?: string; certs?: string[] }[],

  /** Capacidad de la planta de maquila (kg/día). null = no se muestra el número. */
  plant: {
    roastingKgDay: null as number | null, // TODO
    hullingKgDay: null as number | null, // TODO
    millingKgDay: null as number | null, // TODO
  },
} as const;

/** Lista de URLs reales para JSON-LD `sameAs`. */
export const sameAs: string[] = [
  company.social.linkedin,
  company.social.facebook,
  company.social.instagram,
  company.social.googleBusiness,
].filter(Boolean);

/** Nombre a mostrar: comercial + (razón social) si difieren. */
export const displayName = company.name;

/** Correo según el idioma del visitante (es = local, en = internacional). */
export const emailFor = (locale: 'es' | 'en'): string =>
  locale === 'en' ? company.email.en : company.email.es;
