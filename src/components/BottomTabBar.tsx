'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { translations } from '@/locales/translations';
import { FiHome, FiMapPin, FiPackage, FiShield, FiMail } from 'react-icons/fi';

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname() || '';
  const params = useParams();
  const rawLocale = params?.locale as string;
  const locale = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const t = translations[locale].nav;

  const [mounted, setMounted] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setMounted(true);
      setCurrentHash(window.location.hash);
    };
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  if (!mounted) return null;

  const items = [
    { label: locale === 'es' ? 'Inicio' : 'Home', href: `/${locale}`, icon: FiHome, exact: true },
    { label: t.sourcing, href: `/${locale}#sourcing`, icon: FiMapPin, exact: false },
    { label: t.maquila, href: `/${locale}#maquila`, icon: FiPackage, exact: false },
    { label: locale === 'es' ? 'EUDR' : 'EUDR', href: `/${locale}/traceability`, icon: FiShield, exact: false },
    { label: locale === 'es' ? 'Cotizar' : 'Quote', href: `/${locale}#contact`, icon: FiMail, exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      return pathname === path && currentHash === `#${hash}`;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,12px)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <nav className="flex justify-around items-center h-14 max-w-md mx-auto px-2" aria-label="Mobile Navigation">
        {items.map((item, index) => {
          const TabIcon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] rounded-xl text-center transition-all duration-200 ${active ? 'text-emerald-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <TabIcon size={20} className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
