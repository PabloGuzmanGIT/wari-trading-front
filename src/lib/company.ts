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
 *   - N.º de productores, localidades intermedias del corredor de acopio
 *   - Cooperativas aliadas certificadas (+ certificadora) — hoy vacío a propósito
 * No inventar datos: si algo no está confirmado, dejarlo en null / '' y la UI
 * lo omite.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const FOUNDED_YEAR = 2010;

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
  /** Año de constitución de la empresa (RYM S.A.C.), según ficha RUC. */
  foundedYear: FOUNDED_YEAR,
  /** Año desde el que la familia opera en café/cacao (de manera informal). null = no se menciona. */
  familyInTradeSince: 1970,
  tagline: {
    es: 'Café y cacao del VRAEM: acopio, maquila y producto terminado',
    en: 'Coffee and cocoa from Peru’s VRAEM: sourcing, toll processing and finished product',
  },
  /** Meta description corta (≤160 caracteres) para el home; la larga va en JSON-LD y llms.txt. */
  metaDescription: {
    es: 'Café pergamino, café de exportación y cacao del VRAEM. Maquila con planta propia con habilitación sanitaria, desde 5 kg hasta 500 TM al año.',
    en: 'Parchment, export-grade coffee and cocoa from Peru’s VRAEM. Toll processing in our sanitary-licensed plant, from 5 kg up to 500 MT a year.',
  },
  /** Descripción declarativa y factual (se usa en JSON-LD y llms.txt — clave para GEO). */
  description: {
    es: 'Empresa familiar peruana (VRAEM, Ayacucho) dedicada al acopio y la comercialización de café pergamino, café de exportación y cacao (CCN-51 y corriente), y al procesamiento de café y cacao por encargo. La familia opera en café y cacao desde 1970; la empresa se constituyó en 2010. Abastece hasta 500 TM al año desde una red de 10 puntos de acopio entre Puerto Ene y Villa Virgen. Cuenta con planta propia con habilitación sanitaria (tostado de café y cacao, descascarillado, nibs, licor, pasta y chocolate) y trabaja con plantas aliadas para pilado, polvo de cacao, empaque y pedidos de volumen.',
    en: 'Peruvian family business (VRAEM, Ayacucho) sourcing and trading parchment coffee, export-grade coffee and cocoa (CCN-51 and common bean), and toll processing coffee and cocoa. The family has worked in coffee and cocoa since 1970; the company was incorporated in 2010. Supplies up to 500 MT per year through a network of 10 buying points between Puerto Ene and Villa Virgen. Runs its own sanitary-licensed plant (coffee and cocoa roasting, winnowing, nibs, liquor, paste and chocolate) and works with partner plants for hulling, cocoa powder, packaging and volume orders.',
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
    /** Corredor de la red de acopio (extremos confirmados por el cliente). */
    corridor: { from: 'Puerto Ene', to: 'Villa Virgen' },
    /**
     * Localidades del corredor, de norte (Puerto Ene) a la parte alta (Villa Virgen).
     * Confirmadas por el cliente; el orden de la parte alta es aproximado.
     */
    districts: [
      'Puerto Ene', 'Canayre', 'Llochegua', 'Sivia', 'Pichari', 'Kimbiri', 'San Francisco',
      'Santa Rosa', 'Palmapampa', 'San Antonio', 'Anchihuay', 'Arhuimayo', 'Villa Virgen',
    ],
  },

  /** Cifras de autoridad. null = no se muestra la tarjeta. */
  stats: {
    /** Años de la empresa constituida (se calcula desde foundedYear). */
    yearsOperating: (new Date().getFullYear() - FOUNDED_YEAR) as number | null,
    /** Capacidad de abastecimiento anual, TM, café + cacao combinados. */
    tonsPerYear: 500,
    /** Desglose de la capacidad anual por producto (TM). */
    coffeeTonsPerYear: 150,
    cocoaTonsPerYear: 350,
    producers: null as number | null, // TODO: N.º de productores proveedores
    /** Puntos de acopio (intermediarios y productores) entre Puerto Ene y Villa Virgen. */
    collectionPoints: 10 as number | null,
  },

  /**
   * Cooperativas aliadas con certificación (modelo puente).
   * VACÍO a propósito: aún no hay alianzas firmadas. Solo agregar cooperativas
   * con acuerdo real; el sitio ajusta el texto automáticamente.
   */
  alliedCoops: [] as { name: string; certifier?: string; certs?: string[] }[],

  /**
   * Planta propia (confirmado oct-2026). Capacidades por lote (kg).
   * Lo que no está aquí (pilado, polvo de cacao, temperado/moldeado, empaque)
   * se hace con plantas aliadas: no presentarlo como proceso propio.
   */
  plant: {
    sanitaryPermit: true,
    coffeeRoasterKgBatch: 5,
    cocoaRoasterKgBatch: 50,
    winnowerKgBatch: 25,
    refinerKgBatch: 25,
    cocoaLineKgDay: 50,
  },

  /** Plantas aliadas con habilitación sanitaria (sin nombres públicos). */
  partnerPlants: {
    sanitaryPermit: true,
    services: {
      es: ['Pilado / trilla de café', 'Polvo y manteca de cacao', 'Temperado y moldeado de chocolate', 'Empaque y etiquetado', 'Pedidos de volumen'],
      en: ['Coffee hulling', 'Cocoa powder and butter', 'Chocolate tempering and moulding', 'Packaging and labelling', 'Volume orders'],
    },
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
