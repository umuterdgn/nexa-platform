"use client";

import { useState } from "react";
import { Search, UserX, X, Calendar, Package, PowerOff } from "lucide-react";
import { useRouter } from "next/navigation";

export function CustomerClient({
  initialCustomers,
}: {
  initialCustomers: any[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Arama filtresi
  const filteredCustomers = initialCustomers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Kalan gün hesaplayıcı
  const getDaysLeft = (endDateString: string) => {
    const end = new Date(endDateString).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  // Abonelik İptal Tetikleyicisi
  const handleCancelSubscription = async (subscriptionId: string) => {
    if (
      !confirm(
        "Bu aboneliği/hizmeti iptal etmek istediğinize emin misiniz? Müşteri anında erişimini kaybedecektir.",
      )
    )
      return;

    setLoadingAction(subscriptionId);
    try {
      const res = await fetch("/api/admin/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });

      if (res.ok) {
        alert("Abonelik başarıyla iptal edildi.");
        router.refresh(); // Arka planda veriyi tazeler
        window.location.reload(); // UI'ı kesin güncellemek için
      } else {
        alert("İptal işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔍 Üst Bar: Arama Kutusu */}
      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-nexa-anthracite/20 p-4">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Müşteri adı veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white focus:border-nexa-electric focus:outline-none"
          />
        </div>
        <div className="text-sm text-slate-400">
          Toplam{" "}
          <span className="font-bold text-white">
            {filteredCustomers.length}
          </span>{" "}
          Müşteri
        </div>
      </div>

      {/* 📋 Müşteri Listesi Tablosu */}
      <div className="rounded-2xl border border-white/5 bg-nexa-anthracite/20 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase text-slate-400">
            <tr>
              <th className="py-4 px-6">Müşteri Bilgisi</th>
              <th className="py-4 px-6 text-center">Satın Almalar</th>
              <th className="py-4 px-6 text-center">Kayıt Tarihi</th>
              <th className="py-4 px-6 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  Müşteri bulunamadı.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const activeSubs = customer.subscriptions.filter(
                  (s: any) => s.status === "active",
                ).length;
                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">
                        {customer.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${activeSubs > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}
                      >
                        {activeSubs} Aktif Ürün
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-slate-500">
                      {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="rounded-lg bg-nexa-electric/10 border border-nexa-electric/20 px-4 py-2 text-xs font-medium text-nexa-electric-bright hover:bg-nexa-electric hover:text-white transition-all"
                      >
                        Detayları İncele
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🔮 MÜŞTERİ DETAY VE YÖNETİM MODALI */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-nexa-anthracite p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="h-16 w-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl font-bold text-blue-400">
                {selectedCustomer.name?.substring(0, 1)}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  {selectedCustomer.name}
                </h2>
                <p className="text-sm text-slate-400">
                  {selectedCustomer.email}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package size={18} className="text-nexa-neon" />
              Satın Alınan Lisanslar & Hizmetler
            </h3>

            {selectedCustomer.subscriptions.length === 0 ? (
              <p className="text-sm text-slate-500 bg-black/30 p-4 rounded-xl border border-white/5">
                Bu müşteriye ait aktif bir satın alım bulunmuyor.
              </p>
            ) : (
              <div className="space-y-4">
                {selectedCustomer.subscriptions.map((sub: any) => {
                  const daysLeft = getDaysLeft(sub.endDate);
                  const isActive = sub.status === "active" && daysLeft > 0;

                  return (
                    <div
                      key={sub.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/10 bg-black/40"
                    >
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {sub.product?.title || "Bilinmeyen Ürün"}
                          </span>
                          {isActive ? (
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider">
                              Aktif
                            </span>
                          ) : (
                            <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 uppercase font-bold tracking-wider">
                              İptal / Bitti
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-2 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> Başlangıç:{" "}
                            {new Date(sub.startDate).toLocaleDateString(
                              "tr-TR",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {isActive && (
                          <div className="text-right">
                            <span className="block text-xs text-slate-400">
                              Kalan Süre
                            </span>
                            <span className="font-mono text-lg font-bold text-nexa-electric-bright">
                              {daysLeft} Gün
                            </span>
                          </div>
                        )}

                        {isActive && (
                          <button
                            onClick={() => handleCancelSubscription(sub.id)}
                            disabled={loadingAction === sub.id}
                            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            <PowerOff size={14} />
                            {loadingAction === sub.id
                              ? "İşleniyor..."
                              : "İptal Et"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
