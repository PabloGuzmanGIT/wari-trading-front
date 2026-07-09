import type { NextConfig } from "next";

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
  // Fuerza metadata bloqueante (no streaming) para crawlers clásicos y bots de IA/GEO,
  // que suelen leer el HTML inicial sin esperar a que el <head> se complete por streaming.
  htmlLimitedBots:
    /Googlebot|Google-InspectionTool|Mediapartners-Google|AdsBot-Google|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|CCBot|Applebot|Applebot-Extended|Amazonbot|Bytespider|Diffbot|omgili|YouBot/i,
};

export default nextConfig;
