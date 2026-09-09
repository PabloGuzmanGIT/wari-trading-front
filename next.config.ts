import type { NextConfig } from "next";

// Backend para las llamadas server-side (sitemap, blog) y destino del proxy
// /api/* del navegador. En Railway se define como la red privada del backend
// (p. ej. http://wari-trading-back.railway.internal:8080): ese tráfico no sale
// a internet, así que no consume egress ni crédito. En local cae a 127.0.0.1:8000.
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // El navegador llama a /api/* en el propio dominio (mismo origen -> sin CORS)
  // y Next lo reenvía al backend por la red interna de Railway.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_INTERNAL_URL}/api/:path*` },
    ];
  },
  // Fuerza metadata bloqueante (no streaming) para crawlers clásicos y bots de IA/GEO,
  // que suelen leer el HTML inicial sin esperar a que el <head> se complete por streaming.
  htmlLimitedBots:
    /Googlebot|Google-InspectionTool|Mediapartners-Google|AdsBot-Google|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|CCBot|Applebot|Applebot-Extended|Amazonbot|Bytespider|Diffbot|omgili|YouBot/i,
};

export default nextConfig;
