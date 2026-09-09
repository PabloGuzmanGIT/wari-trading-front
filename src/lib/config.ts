// Llamadas desde el NAVEGADOR (componentes 'use client'): ruta relativa /api/*
// en el mismo origen. next.config.ts la reenvía al backend por red interna.
// Mismo origen => no hace falta CORS. Vacío por defecto = "/api/...".
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Llamadas desde el SERVIDOR (sitemap, blog en SSR/ISR): directo al backend por
// la red privada de Railway. No pasa por internet. En local: 127.0.0.1:8000.
export const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000";

// SITE_URL vive en company.ts (fuente de verdad de identidad). Se re-exporta
// aquí por compatibilidad con imports existentes.
export { SITE_URL } from "@/lib/company";
