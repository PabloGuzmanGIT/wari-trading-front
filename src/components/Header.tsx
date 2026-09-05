'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { translations } from '@/locales/translations';
import { company } from '@/lib/company';
import { FiDownload, FiMenu, FiX, FiLock } from 'react-icons/fi';

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

  const anchors: { label: string; hash: string }[] = [
    { label: t.offer, hash: '#offer' },
    { label: t.sourcing, hash: '#sourcing' },
    { label: t.specs, hash: '#specs' },
    { label: t.maquila, hash: '#maquila' },
    { label: t.faq, hash: '#faq' },
  ];

  const routes: { label: string; href: string }[] = [
    { label: t.traceability, href: `/${locale}/traceability` },
    { label: t.blog, href: `/${locale}/blog` },
  ];

  return (
    <header className="nav-blur w-full border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto safe-x h-16 flex items-center justify-between">

        <Link href={`/${locale}`} className="flex items-center gap-2.5 cursor-pointer no-underline group">
          <div className="w-9 h-9 rounded-lg bg-[#0f172a] flex items-center justify-center text-white font-extrabold text-base transition-transform duration-200 group-hover:-translate-y-0.5">
            {company.name.slice(0, 1)}
          </div>
          <span className="font-headings font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
            {company.name}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5">
          {anchors.map((a) => (
            <Link key={a.hash} href={`/${locale}${a.hash}`} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline">
              {a.label}
            </Link>
          ))}
          {routes.map((r) => (
            <Link key={r.href} href={r.href} className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors no-underline">
              {r.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100/80 rounded-full p-1 border border-slate-200/50">
            <button onClick={() => changeLocale('es')} className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${locale === 'es' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>ES</button>
            <button onClick={() => changeLocale('en')} className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${locale === 'en' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>EN</button>
          </div>

          {isInstallable && (
            <button onClick={handleInstallClick} className="hidden md:inline-flex border border-slate-300 hover:border-slate-400 text-slate-600 font-medium text-xs px-3.5 py-2 rounded-full items-center gap-1.5 transition-colors cursor-pointer">
              <FiDownload size={14} />
              {t.installApp}
            </button>
          )}

          <Link href={`/${locale}#contact`} className="hidden sm:inline-flex btn-primary !text-xs !py-2 !px-4 no-underline">
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

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Menu">
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 border-b border-slate-200 safe-x py-4 space-y-1 shadow-lg absolute w-full left-0 z-40">
          {[...anchors.map((a) => ({ label: a.label, href: `/${locale}${a.hash}` })), ...routes].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 font-medium py-2 px-3 hover:bg-emerald-50 rounded-lg no-underline"
            >
              {item.label}
            </Link>
          ))}
          <Link href={`/${locale}#contact`} onClick={() => setMobileMenuOpen(false)} className="block text-center btn-primary w-full py-2.5 rounded-lg no-underline mt-2">
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
