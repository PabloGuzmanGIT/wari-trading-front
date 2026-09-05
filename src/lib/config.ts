export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// SITE_URL vive en company.ts (fuente de verdad de identidad). Se re-exporta
// aquí por compatibilidad con imports existentes.
export { SITE_URL } from "@/lib/company";
