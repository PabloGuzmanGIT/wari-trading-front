'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { translations } from '@/locales/translations';
import { routes, quoteHref } from '@/locales/pages';
import { company } from '@/lib/company';
import { FiArrowRight, FiCheck, FiDownload, FiGlobe, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

type NavItem = { label: string; href: string; exact?: boolean };
type NavGroup = { label: string; items: NavItem[] };
type Lang = 'es' | 'en';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

/** Marca «Cumbre» (la misma de icon.svg), sin el fondo. */
const BrandMark: React.FC = () => (
  <svg viewBox="-16 160 544 300" className="h-9 w-[65px] lg:h-10 lg:w-[72px] 2xl:h-12 2xl:w-[87px]" aria-hidden="true">
    <path d="M-20 378 L84 200 L188 252 L256 168 L324 252 L428 200 L532 378 Z" fill="#fbfbfa" />
    <path d="M-16 372 C70 350 120 360 182 342 C232 328 250 300 276 302 C316 306 340 356 400 368 C452 378 496 360 528 366 L528 452 C470 462 430 442 372 430 C320 419 288 452 250 452 C214 452 190 424 140 430 C84 437 30 456 -16 448 Z" fill="#559e32" />
    <path d="M-8 400 C74 380 126 390 186 374 C234 361 252 336 276 338 C314 342 338 384 396 396 C448 406 492 390 520 396" fill="none" stroke="#94cb3d" strokeWidth="9" strokeLinecap="round" />
  </svg>
);

export const Header: React.FC = () => {
  const params = useParams();
  const rawLocale = params?.locale as string;
  const locale: Lang = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const t = translations[locale].nav;

  const pathname = usePathname() || '';
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!langOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [langOpen]);

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

  const changeLocale = (newLocale: Lang) => {
    setLangOpen(false);
    if (newLocale === locale) return;
    const pathParts = pathname.split('/');
    pathParts[1] = newLocale;
    router.push(pathParts.join('/'));
  };

  const L = (path: string) => `/${locale}${path}`;

  const nav: (NavItem | NavGroup)[] = [
    { label: t.home, href: L(''), exact: true },
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
    { label: t.about, href: L(routes.about) },
    { label: t.contactLink, href: L(routes.quote) },
  ];

  // Fuera del menú de escritorio aprobado: sigue en el móvil, el Footer y el home.
  const mobileOnly: NavItem[] = [{ label: t.market, href: L(routes.market) }];

  const isActive = ({ href, exact }: NavItem) =>
    pathname === href || (!exact && pathname.startsWith(`${href}/`));
  const linkCls = (active: boolean) =>
    `relative whitespace-nowrap py-2 text-sm xl:text-base 2xl:text-[1.2rem] font-medium no-underline transition-colors text-white hover:text-wari-lime ${
      active ? "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-wari-lime" : ''
    }`;
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="w-full border-b border-white/15 bg-wari-navy text-white">
      <div className="mx-auto flex h-[68px] max-w-[1624px] items-center justify-between gap-4 safe-x lg:h-[clamp(76px,5.25vw,92px)]">

        <Link href={`/${locale}`} aria-label={company.name} className="flex flex-shrink-0 items-center gap-2 text-white no-underline">
          <BrandMark />
          <span className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight lg:text-[1.75rem] 2xl:text-[2.4rem]">WARI</span>
            <span className="mt-0.5 text-[9.5px] font-medium tracking-[0.13em] lg:text-[11px] 2xl:text-[14px]">TRADING FOODS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-3.5 lg:flex xl:gap-7 2xl:gap-12" aria-label={locale === 'es' ? 'Principal' : 'Main'}>
          {nav.map((item) =>
            'items' in item ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className={`${linkCls(item.items.some(isActive))} inline-flex cursor-pointer items-center gap-1.5`}
                >
                  {item.label}
                  <FiChevronDown size={15} className="transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                </button>
                {/* pt-3 deja un "puente" para que el hover no se corte al bajar el mouse */}
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    {item.items.map((sub) => (
                      <Link key={sub.href} href={sub.href} className={`block rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors ${isActive(sub) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkCls(isActive(item))}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-label={locale === 'es' ? 'Cambiar idioma' : 'Change language'}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 xl:px-3 2xl:text-base"
            >
              <FiGlobe size={20} />
              {locale.toUpperCase()}
              <FiChevronDown size={15} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {LANGS.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    lang={code}
                    onClick={() => changeLocale(code)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${code === locale ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {label}
                    {code === locale && <FiCheck size={15} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href={quoteHref(locale)} className="hidden items-center gap-2 whitespace-nowrap rounded-lg bg-wari-green px-4 py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-wari-green-hover sm:inline-flex lg:px-3 xl:px-5 xl:py-3 xl:text-[15px] 2xl:px-6 2xl:py-4 2xl:text-[1.1rem]">
            {t.quoteCta}
            <FiArrowRight size={17} />
          </Link>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="cursor-pointer rounded-lg p-1.5 text-white transition-colors hover:bg-white/10 lg:hidden" aria-label="Menu" aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 z-40 max-h-[calc(100vh-6.5rem)] w-full overflow-y-auto border-b border-white/15 bg-wari-navy py-4 shadow-lg safe-x lg:hidden">
          {nav.map((item) =>
            'items' in item ? (
              <div key={item.label} className="py-1">
                <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.label}</div>
                {item.items.map((sub) => (
                  <Link key={sub.href} href={sub.href} onClick={closeMenu} className="block rounded-lg px-3 py-2 font-medium text-white no-underline hover:bg-white/10">
                    {sub.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href} onClick={closeMenu} className="block rounded-lg px-3 py-2 font-semibold text-white no-underline hover:bg-white/10">
                {item.label}
              </Link>
            ),
          )}
          {mobileOnly.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu} className="block rounded-lg px-3 py-2 font-semibold text-white no-underline hover:bg-white/10">
              {item.label}
            </Link>
          ))}
          <Link href={quoteHref(locale)} onClick={closeMenu} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-wari-green py-3 font-semibold text-white no-underline transition-colors hover:bg-wari-green-hover">
            {t.quoteCta}
            <FiArrowRight size={17} />
          </Link>
          {isInstallable && (
            <button onClick={handleInstallClick} className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-slate-300">
              <FiDownload size={14} />
              {t.installApp}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
