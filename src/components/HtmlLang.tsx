'use client';

import { useEffect } from 'react';
import type { Locale } from '@/locales/translations';

/**
 * Alinea <html lang> con el idioma real de la ruta.
 *
 * El layout raíz fija lang="es" porque no puede leer el segmento [locale].
 * Aquí lo corregimos a "en" en /en/*. El hreflang del <head> ya distingue
 * es/en de cara a Google; esto es para lectores de pantalla y la detección
 * de idioma del navegador.
 *
 * - Carga dura (visita directa / refresco): el <script> corre durante el
 *   parseo del HTML, antes del primer pintado (sin flash).
 * - Navegación cliente (<Link>): el useEffect lo ajusta al cambiar de locale.
 *
 * El truco de `type` evita el aviso de React en dev por renderizar <script>:
 * en servidor es ejecutable, en cliente es inerte (lo maneja el useEffect).
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
      }}
    />
  );
}
