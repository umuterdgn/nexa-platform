import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContentBySlug, getContents } from "@/lib/content-store";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

/**
 * Dinamik SEO ve Metadata Üretimi (Next.js 16 App Router)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getContentBySlug(slug);

  if (!article) {
    return {
      title: "Makale Bulunamadı | Nexa Platform",
      description: "Aradığınız mühendislik makalesi veya vaka analizi bulunamadı.",
    };
  }

  const metaTitle = article.metaTitle || `${article.title} | Nexa B2B Mühendislik`;
  const metaDescription =
    article.metaDescription || article.excerpt || article.content.slice(0, 160);
  const canonicalUrl = `https://nxa.com.tr/blog/${article.slug}`;

  const keywords = [
    article.title,
    "Şantiye ERP",
    "Offline-first PWA",
    "Dexie.js",
    "3D BIM Hakediş",
    "Franchise Rollout",
    "Bulut POS",
    "Umut Erdoğan",
    "Nexa Kurumsal Mimari",
  ];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "Nexa Platform",
      locale: "tr_TR",
      type: "article",
      publishedTime: new Date(article.createdAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
      authors: ["Umut Erdoğan"],
      images: [
        {
          url: article.coverImage || "https://nxa.com.tr/og-image.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [article.coverImage || "https://nxa.com.tr/og-image.png"],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getContentBySlug(slug);

  if (!article) {
    notFound();
  }

  // Schema.org Article / BlogPosting Yapısal Verisi
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": article.type === "CASE_STUDY" ? "TechArticle" : "BlogPosting",
    "@id": `https://nxa.com.tr/blog/${article.slug}#article`,
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    image: article.coverImage || "https://nxa.com.tr/og-image.png",
    author: {
      "@type": "Person",
      name: "Umut Erdoğan",
      jobTitle: "Kurucu & Sistem Mimarı",
      url: "https://nxa.com.tr",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://nxa.com.tr/#organization",
      name: "Nexa B2B SaaS Platformu",
      url: "https://nxa.com.tr",
      logo: "https://nxa.com.tr/icon.png",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nxa.com.tr/blog/${article.slug}`,
    },
  };

  // İlgili Teknik SSS Şeması
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${article.title} hangi problem ve darboğazı çözer?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            article.excerpt ||
            "Saha ve kurumsal operasyonlarda manuel hataları, veri kaybını ve sistemsel darboğazları ortadan kaldıran otonom B2B mühendislik yaklaşımı sunar.",
        },
      },
      {
        "@type": "Question",
        name: "Nexa bu çözümü hangi teknolojilerle hayata geçirir?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Çevrimdışı IndexedDB (Dexie.js), Serverless PostgreSQL (NeonDB), 3D BIM motorları ve API-first mikromimari ile hayata geçirir.",
        },
      },
    ],
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-24 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* JSON-LD Yapısal Veri Enjeksiyonu */}
        <script
          id={`article-schema-${article.slug}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          id={`article-faq-schema-${article.slug}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <div className="mx-auto max-w-4xl space-y-10">
          {/* Breadcrumb Navigasyonu */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/" className="hover:text-cyan-400 transition">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-cyan-400 transition">
              Mühendislik Blogu
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
          </nav>

          {/* Başlık Alanı */}
          <div className="space-y-6 border-b border-slate-800 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                {article.type === "CASE_STUDY" ? "Vaka İncelemesi" : article.type === "GLOSSARY" ? "Teknik Sözlük" : "Mühendislik Yayını"}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date(article.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs font-mono text-slate-400">Yazar: Umut Erdoğan</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-slate-300 font-medium leading-relaxed border-l-2 border-cyan-500 pl-4 py-1 italic bg-cyan-950/10 rounded-r-xl">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* Makale Gövdesi */}
          <article className="prose prose-invert prose-cyan max-w-none text-slate-300 space-y-6 text-base leading-relaxed">
            <div className="whitespace-pre-line leading-relaxed font-sans text-slate-300">
              {article.content}
            </div>
          </article>

          {/* Executive Yazar İmzası */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-black text-xl">
                UE
              </div>
              <div>
                <div className="font-bold text-white text-base">Umut Erdoğan</div>
                <div className="text-xs font-mono text-cyan-400">Kurucu & Sistem Mimarı | Nexa Global</div>
                <p className="text-xs text-slate-400 mt-1">
                  Şantiye çevrimdışı PWA mimarileri ve yüksek ölçekli B2B SaaS sistemleri geliştiricisi.
                </p>
              </div>
            </div>

            <Link
              href="/randevu"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition shrink-0 shadow-lg shadow-cyan-500/20"
            >
              Teknik Seans Planla &rarr;
            </Link>
          </div>

          {/* Geri Dönüş Linki */}
          <div className="pt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tüm Mühendislik Yazılarına Geri Dön</span>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

