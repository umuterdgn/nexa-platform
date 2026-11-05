"use client";

import { useState } from "react";

interface StatusSelectProps {
  quoteId: string;
  initialStatus: string;
}

export default function StatusSelect({ quoteId, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(initialStatus || "bekliyor");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      const res = await fetch("/api/teklif", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: quoteId, status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
      } else {
        alert("Durum güncellenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Seçilen duruma göre renk şemasını dinamik ayarlıyoruz
  const getStatusStyle = (currentStatus: string) => {
    switch (currentStatus) {
      case "bekliyor":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "inceleniyor":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "onaylandi":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "reddedildi":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider outline-none bg-black cursor-pointer transition-all ${getStatusStyle(status)} ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <option value="bekliyor" className="bg-[#0f172a] text-amber-500">Bekliyor</option>
      <option value="inceleniyor" className="bg-[#0f172a] text-blue-500">İnceleniyor</option>
      <option value="onaylandi" className="bg-[#0f172a] text-emerald-500">Onaylandı</option>
      <option value="reddedildi" className="bg-[#0f172a] text-red-500">Reddedildi</option>
    </select>
  );
}