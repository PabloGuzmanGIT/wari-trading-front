import React from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

/** Encabezado de sección: antetítulo + título + bajada. */
export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  dark?: boolean;
  as?: 'h1' | 'h2';
}> = ({ eyebrow, title, subtitle, center, dark, as: Tag = 'h2' }) => (
  <div className={`max-w-2xl mb-10 sm:mb-12 ${center ? 'mx-auto text-center' : ''}`}>
    {eyebrow && (
      <div className={`text-xs font-bold uppercase tracking-[0.18em] mb-3 ${dark ? 'text-emerald-300' : 'text-emerald-600'}`}>
        {eyebrow}
      </div>
    )}
    <Tag className={`${Tag === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'} font-extrabold tracking-tight text-balance mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </Tag>
    {subtitle && <p className={`text-base sm:text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{subtitle}</p>}
  </div>
);

/** Cabecera oscura de las páginas internas. */
export const PageHeader: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, back, children }) => (
  <section className="bg-[#0f172a] text-white">
    <div className="container py-14 sm:py-20">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold mb-8 no-underline">
          <FiArrowLeft /> {back.label}
        </Link>
      )}
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} dark as="h1" />
      {children}
    </div>
  </section>
);

/** Sello de habilitación sanitaria. */
export const SanitarySeal: React.FC<{ label: string; dark?: boolean }> = ({ label, dark }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border ${
      dark ? 'border-emerald-400/40 text-emerald-200 bg-emerald-400/10' : 'border-emerald-500/30 text-emerald-700 bg-emerald-50'
    }`}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
    {label}
  </span>
);
