"use client";

import React from "react";
import { X, Printer, ShieldCheck, CheckCircle2, FileText, Download } from "lucide-react";
import type { CustomerSubscription } from "@/types/saas";

interface InvoiceModalProps {
  subscription: CustomerSubscription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ subscription, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen || !subscription) return null;

  const handlePrint = () => {
    window.print();
  };

  const taxAmount = Math.round((subscription.invoiceAmount - subscription.invoiceAmount / 1.2) * 100) / 100;
  const subtotal = Math.round((subscription.invoiceAmount - taxAmount) * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 text-slate-100">
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık ve e-Fatura Damgası */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Maliye Bakanlığı Onaylı e-Arşiv Fatura
              </span>
              <h2 className="text-xl font-black text-white">
                {subscription.invoiceNumber}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>ÖDENDİ &bull; KDV DAHİL</span>
          </div>
        </div>

        {/* Fatura İçerik Dökümü */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm">
          {/* Şirket & Müşteri Bilgileri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <span className="text-slate-400 text-xs font-mono uppercase block mb-1">
                Hizmet Sağlayıcı
              </span>
              <p className="font-bold text-white">Nexa Global Yazılım Teknolojileri A.Ş.</p>
              <p className="text-slate-300 text-xs mt-1">İskenderun Vergi Dairesi &bull; VKN: 6310928172</p>
              <p className="text-slate-400 text-xs">Mersis: 0631092817200001 &bull; nxa.com.tr</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs font-mono uppercase block mb-1">
                Alıcı & Müşteri
              </span>
              <p className="font-bold text-white">Kurumsal Lisans Sahibi</p>
              <p className="text-slate-300 text-xs mt-1">Sipariş No: {subscription.orderNumber || "NXA-ORD-2026"}</p>
              <p className="text-slate-400 text-xs">Tarih: {subscription.invoiceDate}</p>
            </div>
          </div>

          {/* Kalemler Tablosu */}
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Hizmet / SaaS Kalemi</th>
                  <th className="py-3 px-4">Döngü</th>
                  <th className="py-3 px-4 text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {subscription.productTitle}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {subscription.planName} &bull; SSO Yetkisi ve İzole Bulut Tenant
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-cyan-400 font-mono">
                    {subscription.billingCycle === "YEARLY" ? "Yıllık (365 Gün)" : "Aylık"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white font-bold">
                    {subtotal.toLocaleString("tr-TR")} ₺
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Toplam Hesaplama */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Ara Toplam (Matrah):</span>
              <span>{subtotal.toLocaleString("tr-TR")} ₺</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Hesaplanan KDV (%20):</span>
              <span>{taxAmount.toLocaleString("tr-TR")} ₺</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span className="text-cyan-400">Genel Toplam (Tahsil Edilen):</span>
              <span className="text-cyan-300">{subscription.invoiceAmount.toLocaleString("tr-TR")} ₺</span>
            </div>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>5070 Sayılı Elektronik İmza Kanunu Uyarınca İmzalanmıştır.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

