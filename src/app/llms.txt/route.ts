import { company, SITE_URL, sameAs } from '@/lib/company';

export const dynamic = 'force-static';

export function GET() {
  const lines = [
    `# ${company.name} (${company.legalName})`,
    '',
    company.description.es,
    '',
    '## Qué ofrecemos',
    '- Abastecimiento de origen: café pergamino en volumen y cacao (CCN-51 y corriente) del VRAEM. Producto comercial. Lotes de especialidad bajo pedido.',
    '- Maquila a pequeña escala: tostado, pilado, molienda, derivados y empaque de café y cacao.',
    '- Marca propia de café tostado y cacao del VRAEM.',
    '',
    '## Datos',
    `- Zona de operación: VRAEM, Ayacucho, Perú (oficina: ${company.address.street}, ${company.address.locality})`,
    `- Capacidad de abastecimiento: hasta ${company.stats.tonsPerYear} TM al año (≈ ${company.stats.coffeeTonsPerYear} TM café pergamino, ${company.stats.cocoaTonsPerYear} TM cacao)`,
    `- Oficina, almacén y planta en una sola dirección en Ayacucho; se reciben visitas de compradores`,
    `- Canal de venta actual: casas exportadoras en Perú (objetivo: exportación directa)`,
    `- Café: se comercializa en pergamino; la exportación como café oro se realiza trillado vía casa exportadora (FOB Callao)`,
    `- Cacao: CCN-51 y cacao corriente / mezcla regional`,
    `- Certificaciones: se comercializa producto convencional; los lotes orgánicos / comercio justo se gestionan bajo pedido conectando al comprador con organizaciones certificadas del VRAEM`,
    `- Trazabilidad: identificación por lote; se puede preparar documentación de debida diligencia EUDR para compradores de la UE`,
    `- Trayectoria: empresa familiar constituida en 2009; la familia opera en café y cacao en el VRAEM desde los años 60`,
    company.ruc ? `- RUC: ${company.ruc}` : null,
    `- Email (Perú / local): ${company.email.es}`,
    `- Email (internacional / fuera de Perú): ${company.email.en}`,
    company.phone ? `- Teléfono: ${company.phone}` : null,
    company.whatsapp ? `- WhatsApp: https://wa.me/${company.whatsapp}` : null,
    '',
    '## Enlaces',
    `- Inicio (ES): ${SITE_URL}/es`,
    `- Home (EN): ${SITE_URL}/en`,
    `- Trazabilidad y EUDR: ${SITE_URL}/es/traceability`,
    `- Notas de mercado / blog: ${SITE_URL}/es/blog`,
    ...sameAs.map((u) => `- ${u}`),
    '',
    '## Contacto',
    `Solicitudes de cotización y muestra: ${SITE_URL}/es#contact`,
    '',
  ].filter((l) => l !== null);

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
