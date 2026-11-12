import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getContents } from "@/lib/content-store";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Sparkles,
  FileText,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "B2B Mühendislik, Şantiye ERP ve Mimari Blogu | Nexa Platform",
  description:
    "Çevrimdışı PWA mimarileri, Dexie.js veri senkronizasyonu, 3D BIM hakediş süreçleri ve B2B SaaS ekosistemleri hakkında derinlemesine teknik makaleler.",
  keywords: [
    "Şantiye ERP",
    "Offline PWA",
    "Dexie.js",
    "3D BIM Hakediş",
    "Franchise Rollout",
    "Bulut POS",
    "Nexa Mühendislik",
    "Umut Erdoğan",
  ],
  alternates: {
    canonical: "https://nxa.com.tr/blog",
  },
  openGraph: {
    title: "B2B Mühendislik ve Mimari Blogu | Nexa Platform",
    description:
      "Çevrimdışı şantiye sistemleri, 3D BIM hakediş blokesi ve modern B2B SaaS mimarileri.",
    url: "https://nxa.com.tr/blog",
    siteName: "Nexa Platform",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://nxa.com.tr/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nexa B2B Mühendislik Blogu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Mühendislik ve Mimari Blogu | Nexa Platform",
    description: "Derin teknoloji, çevrimdışı ERP ve kurumsal SaaS mimarileri.",
    images: ["https://nxa.com.tr/og-image.png"],
  },
};

export default async function BlogIndexPage() {
  const allContents = await getContents();
  const published = allContents.filter((c) => c.isPublished);

  // Schema.org ItemList Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: published.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `https://nxa.com.tr/blog/${item.slug}`,
      description: item.excerpt || item.metaDescription,
    })),
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-24 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* ItemList JSON-LD */}
        <script
          id="blog-itemlist-ldjson"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nexa B2B Mühendislik Kütüphanesi</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Saha Mimarisi, Şantiye ERP ve Derin Teknoloji
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              İnternetsiz şantiye senkronizasyonu, Dexie.js offline mimarisi, 3D BIM hakediş blokesi ve modern B2B SaaS altyapısı üzerine teknik makaleler ve vaka analizleri.
            </p>
          </div>

          {/* Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((article) => {
              const typeLabel =
                article.type === "CASE_STUDY"
                  ? "Vaka Analizi"
                  : article.type === "GLOSSARY"
                  ? "Teknik Sözlük"
                  : "Mühendislik Blogu";

              const typeBadge =
                article.type === "CASE_STUDY"
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                  : article.type === "GLOSSARY"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/70 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`px-2.5 py-1 rounded-lg border font-semibold ${typeBadge}`}>
                        {typeLabel}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(article.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {article.excerpt || article.metaDescription || "Teknik vaka analizi ve sistem mimarisi detayları..."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                    <span>Makaleyi İncele</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Alt CTA Bölümü */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-8 sm:p-12 text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Şirketinizin Özel Mimarisini Birlikte Kuralım
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Şantiyelerinizde veya mağazalarınızda yaşanan veri kopukluklarını çözmek için 15 dakikalık B2B teknik strateji seansı ayırtın.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/randevu"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20"
              >
                Takvimden Randevu Al &rarr;
              </Link>
              <Link
                href="/teklif-al"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-medium text-xs transition border border-slate-700"
              >
                Projenden Bahset
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

