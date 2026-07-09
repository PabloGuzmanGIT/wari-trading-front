'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { translations } from '@/locales/translations';
import { useAuth } from '@/context/AuthContext';
import { FiGlobe, FiDownload, FiUser, FiMenu, FiX, FiActivity, FiLogOut } from 'react-icons/fi';

export const Header: React.FC = () => {
  const params = useParams();
  const rawLocale = params?.locale as string;
  const locale = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const t = translations[locale].nav;

  const pathname = usePathname() || '';
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // PWA Instalador State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verificar si ya está instalada (en modo standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const changeLocale = (newLocale: 'es' | 'en') => {
    if (newLocale === locale) return;
    const pathParts = pathname.split('/');
    // pathParts[0] es vacío "", pathParts[1] es el locale
    pathParts[1] = newLocale;
    router.push(pathParts.join('/'));
  };

  // Crear links dinámicos según el idioma
  const getLink = (hash: string) => {
    return `/${locale}${hash}`;
  };

  return (
    <header className="nav-blur w-full border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Marca */}
        <Link href={getLink('')} className="flex items-center gap-2.5 cursor-pointer no-underline group">
          <div className="w-10 h-10 rounded-xl gradient-bg-brand flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
            <FiGlobe size={20} className="animate-[spin_10s_linear_infinite]" />
          </div>
          <span className="font-headings font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 flex items-center gap-1">
            WARI <span className="bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-cyan-600 transition-all duration-500">TRADING</span>
          </span>
        </Link>

        {/* Navegación Escritorio */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href={getLink('#about')} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline">
            {t.about}
          </Link>
          <Link href={getLink('#products')} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline">
            {t.products}
          </Link>
          <Link href={`/${locale}/demand-board`} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline">
            {t.demands}
          </Link>
          <Link href={`/${locale}/traceability`} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline">
            {t.traceability}
          </Link>
          <Link href={`/${locale}/blog`} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline">
            {t.blog}
          </Link>
          <Link href={`/${locale}/portal`} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline flex items-center gap-1.5 group">
            <FiUser size={14} />
            <span>{user ? `${t.portal} (${user.role})` : t.portal}</span>
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 px-1.5 py-0.5 rounded-full uppercase tracking-wide transition-colors">
              {locale === 'es' ? 'Comprar / Vender' : 'Buy / Sell'}
            </span>
          </Link>
          {/* Logout rápido cuando hay sesión activa */}
          {user && (
            <button
              onClick={logout}
              title={locale === 'es' ? 'Cerrar Sesión' : 'Log Out'}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-bold transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <FiLogOut size={14} />
              <span className="hidden xl:inline">{locale === 'es' ? 'Salir' : 'Logout'}</span>
            </button>
          )}
        </nav>

        {/* Controles de Cabecera (Idioma, Instalar, Cotizar, Móvil) */}
        <div className="flex items-center gap-3">
          
          {/* Selector de Idioma */}
          <div className="flex items-center bg-slate-100/80 rounded-full p-1 border border-slate-200/50">
            <button
              onClick={() => changeLocale('es')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                locale === 'es' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => changeLocale('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                locale === 'en' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>

          {/* Botón PWA Instalable */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="hidden md:inline-flex bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs px-3.5 py-2 rounded-full items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <FiDownload size={14} />
              {t.installApp}
            </button>
          )}

          {/* Botón de Contacto Rápido */}
          <Link href={getLink('#contact')} className="hidden sm:inline-flex btn-primary !text-xs !py-2 !px-4 no-underline">
            {t.contact}
          </Link>

          {/* Selector Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg absolute w-full left-0 z-40">
          <Link
            href={getLink('#about')}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline"
          >
            {t.about}
          </Link>
          <Link
            href={getLink('#products')}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline"
          >
            {t.products}
          </Link>
          <Link
            href={`/${locale}/demand-board`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline"
          >
            {t.demands}
          </Link>
          <Link
            href={`/${locale}/traceability`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline"
          >
            {t.traceability}
          </Link>
          <Link
            href={`/${locale}/blog`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline"
          >
            {t.blog}
          </Link>
          <Link
            href={`/${locale}/portal`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline group"
          >
            <span>{t.portal}</span>
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              {locale === 'es' ? 'Comprar / Vender' : 'Buy / Sell'}
            </span>
          </Link>

          {user && (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-red-500 font-medium py-2.5 px-3 hover:bg-red-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <FiLogOut size={16} />
              <span>{locale === 'es' ? 'Cerrar Sesión' : 'Log Out'}</span>
            </button>
          )}

          {isInstallable && (
            <button
              onClick={() => {
                handleInstallClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FiDownload size={14} />
              {t.installApp}
            </button>
          )}

          <Link
            href={getLink('#contact')}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center btn-primary w-full py-2.5 rounded-lg no-underline"
          >
            {t.contact}
          </Link>
        </div>
      )}
    </header>
  );
};
