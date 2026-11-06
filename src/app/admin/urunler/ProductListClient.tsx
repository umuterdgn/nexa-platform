"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Copy,
  Check,
  ExternalLink,
  Link2,
  Sparkles,
  Layers,
  X,
  Search,
  Filter,
  Eye,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductForm, B2B_CATEGORIES } from "@/components/admin/ProductForm";
import type { PricingType } from "@/types/saas";

  interface ProductItem {
    id: string;
    _id?: string;
    slug: string;
    title: string;
    tagline?: string;
    description: string;
    badge?: string;
    category: string;
    pricingType?: PricingType;
    seoTitle?: string;
    seoDescription?: string;
    isActive: boolean;
    ssoUrl?: string;
    panelUrl?: string;
    features: string[];
    plans: any[];
    price?: number;
    discountPrice?: number;
    durationDays?: number;
  }

  export function ProductListClient({ initialProducts }: { initialProducts: ProductItem[] }) {
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>(initialProducts);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // Edit / Add Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

    const categories = ["Tümü", ...B2B_CATEGORIES];

        const filteredProducts = useMemo(() => {
          return products.filter((p) => {
            const matchesCategory =
              selectedCategory === "Tümü" || p.category === selectedCategory;
            const matchesSearch =
              searchQuery === "" ||
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
          });
      }, [products, selectedCategory, searchQuery]);

          const handleCopy = (text: string, key: string) => {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
              navigator.clipboard.writeText(text);
              setCopiedKey(key);
              setTimeout(() => setCopiedKey(null), 2000);
            }
          };

          const openEdit = (product: ProductItem) => {
            setEditingProduct(product);
            setIsEditModalOpen(true);
          };

          return (
                <div className="space-y-6">
                  {/* Kategori Filtreleme Tabları & Arama Kutusu */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    {/* Kategori Tabları */}
                    <div className="flex flex-wrap items-center gap-2">
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${isSelected
                                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold"
                                : "bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                              }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Arama Inputu */}
                    <div className="relative min-w-[260px]">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ürün adı veya slug ara..."
                        className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>

      {/* Ürün Listesi Tablosu */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="py-4 px-6">Ürün & Kategori</th>
                <th className="py-4 px-6">URL Slugu (Vitrin Bağlantısı)</th>
                <th className="py-4 px-6">Yönetim Paneli SSO URL</th>
                <th className="py-4 px-6">Fiyatlandırma Modeli</th>
                <th className="py-4 px-6 text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs font-mono">
                    Bu filtreye uygun ürün bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const slugUrl = `https://nxa.com.tr/urunler/${p.slug}`;
                  const isSlugCopied = copiedKey === `slug-${p.slug}`;
                  const isSsoCopied = copiedKey === `sso-${p.slug}`;
                  const pricingType = p.pricingType || "SUBSCRIPTION";

                  return (
                    <tr
                      key={p.id || p.slug}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Ürün Bilgisi */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div>
                            <div className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                              <span>{p.title}</span>
                              {p.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                📁 {p.category}
                              </span>
                              {p.features && p.features.length > 0 && (
                                <span className="text-[10px] font-mono text-slate-500">
                                  {p.features.length} özellik
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* URL Slug & 1-Tık Kopyalama */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                            /urunler/{p.slug}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(slugUrl, `slug-${p.slug}`)}
                            title="Tam URL'i Kopyala"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition hover:text-white cursor-pointer"
                          >
                            {isSlugCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <Link
                            href={`/urunler/${p.slug}`}
                            target="_blank"
                            title="Yeni Sekmede Vitrini Aç"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        {isSlugCopied && (
                          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                            ✓ Vitrin bağlantısı panoya kopyalandı!
                          </span>
                        )}
                      </td>

                      {/* SSO Hedef URL & 1-Tık Kopyalama */}
                      <td className="py-4 px-6">
                        {p.ssoUrl ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-300 truncate max-w-[220px]" title={p.ssoUrl}>
                                {p.ssoUrl}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(p.ssoUrl || "", `sso-${p.slug}`)}
                                title="SSO URL'ini Kopyala"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition hover:text-white cursor-pointer"
                              >
                                {isSsoCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            {isSsoCopied && (
                              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                                ✓ SSO adresi panoya kopyalandı!
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-600 font-mono italic">
                            Tanımlanmadı
                          </span>
                        )}
                      </td>

                      {/* Fiyatlandırma Modeli Rozeti & Fiyat */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {pricingType === "SUBSCRIPTION" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              📅 Abonelik (Aylık/Yıllık)
                            </span>
                          )}
                          {pricingType === "ONE_TIME" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              ⚡ Tek Seferlik (Jeton)
                            </span>
                          )}
                          {pricingType === "QUOTE_BASED" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              🏢 Özel Teklif (Enterprise)
                            </span>
                          )}

                          <div className="text-xs font-mono">
                            {pricingType === "QUOTE_BASED" ? (
                              <span className="text-amber-300 font-semibold">Teklife Dayalı</span>
                            ) : p.price && p.price > 0 ? (
                              <span className="text-slate-300 font-semibold">
                                {p.price.toLocaleString("tr-TR")} ₺ / ay
                              </span>
                            ) : (
                              <span className="text-slate-500">Standart Plan</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Aksiyon Butonları */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition border border-slate-700 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Düzenle</span>
                          </button>
                          <Link
                            href={`/urunler/${p.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-medium text-cyan-300 transition border border-cyan-500/30"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Vitrin</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DÜZENLEME MODALI */ }
      { isEditModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                              <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-10 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
                                <button
                                  type="button"
                                  onClick={() => setIsEditModalOpen(false)}
                                  className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 transition cursor-pointer"
                                >
                                  <X className="w-5 h-5" />
                                </button>

                                <div className="mb-6">
                                  <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
                                    Prisma SaaS Model Güncelleme
                                  </span>
                                  <h2 className="text-2xl font-black text-white mt-1">
                                    {editingProduct ? `Ürünü Düzenle: ${editingProduct.title}` : "Yeni Ürün Tanımla"}
                                  </h2>
                                </div>

                              <ProductForm initialProduct={editingProduct} />
                            </div>
        </div>
      )}
                  </div>
                  );
}
