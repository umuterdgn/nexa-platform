import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/services/product-service";
import { getContents } from "@/lib/content-store";

export const dynamic = "force-dynamic";

/**
 * Dinamik Next.js Sitemap Üreticisi (Next.js 16 App Router Standartları)
 * URL: https://nxa.com.tr/sitemap.xml
 * Arama motorları (Google, Bing) ve GEO yapay zeka botları (ChatGPT, Gemini, Perplexity)
 * için sitenin tüm statik ve dinamik sayfalarını haritalandırır.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nxa.com.tr";
  const now = new Date();

  // 1. Statik Temel Sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/randevu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/teklif-al`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Dinamik B2B SaaS Ürün Sayfaları (/urunler/[slug])
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productEntries = products
      .filter((p) => p.isActive)
      .map((p) => ({
        url: `${baseUrl}/urunler/${p.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));
  } catch (error) {
    console.warn("[Sitemap] Ürün listesi çekilemedi:", error);
  }

  // 3. Dinamik İçerikler, Vaka Analizleri ve Blog Yazıları (/blog/[slug])
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const contents = await getContents();
    blogEntries = contents
      .filter((c) => c.isPublished)
      .map((c) => ({
        url: `${baseUrl}/blog/${c.slug}`,
        lastModified: new Date(c.updatedAt || c.createdAt || now),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.warn("[Sitemap] Blog içerikleri çekilemedi:", error);
  }

  return [...staticPages, ...productEntries, ...blogEntries];
}

