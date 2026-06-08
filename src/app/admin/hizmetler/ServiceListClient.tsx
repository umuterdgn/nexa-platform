"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getDefaultBillingCycle,
  getEffectivePrice,
  getCycleLabel,
} from "@/lib/product-pricing";

export function ServiceListClient({
  initialServices,
}: {
  initialServices: Record<string, unknown>[];
}) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    pricingOneTime: "",
    features: "",
    requiredFields: "",
    maxUsers: "",
    maxTransactions: "",
  });

  const openEditModal = (service: Record<string, unknown>) => {
    setEditingService(service);
    const pricing = service.pricing as Record<string, number> | undefined;
    setFormData({
      title: String(service.title ?? ""),
      slug: String(service.slug ?? ""),
      description: String(service.description ?? ""),
      pricingOneTime: String(
        pricing?.oneTime ?? service.price ?? "",
      ),
      features: ((service.features as string[]) ?? []).join(", "),
      requiredFields: ((service.requiredFields as string[]) ?? []).join(", "),
      maxUsers: String(
        (service.usageQuotas as Record<string, number>)?.maxUsers ?? "",
      ),
      maxTransactions: String(
        (service.usageQuotas as Record<string, number>)?.maxTransactions ?? "",
      ),
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      pricingOneTime: "",
      features: "",
      requiredFields: "",
      maxUsers: "",
      maxTransactions: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const price = Number(formData.pricingOneTime);
    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      type: "service",
      price,
      pricingOneTime: price,
      durationDays: 0,
      features: formData.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      requiredFields: formData.requiredFields
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      maxUsers: formData.maxUsers ? Number(formData.maxUsers) : undefined,
      maxTransactions: formData.maxTransactions
        ? Number(formData.maxTransactions)
        : undefined,
      productId: editingService?._id ?? null,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: editingService ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        router.refresh();
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error ?? "Kayıt başarısız.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" hizmetini silmek istediğinize emin misiniz?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        router.refresh();
      } else {
        alert("Silme işlemi başarısız.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-nexa bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
        >
          <Plus size={16} />
          Yeni Hizmet Ekle
        </button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-slate-400">
          Henüz tanımlı hizmet yok. Yukarıdaki butondan ekleyebilirsiniz.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const id = String(service._id);
            const cycle = getDefaultBillingCycle(
              service as Parameters<typeof getDefaultBillingCycle>[0],
            );
            const price = getEffectivePrice(
              service as Parameters<typeof getEffectivePrice>[0],
              cycle,
            );
            const label = getCycleLabel(cycle, "service");

            return (
              <div
                key={id}
                className="rounded-2xl border border-white/10 bg-nexa-anthracite/30 p-6"
              >
                <h3 className="font-semibold text-white">{String(service.title)}</h3>
                <p className="mt-1 text-xs text-slate-500 font-mono">
                  {String(service.slug)}
                </p>
                <p className="mt-3 text-2xl font-bold text-purple-400">
                  ₺{price.toLocaleString("tr-TR")}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    {label}
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                  {String(service.description)}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10"
                  >
                    <Edit2 size={12} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(id, String(service.title))}
                    disabled={deletingId === id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-nexa-anthracite p-6 shadow-2xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-400" />
              {editingService ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Hizmet Adı
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Açıklama
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Proje Fiyatı (₺)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.pricingOneTime}
                  onChange={(e) =>
                    setFormData({ ...formData, pricingOneTime: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Özellikler (virgülle)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Brifing Alanları (virgülle)
                </label>
                <input
                  type="text"
                  value={formData.requiredFields}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredFields: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Max Kullanıcı (ops.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxUsers}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUsers: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Max İşlem (ops.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxTransactions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxTransactions: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
                >
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
