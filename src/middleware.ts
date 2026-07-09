import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Evitar interceptar archivos estáticos, apis y recursos de next (como favicon, manifest, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return;
  }

  // Comprobar si el pathname ya tiene un idioma soportado
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Obtener el idioma del navegador o usar el por defecto
  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase();
    if (locales.includes(preferredLocale)) {
      locale = preferredLocale;
    }
  }

  // Redirigir a la URL con el idioma
  const targetPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  request.nextUrl.pathname = targetPath;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Interceptar todos los paths excepto los que contengan "." (archivos) u otros excluidos
    '/((?!_next|api|favicon.ico|manifest.json|sw.js|.*\\.).*)',
  ],
};
