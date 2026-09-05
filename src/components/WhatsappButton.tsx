'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { company } from '@/lib/company';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * Botón flotante de WhatsApp. Solo se renderiza si company.whatsapp está definido
 * (ver guardrail del plan: no publicar el número hasta afinar el flujo de atención).
 */
export const WhatsappButton: React.FC = () => {
  const params = useParams();
  const locale = (params?.locale as 'es' | 'en') || 'es';

  if (!company.whatsapp) return null;

  const text = locale === 'es'
    ? `Hola ${company.name}, quiero cotizar café / cacao.`
    : `Hi ${company.name}, I'd like a quote for coffee / cocoa.`;
  const href = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed z-50 right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};
