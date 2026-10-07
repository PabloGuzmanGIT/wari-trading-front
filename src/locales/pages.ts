import { company } from "@/lib/company";
import type { Locale } from "@/locales/translations";

/**
 * Textos de las páginas del sitio (home y páginas internas).
 * Los textos compartidos (nav, formulario, footer, portal) siguen en translations.ts.
 *
 * Regla: la planta propia solo hace lo que está en company.plant. Pilado, polvo,
 * temperado/moldeado y empaque se presentan siempre como "con plantas aliadas".
 */

const p = company.plant;
const s = company.stats;
const { from, to } = company.origin.corridor;

export type NeedKey = "grain" | "processing" | "brand" | "eudr";

const es = {
  home: {
    hero: {
      badge: `${company.name} · VRAEM, Ayacucho`,
      title: "Café y cacao del VRAEM: del grano a tu producto terminado",
      subtitle: `Red de acopio en origen, planta con habilitación sanitaria y plantas aliadas. Desde ${p.coffeeRoasterKgBatch} kg hasta ${s.tonsPerYear} TM al año.`,
      doorsTitle: "¿Qué necesitas?",
      doors: [
        { key: "grain", t: "Comprar grano", d: "Café pergamino, café de exportación y cacao en volumen." },
        { key: "processing", t: "Procesar mi producto", d: "Maquila de café y cacao desde 5 kg." },
        { key: "brand", t: "Crear mi marca", d: "Café o chocolate con tu etiqueta, listo para vender." },
        { key: "eudr", t: "Trazabilidad EUDR", d: "Geolocalización y expediente para cooperativas." },
      ] as { key: NeedKey; t: string; d: string }[],
      imageAlt: "Valle del Río Apurímac, VRAEM",
      imageTag: "Origen",
      imageCaption: "Valle de los ríos Apurímac, Ene y Mantaro",
    },
    stats: {
      family: "La familia en café y cacao",
      founded: "Empresa constituida",
      tons: "TM al año · café + cacao",
      points: "Puntos de acopio",
      plant: "Planta con habilitación sanitaria",
      since: "Desde",
    },
    chain: {
      eyebrow: "Capacidad",
      title: "Una sola operación, del valle al despacho",
      subtitle: "Controlamos cada etapa. Lo que no hacemos en planta propia lo resolvemos con plantas aliadas, sin que tengas que coordinar con nadie más.",
      steps: [
        { t: "Red de acopio", d: `${s.collectionPoints} puntos entre ${from} y ${to}, con intermediarios y productores.` },
        { t: "Control de calidad", d: "Humedad, prueba de corte y contramuestra de cada lote." },
        { t: "Planta propia", d: "Tostado de café y cacao, nibs, licor, pasta y chocolate." },
        { t: "Plantas aliadas", d: "Pilado, polvo de cacao, empaque y pedidos de volumen." },
        { t: "Despacho", d: "EXW Ayacucho, entrega en Lima o FOB Callao vía exportadora aliada." },
      ],
    },
    products: {
      eyebrow: "Productos",
      title: "Lo que te podemos entregar",
      subtitle: "Grano en volumen y derivados listos para tu proceso o tu marca.",
      items: [
        { slug: "coffee", t: "Café pergamino y de exportación", d: "Comercial y de exportación. Lotes desde 1 TM." },
        { slug: "cocoa", t: "Cacao en grano", d: "CCN-51 y corriente, fermentación verificada. Lotes desde 1 TM." },
        { slug: "derivatives", t: "Derivados de cacao", d: "Nibs, licor, pasta y chocolate. Desde 25 kg." },
        { slug: "derivatives", t: "Café tostado", d: "En grano o molido, perfil por lote. Desde 5 kg." },
      ],
      spec: "Ver ficha",
      sample: "Pedir muestra",
    },
    maquila: {
      eyebrow: "Maquila",
      title: `Maquila de café y cacao desde ${p.coffeeRoasterKgBatch} kg`,
      subtitle: "Tostado, nibs, licor, pasta y chocolate en planta propia. Pilado, polvo y empaque con plantas aliadas. Un solo contacto para todo el proceso.",
      seal: "Planta con habilitación sanitaria",
      cta: "Ver servicios de maquila",
      figures: [
        { v: `${p.coffeeRoasterKgBatch} kg`, l: "lote de tostado de café" },
        { v: `${p.cocoaRoasterKgBatch} kg`, l: "lote de tostado de cacao" },
        { v: `${p.refinerKgBatch} kg`, l: "lote de licor o chocolate" },
      ],
    },
    origin: {
      eyebrow: "Origen",
      title: "Compramos donde nace el grano",
      subtitle: `Una red de ${s.collectionPoints} puntos de acopio a lo largo del corredor ${from} – ${to}, en el corazón del VRAEM.`,
      cta: "Conocer el origen",
    },
    eudr: {
      eyebrow: "Para cooperativas",
      title: "¿Tu cooperativa está lista para el EUDR?",
      subtitle: "El reglamento europeo contra la deforestación aplica desde el 30 de diciembre de 2026. Te ayudamos a geolocalizar parcelas y armar el expediente de cada lote.",
      cta: "Pedir diagnóstico gratuito",
      more: "Cómo funciona",
    },
    market: {
      eyebrow: "Mercado",
      title: "Precios y notas de mercado",
      subtitle: "Los precios internacionales y de compra local se actualizan cada día en la barra superior. Cada semana publicamos lo que mueve el mercado.",
      cta: "Ver todas las notas",
      empty: "Pronto publicaremos nuestras notas de mercado.",
    },
    quote: {
      title: "Cuéntanos qué necesitas",
      subtitle: "Respondemos en 24–72 h. Si prefieres, escríbenos por WhatsApp.",
    },
  },

  products: {
    back: "Volver a productos",
    sample: "Pedir muestra",
    quote: "Cotizar",
    specTitle: "Ficha técnica",
    moqLabel: "Pedido mínimo",
    coffee: {
      eyebrow: "Café",
      title: "Café pergamino y café de exportación del VRAEM",
      subtitle: "Café comercial y de exportación de 1 200 a 1 900 msnm, acopiado en nuestra red de origen y controlado lote por lote.",
      moq: "Lotes desde 1 TM",
      offers: [
        { t: "Pergamino comercial", d: "En volumen, sacos de yute de 69 kg. Venta EXW Ayacucho o con entrega en Lima." },
        { t: "Café de exportación", d: "Pilado a oro/verde en planta aliada y exportado FOB Callao a través de una casa exportadora aliada." },
        { t: "Especialidad bajo pedido", d: "Lotes 82+ SCA cuando el comprador lo solicita y hay disponibilidad en el valle." },
      ],
    },
    cocoa: {
      eyebrow: "Cacao",
      title: "Cacao en grano CCN-51 y corriente",
      subtitle: "Cacao seco del VRAEM con fermentación y humedad verificadas en cada lote. Disponible todo el año, con pico de mayo a agosto.",
      moq: "Lotes desde 1 TM",
      offers: [
        { t: "CCN-51", d: "Alto rendimiento para industria. Sacos de yute de 64 kg." },
        { t: "Corriente / mezcla regional", d: "Perfil típico del VRAEM, para licor y chocolate." },
        { t: "Fino de aroma bajo pedido", d: "Según disponibilidad en el valle y requerimiento del comprador." },
      ],
    },
    derivatives: {
      eyebrow: "Derivados",
      title: "Derivados de cacao y café tostado",
      subtitle: "Producidos en nuestra planta con habilitación sanitaria a partir de grano de nuestra propia red de acopio. Lo que requiere otro equipo lo resolvemos con plantas aliadas.",
      items: [
        { t: "Nibs de cacao", d: "Tostados y descascarillados.", moq: `Desde ${p.winnowerKgBatch} kg`, own: true },
        { t: "Licor / pasta de cacao", d: "100 % cacao, refinado.", moq: `Desde ${p.refinerKgBatch} kg`, own: true },
        { t: "Chocolate y cobertura", d: "En bloque o a granel. Temperado y moldeado con plantas aliadas.", moq: `Desde ${p.refinerKgBatch} kg`, own: true },
        { t: "Café tostado", d: "En grano o molido, perfil de tueste por lote.", moq: `Desde ${p.coffeeRoasterKgBatch} kg`, own: true },
        { t: "Polvo y manteca de cacao", d: "Prensado en planta aliada.", moq: "A cotizar", own: false },
      ],
      ownLabel: "Planta propia",
      partnerLabel: "Planta aliada",
    },
  },

  maquila: {
    eyebrow: "Maquila",
    title: "Maquila de café y cacao: de 5 kg a volumen industrial",
    subtitle: "Procesamos tu café o cacao en planta propia con habilitación sanitaria. Para pilado, polvo, empaque o volúmenes mayores trabajamos con plantas aliadas, con un solo contacto y un solo responsable.",
    seal: "Planta con habilitación sanitaria",
    tableTitle: "Servicios, mínimos y plazos",
    cols: { service: "Servicio", min: "Desde", time: "Plazo referencial*", where: "Dónde" },
    own: "Planta propia",
    partner: "Plantas aliadas",
    both: "Propia + aliadas",
    rows: [
      { s: "Muestra o desarrollo de producto", min: "1–5 kg (cobrada y descontable del primer pedido)", time: "3–5 días hábiles", w: "own" },
      { s: "Tostado de café", min: `${p.coffeeRoasterKgBatch} kg`, time: "3–5 días hábiles", w: "own" },
      { s: "Tostado de cacao", min: `${p.cocoaRoasterKgBatch} kg`, time: "3–5 días hábiles", w: "own" },
      { s: "Descascarillado y nibs", min: `${p.winnowerKgBatch} kg`, time: "3–5 días hábiles", w: "own" },
      { s: "Licor / pasta de cacao", min: `${p.refinerKgBatch} kg`, time: "5–7 días hábiles", w: "own" },
      { s: "Chocolate y cobertura (en bloque)", min: `${p.refinerKgBatch} kg`, time: "7–10 días hábiles", w: "own" },
      { s: "Pilado / trilla de café", min: "A cotizar", time: "A cotizar", w: "partner" },
      { s: "Polvo y manteca de cacao", min: "A cotizar", time: "A cotizar", w: "partner" },
      { s: "Temperado, moldeado y empaque", min: "A cotizar", time: "A cotizar", w: "partner" },
      { s: "Volumen recurrente (más de ~100 kg/semana)", min: "A cotizar", time: "A cotizar", w: "both" },
    ] as { s: string; min: string; time: string; w: "own" | "partner" | "both" }[],
    note: "* Plazos referenciales en días hábiles desde la recepción del grano y la aprobación de la muestra. Varían según la demanda, la carga de planta y la temporada (en cosecha pueden extenderse); el plazo definitivo se confirma en cada cotización.",
    equipmentTitle: "Equipamiento de planta propia",
    equipment: [
      { t: "Tostador de café", v: `${p.coffeeRoasterKgBatch} kg por lote` },
      { t: "Tostador de cacao", v: `${p.cocoaRoasterKgBatch} kg por lote` },
      { t: "Descascarillador", v: `${p.winnowerKgBatch} kg por lote` },
      { t: "Molino de cacao", v: "Licor y pasta" },
      { t: "Refinador", v: `${p.refinerKgBatch} kg por lote` },
    ],
    stepsTitle: "Cómo trabajamos",
    steps: [
      { t: "Muestra", d: "Desarrollamos una muestra con tu grano o el nuestro. Se cobra y se descuenta del primer pedido." },
      { t: "Aprobación", d: "Ajustamos perfil, granulometría o receta hasta que la apruebes." },
      { t: "Producción", d: "Procesamos el lote con registro de cada etapa y contramuestra." },
      { t: "Entrega", d: "En Ayacucho o con envío a Lima. Empaque con tu marca vía plantas aliadas." },
    ],
    grainTitle: "¿No tienes grano?",
    grainBody: "Lo ponemos nosotros. Abastecemos el café o cacao desde nuestra red de acopio y te entregamos el producto terminado.",
    faqTitle: "Preguntas sobre maquila",
    faq: [
      { q: "¿Qué pasa si mi pedido supera la capacidad de su planta?", a: "Lo derivamos a plantas aliadas con habilitación sanitaria. Tú sigues tratando con nosotros: un solo contacto, un solo responsable de la calidad." },
      { q: "¿Puedo llevar mi propio grano?", a: "Sí. Recibimos tu café o cacao, lo pesamos contigo y te entregamos el producto con el rendimiento registrado." },
      { q: "¿La planta tiene habilitación sanitaria?", a: "Sí. Es el requisito para que puedas tramitar el registro sanitario de tu producto con nosotros como fabricante." },
      { q: "¿Hacen chocolate en tabletas?", a: "En planta propia producimos chocolate y cobertura en bloque o a granel. El temperado, moldeado en tabletas y empaque lo hacemos con plantas aliadas." },
      { q: "¿Por qué se cobra la muestra?", a: "Porque implica un lote real de planta. El monto se descuenta íntegramente de tu primer pedido." },
    ],
    cta: "Cotizar maquila",
  },

  privateLabel: {
    eyebrow: "Marca privada",
    title: "Lanza tu marca de café o chocolate",
    subtitle: "Ponemos el grano, el proceso y la planta con habilitación sanitaria. Tú pones la marca. Ideal para tiendas, cafeterías, hoteles, emprendimientos y regalos corporativos.",
    productsTitle: "Qué puedes lanzar",
    products: [
      { t: "Café tostado de origen VRAEM", d: `En grano o molido, desde ${p.coffeeRoasterKgBatch} kg.` },
      { t: "Chocolate y cobertura", d: `Barras, bloques o granel, desde ${p.refinerKgBatch} kg.` },
      { t: "Nibs de cacao", d: `Snack o insumo para repostería, desde ${p.winnowerKgBatch} kg.` },
      { t: "Licor / pasta de cacao", d: `Para bebidas y repostería, desde ${p.refinerKgBatch} kg.` },
    ],
    stepsTitle: "De la idea al anaquel",
    steps: [
      { t: "Brief", d: "Nos cuentas tu producto, tu público, volumen y precio objetivo." },
      { t: "Desarrollo y muestras", d: "Proponemos perfil de tueste o receta y producimos muestras." },
      { t: "Producción", d: "Fabricamos en planta propia con habilitación sanitaria." },
      { t: "Empaque y etiquetado", d: "Con tu marca, a través de plantas aliadas." },
      { t: "Entrega", d: "En Ayacucho o con envío a Lima." },
    ],
    sanitaryTitle: "Registro sanitario",
    sanitaryBody: "Nuestra planta cuenta con habilitación sanitaria, requisito para que tramites el registro sanitario de tu producto ante DIGESA con nosotros como fabricante.",
    cta: "Quiero crear mi marca",
  },

  origin: {
    eyebrow: "Origen",
    title: "VRAEM: el valle de donde sale nuestro café y cacao",
    subtitle: `Nuestra red de acopio recorre el corredor ${from} – ${to}, a lo largo de los ríos Apurímac y Ene. Compramos directo a productores e intermediarios de la zona.`,
    mapTitle: "Corredor de acopio",
    mapNote: "Esquema referencial, no a escala.",
    pointsLabel: "puntos de acopio",
    howTitle: "Cómo compramos",
    how: [
      { t: "Precio del día", d: "Recalculamos el precio de compra cada mañana con la cotización internacional y el tipo de cambio." },
      { t: "Pago al contado", d: "Liquidación inmediata en el punto de acopio, con comprobante." },
      { t: "Balanza certificada", d: "Peso neto verificado frente al productor." },
      { t: "Relación de largo plazo", d: `La familia compra en el valle desde ${company.familyInTradeSince}. Conocemos a quién le compramos.` },
    ],
    calendarTitle: "Calendario de cosecha",
    calendar: [
      { t: "Café", d: "Abril – setiembre", detail: "1 200 – 1 900 msnm" },
      { t: "Cacao", d: "Todo el año", detail: "Pico de mayo a agosto" },
    ],
    cta: "Cotizar grano",
  },

  about: {
    eyebrow: "Nosotros",
    title: "Tres generaciones en café y cacao del VRAEM",
    subtitle: `Somos una empresa familiar de Ayacucho. Lo que empezó como acopio familiar en ${company.familyInTradeSince} es hoy una operación con red de acopio, planta propia y alianzas industriales.`,
    timelineTitle: "Nuestra historia",
    timeline: [
      { y: String(company.familyInTradeSince), t: "Los inicios", d: "La familia empieza a comprar café y cacao en el valle, de manera informal." },
      { y: String(company.foundedYear), t: "Nace la empresa", d: `Se constituye ${company.legalName} para formalizar y escalar el acopio.` },
      { y: "Hoy", t: "Del grano al producto", d: `Red de ${s.collectionPoints} puntos de acopio, hasta ${s.tonsPerYear} TM al año y planta propia con habilitación sanitaria.` },
    ],
    visitTitle: "Visítanos",
    visitBody: "Oficina, almacén y planta están en la misma dirección en Ayacucho. Recibimos a compradores y clientes de maquila que quieran ver el proceso antes de cerrar.",
    visitCta: "Coordinar visita",
  },

  quote: {
    eyebrow: "Cotizar",
    title: "Solicitar cotización o muestra",
    subtitle: "Elige qué necesitas y te pedimos solo los datos que hacen falta. Respondemos en 24–72 h.",
  },
};

const en: typeof es = {
  home: {
    hero: {
      badge: `${company.name} · VRAEM, Ayacucho`,
      title: "Coffee and cocoa from Peru’s VRAEM: from bean to finished product",
      subtitle: `A sourcing network at origin, a sanitary-licensed plant and partner plants. From ${p.coffeeRoasterKgBatch} kg up to ${s.tonsPerYear} MT a year.`,
      doorsTitle: "What do you need?",
      doors: [
        { key: "grain", t: "Buy beans", d: "Parchment coffee, export-grade coffee and cocoa in volume." },
        { key: "processing", t: "Process my product", d: "Coffee and cocoa toll processing from 5 kg." },
        { key: "brand", t: "Build my brand", d: "Coffee or chocolate under your label, ready to sell." },
        { key: "eudr", t: "EUDR traceability", d: "Geolocation and due-diligence files for cooperatives." },
      ],
      imageAlt: "Apurímac River Valley, VRAEM",
      imageTag: "Origin",
      imageCaption: "Apurímac, Ene and Mantaro river valleys",
    },
    stats: {
      family: "Family in coffee and cocoa",
      founded: "Company incorporated",
      tons: "MT a year · coffee + cocoa",
      points: "Buying points",
      plant: "Sanitary-licensed plant",
      since: "Since",
    },
    chain: {
      eyebrow: "Capacity",
      title: "One operation, from valley to dispatch",
      subtitle: "We control every stage. Whatever our own plant doesn’t do, we handle through partner plants — you never coordinate with anyone else.",
      steps: [
        { t: "Sourcing network", d: `${s.collectionPoints} buying points between ${from} and ${to}, with intermediaries and growers.` },
        { t: "Quality control", d: "Moisture, cut test and a retained sample for every lot." },
        { t: "Own plant", d: "Coffee and cocoa roasting, nibs, liquor, paste and chocolate." },
        { t: "Partner plants", d: "Hulling, cocoa powder, packaging and volume orders." },
        { t: "Dispatch", d: "EXW Ayacucho, delivered Lima, or FOB Callao via a partner export house." },
      ],
    },
    products: {
      eyebrow: "Products",
      title: "What we can deliver",
      subtitle: "Beans in volume and derivatives ready for your process or your brand.",
      items: [
        { slug: "coffee", t: "Parchment and export coffee", d: "Commercial and export grade. Lots from 1 MT." },
        { slug: "cocoa", t: "Cocoa beans", d: "CCN-51 and common bean, verified fermentation. Lots from 1 MT." },
        { slug: "derivatives", t: "Cocoa derivatives", d: "Nibs, liquor, paste and chocolate. From 25 kg." },
        { slug: "derivatives", t: "Roasted coffee", d: "Whole bean or ground, profiled per lot. From 5 kg." },
      ],
      spec: "View spec sheet",
      sample: "Request a sample",
    },
    maquila: {
      eyebrow: "Toll processing",
      title: `Coffee and cocoa toll processing from ${p.coffeeRoasterKgBatch} kg`,
      subtitle: "Roasting, nibs, liquor, paste and chocolate in our own plant. Hulling, powder and packaging through partner plants. One contact for the whole process.",
      seal: "Sanitary-licensed plant",
      cta: "See toll-processing services",
      figures: [
        { v: `${p.coffeeRoasterKgBatch} kg`, l: "coffee roasting batch" },
        { v: `${p.cocoaRoasterKgBatch} kg`, l: "cocoa roasting batch" },
        { v: `${p.refinerKgBatch} kg`, l: "liquor or chocolate batch" },
      ],
    },
    origin: {
      eyebrow: "Origin",
      title: "We buy where the bean is grown",
      subtitle: `A network of ${s.collectionPoints} buying points along the ${from} – ${to} corridor, in the heart of the VRAEM.`,
      cta: "Explore the origin",
    },
    eudr: {
      eyebrow: "For cooperatives",
      title: "Is your cooperative ready for EUDR?",
      subtitle: "The EU Deforestation Regulation applies from 30 December 2026. We help you geolocate plots and build the due-diligence file for every lot.",
      cta: "Request a free assessment",
      more: "How it works",
    },
    market: {
      eyebrow: "Market",
      title: "Prices and market notes",
      subtitle: "International and local buying prices are updated daily in the top bar. Every week we publish what is moving the market.",
      cta: "See all notes",
      empty: "Our market notes are coming soon.",
    },
    quote: {
      title: "Tell us what you need",
      subtitle: "We reply within 24–72 h. Prefer WhatsApp? Message us there.",
    },
  },

  products: {
    back: "Back to products",
    sample: "Request a sample",
    quote: "Get a quote",
    specTitle: "Spec sheet",
    moqLabel: "Minimum order",
    coffee: {
      eyebrow: "Coffee",
      title: "Parchment and export-grade coffee from the VRAEM",
      subtitle: "Commercial and export-grade coffee grown at 1,200–1,900 masl, sourced through our origin network and checked lot by lot.",
      moq: "Lots from 1 MT",
      offers: [
        { t: "Commercial parchment", d: "In volume, 69 kg jute bags. Sold EXW Ayacucho or delivered Lima." },
        { t: "Export-grade coffee", d: "Hulled to green at a partner plant and exported FOB Callao through a partner export house." },
        { t: "Specialty on request", d: "82+ SCA lots when a buyer requests them and the valley has availability." },
      ],
    },
    cocoa: {
      eyebrow: "Cocoa",
      title: "CCN-51 and common cocoa beans",
      subtitle: "Dried VRAEM cocoa with fermentation and moisture verified for every lot. Available year-round, peaking May to August.",
      moq: "Lots from 1 MT",
      offers: [
        { t: "CCN-51", d: "High yield for industry. 64 kg jute bags." },
        { t: "Common / regional blend", d: "Typical VRAEM profile, for liquor and chocolate." },
        { t: "Fine flavour on request", d: "Subject to valley availability and buyer requirements." },
      ],
    },
    derivatives: {
      eyebrow: "Derivatives",
      title: "Cocoa derivatives and roasted coffee",
      subtitle: "Made in our sanitary-licensed plant from beans sourced through our own network. Anything that needs other equipment, we handle with partner plants.",
      items: [
        { t: "Cocoa nibs", d: "Roasted and winnowed.", moq: `From ${p.winnowerKgBatch} kg`, own: true },
        { t: "Cocoa liquor / paste", d: "100% cocoa, refined.", moq: `From ${p.refinerKgBatch} kg`, own: true },
        { t: "Chocolate and couverture", d: "In blocks or bulk. Tempering and moulding through partner plants.", moq: `From ${p.refinerKgBatch} kg`, own: true },
        { t: "Roasted coffee", d: "Whole bean or ground, roast profile per lot.", moq: `From ${p.coffeeRoasterKgBatch} kg`, own: true },
        { t: "Cocoa powder and butter", d: "Pressed at a partner plant.", moq: "On quote", own: false },
      ],
      ownLabel: "Own plant",
      partnerLabel: "Partner plant",
    },
  },

  maquila: {
    eyebrow: "Toll processing",
    title: "Coffee and cocoa toll processing: from 5 kg to industrial volume",
    subtitle: "We process your coffee or cocoa in our own sanitary-licensed plant. For hulling, powder, packaging or larger volumes we work with partner plants — one contact, one party accountable.",
    seal: "Sanitary-licensed plant",
    tableTitle: "Services, minimums and lead times",
    cols: { service: "Service", min: "From", time: "Indicative lead time*", where: "Where" },
    own: "Own plant",
    partner: "Partner plants",
    both: "Own + partners",
    rows: [
      { s: "Sample or product development", min: "1–5 kg (charged, credited to first order)", time: "3–5 business days", w: "own" },
      { s: "Coffee roasting", min: `${p.coffeeRoasterKgBatch} kg`, time: "3–5 business days", w: "own" },
      { s: "Cocoa roasting", min: `${p.cocoaRoasterKgBatch} kg`, time: "3–5 business days", w: "own" },
      { s: "Winnowing and nibs", min: `${p.winnowerKgBatch} kg`, time: "3–5 business days", w: "own" },
      { s: "Cocoa liquor / paste", min: `${p.refinerKgBatch} kg`, time: "5–7 business days", w: "own" },
      { s: "Chocolate and couverture (block)", min: `${p.refinerKgBatch} kg`, time: "7–10 business days", w: "own" },
      { s: "Coffee hulling", min: "On quote", time: "On quote", w: "partner" },
      { s: "Cocoa powder and butter", min: "On quote", time: "On quote", w: "partner" },
      { s: "Tempering, moulding and packaging", min: "On quote", time: "On quote", w: "partner" },
      { s: "Recurring volume (over ~100 kg/week)", min: "On quote", time: "On quote", w: "both" },
    ],
    note: "* Indicative lead times in business days from receipt of beans and sample approval. They vary with demand, plant load and season (they may extend during harvest); the final lead time is confirmed with each quote.",
    equipmentTitle: "Own-plant equipment",
    equipment: [
      { t: "Coffee roaster", v: `${p.coffeeRoasterKgBatch} kg per batch` },
      { t: "Cocoa roaster", v: `${p.cocoaRoasterKgBatch} kg per batch` },
      { t: "Winnower", v: `${p.winnowerKgBatch} kg per batch` },
      { t: "Cocoa mill", v: "Liquor and paste" },
      { t: "Refiner", v: `${p.refinerKgBatch} kg per batch` },
    ],
    stepsTitle: "How we work",
    steps: [
      { t: "Sample", d: "We develop a sample from your beans or ours. It is charged and credited to your first order." },
      { t: "Approval", d: "We adjust profile, particle size or recipe until you approve it." },
      { t: "Production", d: "We process the lot, logging every stage and keeping a retained sample." },
      { t: "Delivery", d: "In Ayacucho or shipped to Lima. Branded packaging through partner plants." },
    ],
    grainTitle: "No beans?",
    grainBody: "We supply them. We source the coffee or cocoa from our own network and deliver the finished product.",
    faqTitle: "Toll-processing questions",
    faq: [
      { q: "What if my order exceeds your plant’s capacity?", a: "We route it to sanitary-licensed partner plants. You keep dealing with us: one contact, one party accountable for quality." },
      { q: "Can I bring my own beans?", a: "Yes. We receive your coffee or cocoa, weigh it with you and deliver the product with the recorded yield." },
      { q: "Is the plant sanitary-licensed?", a: "Yes. That is what allows you to register your product with the health authority (DIGESA) with us as manufacturer." },
      { q: "Do you make chocolate bars?", a: "Our own plant produces chocolate and couverture in blocks or bulk. Tempering, bar moulding and packaging are done through partner plants." },
      { q: "Why is the sample charged?", a: "Because it is a real plant run. The full amount is credited to your first order." },
    ],
    cta: "Get a toll-processing quote",
  },

  privateLabel: {
    eyebrow: "Private label",
    title: "Launch your own coffee or chocolate brand",
    subtitle: "We bring the beans, the process and a sanitary-licensed plant. You bring the brand. Ideal for shops, cafés, hotels, start-ups and corporate gifts.",
    productsTitle: "What you can launch",
    products: [
      { t: "VRAEM single-origin roasted coffee", d: `Whole bean or ground, from ${p.coffeeRoasterKgBatch} kg.` },
      { t: "Chocolate and couverture", d: `Bars, blocks or bulk, from ${p.refinerKgBatch} kg.` },
      { t: "Cocoa nibs", d: `Snack or baking ingredient, from ${p.winnowerKgBatch} kg.` },
      { t: "Cocoa liquor / paste", d: `For drinks and baking, from ${p.refinerKgBatch} kg.` },
    ],
    stepsTitle: "From idea to shelf",
    steps: [
      { t: "Brief", d: "Tell us your product, audience, volume and target price." },
      { t: "Development and samples", d: "We propose a roast profile or recipe and produce samples." },
      { t: "Production", d: "Made in our own sanitary-licensed plant." },
      { t: "Packaging and labelling", d: "Under your brand, through partner plants." },
      { t: "Delivery", d: "In Ayacucho or shipped to Lima." },
    ],
    sanitaryTitle: "Product registration",
    sanitaryBody: "Our plant holds a sanitary licence, which is what you need to register your product with DIGESA (Peru’s health authority) with us as manufacturer.",
    cta: "I want to build my brand",
  },

  origin: {
    eyebrow: "Origin",
    title: "VRAEM: the valley our coffee and cocoa come from",
    subtitle: `Our sourcing network runs along the ${from} – ${to} corridor, following the Apurímac and Ene rivers. We buy directly from local growers and intermediaries.`,
    mapTitle: "Sourcing corridor",
    mapNote: "Schematic, not to scale.",
    pointsLabel: "buying points",
    howTitle: "How we buy",
    how: [
      { t: "Daily price", d: "We recalculate our buying price every morning from the international quote and exchange rate." },
      { t: "Cash payment", d: "Paid on the spot at the buying point, with a receipt." },
      { t: "Certified scale", d: "Net weight verified in front of the grower." },
      { t: "Long-term relationships", d: `The family has bought in the valley since ${company.familyInTradeSince}. We know who we buy from.` },
    ],
    calendarTitle: "Harvest calendar",
    calendar: [
      { t: "Coffee", d: "April – September", detail: "1,200 – 1,900 masl" },
      { t: "Cocoa", d: "Year-round", detail: "Peak May to August" },
    ],
    cta: "Get a quote for beans",
  },

  about: {
    eyebrow: "About us",
    title: "Three generations in VRAEM coffee and cocoa",
    subtitle: `We are a family business from Ayacucho. What began as family buying in ${company.familyInTradeSince} is now an operation with a sourcing network, its own plant and industrial partners.`,
    timelineTitle: "Our story",
    timeline: [
      { y: String(company.familyInTradeSince), t: "The beginning", d: "The family starts buying coffee and cocoa in the valley, informally." },
      { y: String(company.foundedYear), t: "The company is born", d: `${company.legalName} is incorporated to formalise and scale sourcing.` },
      { y: "Today", t: "From bean to product", d: `A network of ${s.collectionPoints} buying points, up to ${s.tonsPerYear} MT a year and our own sanitary-licensed plant.` },
    ],
    visitTitle: "Visit us",
    visitBody: "Office, warehouse and plant share one address in Ayacucho. We host buyers and toll-processing clients who want to see the process before closing.",
    visitCta: "Arrange a visit",
  },

  quote: {
    eyebrow: "Quote",
    title: "Request a quote or sample",
    subtitle: "Choose what you need and we only ask for the details that matter. We reply within 24–72 h.",
  },
};

export const pages: Record<Locale, typeof es> = { es, en };

/** Rutas del sitio (sin prefijo de idioma). */
export const routes = {
  coffee: "/products/coffee",
  cocoa: "/products/cocoa",
  derivatives: "/products/derivatives",
  maquila: "/maquila",
  privateLabel: "/private-label",
  traceability: "/traceability",
  origin: "/origin",
  market: "/blog",
  about: "/about",
  quote: "/quote",
} as const;

/** Página de destino de cada "puerta" del home. */
export const needRoute: Record<NeedKey, string> = {
  grain: "#products",
  processing: routes.maquila,
  brand: routes.privateLabel,
  eudr: routes.traceability,
};

export const quoteHref = (locale: Locale, need?: NeedKey) =>
  `/${locale}${routes.quote}${need ? `?need=${need}` : ""}`;
