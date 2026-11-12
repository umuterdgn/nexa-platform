import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

/**
 * Dinamik Next.js Robots.txt Üreticisi (Next.js 16 App Router Standartları)
 * URL: https://nxa.com.tr/robots.txt
 * Arama motorlarına ve GEO botlarına izin verilen / engellenen dizinleri bildirir.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://nxa.com.tr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/checkout/*",
          "/profil/*",
          "/auth/*",
        ],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "GPTBot", "PerplexityBot", "Claude-Web"],
        allow: [
          "/",
          "/urunler/*",
          "/blog/*",
          "/randevu",
          "/teklif-al",
          "/hakkimizda",
          "/iletisim",
        ],
        disallow: [
          "/admin/*",
          "/api/*",
          "/checkout/*",
          "/profil/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

