import { company, SITE_URL, sameAs } from '@/lib/company';

export const dynamic = 'force-static';

export function GET() {
  const lines = [
    `# ${company.name} (${company.legalName})`,
    '',
    company.description.es,
    '',
    '## Qué ofrecemos',
    '- Abastecimiento de origen: café pergamino comercial y de exportación, y cacao (CCN-51 y corriente) del VRAEM, en lotes desde 1 TM. Especialidad / fino de aroma bajo pedido.',
    `- Maquila de café y cacao en planta propia con habilitación sanitaria: tostado de café desde ${company.plant.coffeeRoasterKgBatch} kg; tostado de cacao (${company.plant.cocoaRoasterKgBatch} kg/lote), descascarillado y nibs, licor, pasta y chocolate/cobertura desde ${company.plant.refinerKgBatch} kg.`,
    '- Con plantas aliadas con habilitación sanitaria: pilado de café, polvo y manteca de cacao, temperado/moldeado, empaque y pedidos de volumen.',
    '- Marca privada: café tostado, chocolate, nibs y licor de cacao con la marca del cliente.',
    '- Trazabilidad EUDR para cooperativas: geolocalización de parcelas y expediente por lote.',
    '',
    '## Datos',
    `- Zona de operación: VRAEM — red de ${company.stats.collectionPoints} puntos de acopio (intermediarios y productores) entre ${company.origin.corridor.from} y ${company.origin.corridor.to}`,
    `- Oficina, almacén y planta: ${company.address.street}, ${company.address.locality}; se reciben visitas de compradores`,
    `- Capacidad de abastecimiento: hasta ${company.stats.tonsPerYear} TM al año entre café y cacao`,
    `- Canal de venta: casas exportadoras en Perú, industria y marcas; exportación FOB Callao vía casa exportadora aliada`,
    `- Certificaciones: producto convencional; lotes orgánicos / comercio justo se gestionan bajo pedido con organizaciones certificadas del VRAEM`,
    `- Trayectoria: la familia opera en café y cacao en el VRAEM desde ${company.familyInTradeSince}; empresa constituida en ${company.foundedYear}`,
    company.ruc ? `- RUC: ${company.ruc}` : null,
    `- Email (Perú / local): ${company.email.es}`,
    `- Email (internacional / fuera de Perú): ${company.email.en}`,
    company.phone ? `- Teléfono: ${company.phone}` : null,
    company.whatsapp ? `- WhatsApp: https://wa.me/${company.whatsapp}` : null,
    '',
    '## Enlaces',
    `- Inicio (ES): ${SITE_URL}/es`,
    `- Home (EN): ${SITE_URL}/en`,
    `- Café: ${SITE_URL}/es/products/coffee`,
    `- Cacao: ${SITE_URL}/es/products/cocoa`,
    `- Derivados y café tostado: ${SITE_URL}/es/products/derivatives`,
    `- Maquila: ${SITE_URL}/es/maquila`,
    `- Marca privada: ${SITE_URL}/es/private-label`,
    `- Origen VRAEM: ${SITE_URL}/es/origin`,
    `- Trazabilidad y EUDR: ${SITE_URL}/es/traceability`,
    `- Nosotros: ${SITE_URL}/es/about`,
    `- Notas de mercado: ${SITE_URL}/es/blog`,
    ...sameAs.map((u) => `- ${u}`),
    '',
    '## Contacto',
    `Solicitudes de cotización y muestra: ${SITE_URL}/es/quote`,
    '',
  ].filter((l) => l !== null);

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
