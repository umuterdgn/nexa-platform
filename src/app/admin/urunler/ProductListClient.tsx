"use client";

import { useState } from "react";
import { Plus, Edit2, Package, Sparkles, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProductListClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    type: "saas",
    durationDays: "30",
    features: "",
    requiredFields: "",
  });

  // Düzenleme Modalı Açıldığında Verileri Doldurur
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || "",
      type: product.type,
      durationDays: product.durationDays?.toString() || "30",
      features: product.features?.join(", ") || "",
      requiredFields: product.requiredFields?.join(", ") || "",
    });
    setIsModalOpen(true);
  };

  // Yeni Ürün Ekleme Modalı Açıldığında Formu Sıfırlar
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      price: "",
      discountPrice: "",
      type: "saas",
      durationDays: "30",
      features: "",
      requiredFields: "",
    });
    setIsModalOpen(true);
  };

  // Kaydetme İşlemi (Hem Ekleme Hem Düzenleme İçin Ortak)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
      durationDays: formData.type === "service" ? 0 : Number(formData.durationDays),
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      requiredFields: formData.requiredFields.split(",").map((f) => f.trim()).filter(Boolean),
      productId: editingProduct?._id || null,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        router.refresh(); // Sunucudaki veriyi tazele
        // Sayfa yenilenene kadar yerel state'i güncelle
        window.location.reload();
      } else {
        alert("Bir hata oluştu, verileri kontrol edin.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Üst Ekleme Butonu */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-nexa bg-nexa-electric px-4 py-2.5 text-sm font-medium text-white shadow-neon-sm transition hover:bg-nexa-electric-bright"
        >
          <Plus size={16} />
          Kataloğa Yeni Ürün Ekle
        </button>
      </div>

      {/* Ürün Listeleme Tablosu */}
      <div className="rounded-2xl border border-white/5 bg-nexa-anthracite/20 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase text-slate-400">
            <tr>
              <th className="py-4 px-6">Ürün Detayı</th>
              <th className="py-4 px-6">Tür / Lisans</th>
              <th className="py-4 px-6">Fiyatlandırma</th>
              <th className="py-4 px-6 text-center">Tercih Edilme</th>
              <th className="py-4 px-6 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6">
                  <div className="font-semibold text-white">{product.title}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{product.slug}</div>
                </td>
                <td className="py-4 px-6 font-mono">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    product.type === "saas" 
                      ? "bg-blue-500/10 text-blue-400 ring-blue-500/20" 
                      : "bg-purple-500/10 text-purple-400 ring-purple-500/20"
                  }`}>
                    {product.type.toUpperCase()}
                  </span>
                  {product.type === "saas" && (
                    <span className="text-xs text-slate-500 block mt-1">
                      {product.durationDays === 365 ? "📅 Yıllık (365g)" : "⏱️ Aylık (30g)"}
                    </span>
                  )}
                  {product.type === "service" && (
                    <span className="text-xs text-slate-400 block mt-1 truncate max-w-[150px]" title={product.requiredFields?.join(", ")}>
                      📋 İstenenler: {product.requiredFields?.length || 0} adet
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {product.discountPrice > 0 ? (
                    <div>
                      <span className="line-through text-xs text-slate-500 mr-2">₺{product.price}</span>
                      <span className="text-sm font-semibold text-emerald-400">₺{product.discountPrice}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-slate-200">₺{product.price}</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="bg-nexa-electric/10 text-nexa-electric-bright text-xs px-2.5 py-1 rounded-full font-bold border border-nexa-electric/20">
                    {product.salesCount || 0} Satış
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => openEditModal(product)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <Edit2 size={12} />
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔮 GENİŞLETİLMİŞ EKLEME / DÜZENLEME MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-nexa-anthracite p-6 shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-nexa-neon" />
              {editingProduct ? "Ürün Bilgilerini Güncelle" : "Kataloğa Yeni Çözüm Tanımla"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Ürün / Hizmet Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-nexa-electric focus:outline-none"
                    placeholder="Örn: Next Finance ERP"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">URL Slugu (Benzersiz)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-nexa-electric focus:outline-none"
                    placeholder="next-finance-erp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Açıklama</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-nexa-electric focus:outline-none resize-none"
                  placeholder="Ürünün yeteneklerini ve kapsamını açıklayın..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Ürün Türü</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-nexa-electric focus:outline-none"
                  >
                    <option value="saas">SaaS (Yazılım)</option>
                    <option value="service">Hizmet (Ajans/Tasarım)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Normal Fiyat (TL)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-nexa-electric focus:outline-none"
                    placeholder="3500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">İndirimli Fiyat (TL)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-nexa-electric focus:outline-none"
                    placeholder="Yoksa boş bırakın"
                  />
                </div>
              </div>

              {formData.type === "saas" ? (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Lisans Süresi Kontrolü</label>
                  <select
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-nexa-electric/10 px-4 py-2.5 text-sm text-nexa-electric-bright font-bold focus:outline-none"
                  >
                    <option value="30" className="bg-black text-white">⏱️ Aylık Plan (30 Gün Erişim)</option>
                    <option value="365" className="bg-black text-white">📅 Yıllık Plan (365 Gün Erişim)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">📋 Hizmet Brifing İsterleri (Virgülle Ayırın)</label>
                  <input
                    type="text"
                    value={formData.requiredFields}
                    onChange={(e) => setFormData({ ...formData, requiredFields: e.target.value })}
                    className="w-full rounded-xl border border-purple-500/30 bg-purple-500/5 px-4 py-2.5 text-sm text-purple-400 focus:outline-none"
                    placeholder="Örn: Logo Dosyası, Renk Tercihleri, Rakip Web Siteleri"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Müşteri siparişi verirken bu girdileri doldurmak zorunda kalacaktır.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">✨ Öne Çıkan Özellikler (Virgülle Ayırın)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-nexa-electric focus:outline-none"
                  placeholder="Yüksek Hız, 7/24 Destek, Sınırsız Veri"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? "Sistem Kaydediyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}