import type { Locale } from '@/locales/translations';

/**
 * Registro central de imágenes por identificador lógico.
 *
 * Los componentes piden `media.HOME_HERO` y nunca conocen la URL: para cambiar
 * una foto (o pasarla a Cloudinary / Wari Media Manager) solo se toca este archivo.
 * Una URL de Cloudinary requiere autorizar su dominio en `images.remotePatterns`
 * de next.config.ts.
 *
 * `temporary: true` marca imágenes que deben reemplazarse. No usar imágenes
 * ilustrativas como si fueran instalaciones, maquinaria o productores de Wari.
 */
export interface MediaAsset {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  temporary?: boolean;
}

export const media = {
  HOME_HERO: {
    src: '/images/home-hero-temp.jpg',
    width: 1752,
    height: 804,
    temporary: true,
    alt: {
      es: 'Mazorca de cacao y cerezas de café frente a un valle de selva',
      en: 'Cocoa pod and coffee cherries in front of a jungle valley',
    },
  },
  HOME_ORIGIN: {
    src: '/images/home-origin-temp.jpg',
    width: 1016,
    height: 468,
    temporary: true,
    alt: {
      es: 'Valle de montaña con selva y río, imagen ilustrativa',
      en: 'Mountain valley with jungle and river, illustrative image',
    },
  },
  COFFEE_MAIN: {
    src: '/images/coffee-main-temp.jpg',
    width: 768,
    height: 342,
    temporary: true,
    alt: { es: 'Saco de yute con café verde', en: 'Jute sack of green coffee' },
  },
  COCOA_MAIN: {
    src: '/images/cocoa-main-temp.jpg',
    width: 762,
    height: 342,
    temporary: true,
    alt: { es: 'Saco de yute con granos de cacao', en: 'Jute sack of cocoa beans' },
  },
  COCOA_NIBS: {
    src: '/images/cocoa-nibs-temp.jpg',
    width: 765,
    height: 342,
    temporary: true,
    alt: { es: 'Nibs de cacao en un recipiente de madera', en: 'Cocoa nibs in a wooden bowl' },
  },
  ROASTED_COFFEE: {
    src: '/images/roasted-coffee-temp.jpg',
    width: 762,
    height: 342,
    temporary: true,
    alt: { es: 'Granos de café tostado', en: 'Roasted coffee beans' },
  },
  ORIGIN_HERO: {
    src: '/images/origin-hero-temp.jpg',
    width: 1536,
    height: 340,
    temporary: true,
    alt: {
      es: 'Valle de montaña con selva y río, imagen ilustrativa',
      en: 'Mountain valley with jungle and river, illustrative image',
    },
  },
  ORIGIN_MAP: {
    src: '/images/origin-map-temp.jpg',
    width: 2100,
    height: 650,
    temporary: true,
    alt: {
      es: 'Esquema del corredor de acopio entre Puerto Ene y Villa Virgen, con 10 puntos numerados a lo largo de los ríos Ene y Apurímac',
      en: 'Schematic of the sourcing corridor between Puerto Ene and Villa Virgen, with 10 numbered points along the Ene and Apurímac rivers',
    },
  },
  HARVEST_COFFEE: {
    src: '/images/harvest-coffee-temp.jpg',
    width: 498,
    height: 270,
    temporary: true,
    alt: { es: 'Rama con cerezas de café maduras', en: 'Branch with ripe coffee cherries' },
  },
  HARVEST_COCOA: {
    src: '/images/harvest-cocoa-temp.jpg',
    width: 534,
    height: 270,
    temporary: true,
    alt: { es: 'Mazorca de cacao en el árbol', en: 'Cocoa pod on the tree' },
  },
  ABOUT_HERO: {
    src: '/images/about-hero-temp.jpg',
    width: 1800,
    height: 470,
    temporary: true,
    alt: {
      es: 'Mazorca de cacao frente a un valle de selva, imagen ilustrativa',
      en: 'Cocoa pod in front of a jungle valley, illustrative image',
    },
  },
  ABOUT_INTRO: {
    src: '/images/about-intro-temp.jpg',
    width: 1036,
    height: 564,
    temporary: true,
    alt: {
      es: 'Imagen ilustrativa de la cosecha de café: una persona recoge cerezas maduras',
      en: 'Illustrative image of the coffee harvest: a person picking ripe cherries',
    },
  },
  CONTACT_PANEL: {
    src: '/images/contact-panel-temp.jpg',
    width: 584,
    height: 652,
    temporary: true,
    alt: { es: 'Saco de café y mazorca de cacao abierta', en: 'Sack of coffee and an open cocoa pod' },
  },
} satisfies Record<string, MediaAsset>;
