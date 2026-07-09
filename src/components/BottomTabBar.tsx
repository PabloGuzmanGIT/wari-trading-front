'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { useAuth } from '@/context/AuthContext';
import { 
  FiHome, 
  FiPackage, 
  FiClipboard, 
  FiTrendingUp, 
  FiUser 
} from 'react-icons/fi';

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname() || '';
  const params = useParams();
  const rawLocale = params?.locale as string;
  const locale = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const t = translations[locale].nav;
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    setMounted(true);
    const updateHash = () => setCurrentHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  if (!mounted) return null;

  // Lista de pestañas de navegación para móviles
  const navigationItems: {
    label: string;
    sublabel?: string;
    href: string;
    icon: React.ElementType;
    exact: boolean;
  }[] = [
    {
      label: locale === 'es' ? 'Inicio' : 'Home',
      href: `/${locale}`,
      icon: FiHome,
      exact: true,
    },
    {
      label: t.products || (locale === 'es' ? 'Catálogo' : 'Catalog'),
      href: `/${locale}#products`,
      icon: FiPackage,
      exact: false,
    },
    {
      label: t.demands || (locale === 'es' ? 'B2B' : 'B2B'),
      href: `/${locale}/demand-board`,
      icon: FiClipboard,
      exact: false,
    },
    {
      label: t.traceability || (locale === 'es' ? 'Trazabilidad' : 'Traceability'),
      href: `/${locale}/traceability`,
      icon: FiTrendingUp,
      exact: false,
    },
    {
      label: user ? (locale === 'es' ? 'Portal' : 'Portal') : (locale === 'es' ? 'Ingreso' : 'Login'),
      sublabel: locale === 'es' ? 'Comprar/Vender' : 'Buy/Sell',
      href: `/${locale}/portal`,
      icon: FiUser,
      exact: false,
    },
  ];

  // Comprobar si una pestaña está activa
  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    // Para anchors como #products, no coinciden exactamente con pathname, sino con el hash.
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      return pathname === path && currentHash === `#${hash}`;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,12px)] transition-all duration-300">
      <nav className="flex justify-around items-center h-14 max-w-md mx-auto px-2" aria-label="Mobile Navigation">
        {navigationItems.map((item, index) => {
          const TabIcon = item.icon;
          const active = isActive(item.href, item.exact);
          
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] rounded-xl text-center transition-all duration-200 ${
                active 
                  ? 'text-emerald-600 font-semibold' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative p-1">
                <TabIcon size={20} className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-none">
                {item.label}
              </span>
              {item.sublabel && (
                <span className="text-[8px] font-semibold text-emerald-500 leading-none mt-0.5">
                  {item.sublabel}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
