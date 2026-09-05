import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PwaRegister } from "@/components/PwaRegister";
import { SITE_URL, company } from "@/lib/company";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Verificación de Google Search Console vía token (opción alternativa al TXT DNS).
// Se define en Vercel como GOOGLE_SITE_VERIFICATION (solo el valor del token,
// no la etiqueta completa). Si no está, no se emite el meta.
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${company.name} | ${company.tagline.es}`,
    template: `%s | ${company.name}`,
  },
  description: company.description.es,
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Permite que el contenido use toda la pantalla; los márgenes seguros
  // (notch, isla dinámica, barra de gestos) se manejan con env(safe-area-inset-*) en globals.css
  viewportFit: "cover",
  // La franja superior de la app (ticker) siempre es azul elefante oscuro,
  // así la barra de estado del dispositivo combina en modo standalone.
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fbfbfa] text-[#14181a]">
        <AuthProvider>
          <PwaRegister />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
