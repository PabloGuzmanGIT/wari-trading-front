'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { translations } from '@/locales/translations';
import { routes, quoteHref } from '@/locales/pages';
import { company } from '@/lib/company';
import { FiDownload, FiMenu, FiX, FiLock, FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

export const Header: React.FC = () => {
  const params = useParams();
  const rawLocale = params?.locale as string;
  const locale = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const t = translations[locale].nav;

  const pathname = usePathname() || '';
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt as (Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }) | null;
    if (!promptEvent) return;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const changeLocale = (newLocale: 'es' | 'en') => {
    if (newLocale === locale) return;
    const pathParts = pathname.split('/');
    pathParts[1] = newLocale;
    router.push(pathParts.join('/'));
  };

  const L = (path: string) => `/${locale}${path}`;

  const nav: (NavItem | NavGroup)[] = [
    {
      label: t.products,
      items: [
        { label: t.coffee, href: L(routes.coffee) },
        { label: t.cocoa, href: L(routes.cocoa) },
        { label: t.derivatives, href: L(routes.derivatives) },
      ],
    },
    {
      label: t.services,
      items: [
        { label: t.maquila, href: L(routes.maquila) },
        { label: t.privateLabel, href: L(routes.privateLabel) },
        { label: t.traceability, href: L(routes.traceability) },
      ],
    },
    { label: t.origin, href: L(routes.origin) },
    { label: t.market, href: L(routes.market) },
    { label: t.about, href: L(routes.about) },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const linkCls = (active: boolean) =>
    `font-medium text-sm transition-colors no-underline ${active ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-600'}`;

  const waHref = company.whatsapp ? `https://wa.me/${company.whatsapp}` : null;

  return (
    <header className="nav-blur w-full border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto safe-x h-16 flex items-center justify-between gap-4">

        <Link href={`/${locale}`} className="flex items-center gap-2.5 cursor-pointer no-underline group flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#0f172a] flex items-center justify-center text-white font-extrabold text-base transition-transform duration-200 group-hover:-translate-y-0.5">
            {company.name.slice(0, 1)}
          </div>
          <span className="font-headings font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
            {company.name}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label={locale === 'es' ? 'Principal' : 'Main'}>
          {nav.map((item) =>
            'items' in item ? (
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  aria-haspopup="true"
                  className={`${linkCls(item.items.some((i) => isActive(i.href)))} inline-flex items-center gap-1 cursor-pointer`}
                >
                  {item.label}
                  <FiChevronDown size={14} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                {/* pt-3 deja un "puente" para que el hover no se corte al bajar el mouse */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity">
                  <div className="w-64 rounded-xl border border-slate-200 bg-white shadow-xl p-2">
                    {item.items.map((sub) => (
                      <Link key={sub.href} href={sub.href} className={`block rounded-lg px-3 py-2.5 hover:bg-emerald-50 ${linkCls(isActive(sub.href))}`}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkCls(isActive(item.href))}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-100/80 rounded-full p-1 border border-slate-200/50">
            <button onClick={() => changeLocale('es')} className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${locale === 'es' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>ES</button>
            <button onClick={() => changeLocale('en')} className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${locale === 'en' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>EN</button>
          </div>

          {isInstallable && (
            <button onClick={handleInstallClick} className="hidden xl:inline-flex border border-slate-300 hover:border-slate-400 text-slate-600 font-medium text-xs px-3.5 py-2 rounded-full items-center gap-1.5 transition-colors cursor-pointer">
              <FiDownload size={14} />
              {t.installApp}
            </button>
          )}

          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full text-[#1da851] hover:bg-slate-100 transition-colors">
              <FaWhatsapp size={18} />
            </a>
          )}

          <Link href={quoteHref(locale)} className="hidden sm:inline-flex btn-primary !text-xs !py-2 !px-4 no-underline">
            {t.contact}
          </Link>

          <Link
            href={`/${locale}/portal`}
            title={t.portal}
            aria-label={t.portal}
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FiLock size={15} />
          </Link>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Menu" aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 safe-x py-4 shadow-lg absolute w-full left-0 z-40 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
          {nav.map((item) =>
            'items' in item ? (
              <div key={item.label} className="py-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2 pb-1">{item.label}</div>
                {item.items.map((sub) => (
                  <Link key={sub.href} href={sub.href} onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline">
                    {sub.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 font-semibold py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline">
                {item.label}
              </Link>
            ),
          )}
          <Link href={quoteHref(locale)} onClick={() => setMobileMenuOpen(false)} className="flex justify-center btn-primary w-full py-2.5 rounded-lg no-underline mt-3">
            {t.contact}
          </Link>
          <Link
            href={`/${locale}/portal`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-1.5 text-slate-400 text-xs font-medium py-2 px-3 no-underline mt-1"
          >
            <FiLock size={13} />
            {t.portal}
          </Link>
        </div>
      )}
    </header>
  );
};
