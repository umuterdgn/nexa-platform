"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface Slot {
  time: string;
  endTime: string;
  available: boolean;
  datetimeIso: string;
}

interface InHouseSchedulerProps {
  prefilledProduct?: string;
  prefilledNotes?: string;
  roiLossEstimate?: number;
  onSuccessCallback?: (data: any) => void;
  compact?: boolean;
}

export function InHouseScheduler({
  prefilledProduct = "nexa-erp",
  prefilledNotes = "",
  roiLossEstimate,
  onSuccessCallback,
  compact = false,
}: InHouseSchedulerProps) {
  // 1. Tarih Listesi Oluştur (Bugünden itibaren sonraki 7 iş günü)
  const [days, setDays] = useState<{ dateStr: string; label: string; dayName: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Form Değerleri
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productSlug, setProductSlug] = useState(prefilledProduct);
  const [notes, setNotes] = useState(prefilledNotes);

  // Gönderim Durumları
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Günleri başlat
  useEffect(() => {
    const generatedDays: { dateStr: string; label: string; dayName: string }[] = [];
    let d = new Date();

    // Eğer saat 17:00'den sonraysa yarına odaklan
    if (d.getHours() >= 17) {
      d.setDate(d.getDate() + 1);
    }

    while (generatedDays.length < 7) {
      // Pazar (0) günlerini atla
      if (d.getDay() !== 0) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
        const monthNames = [
          "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
          "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
        ];

        generatedDays.push({
          dateStr,
          label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
          dayName: dayNames[d.getDay()],
        });
      }
      d.setDate(d.getDate() + 1);
    }

    setDays(generatedDays);
    if (generatedDays.length > 0) {
      setSelectedDate(generatedDays[0].dateStr);
    }
  }, []);

  // Seçili tarih değiştiğinde Google Takvim slotlarını API'den çek
  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    setLoadingSlots(true);
    setSelectedSlot(null);
    setErrorMsg(null);

    fetch(`/api/appointments?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.slots) {
          setSlots(data.slots);
        } else {
          // Fallback slotlar
          setSlots([
            { time: "09:30", endTime: "10:15", available: true, datetimeIso: `${selectedDate}T09:30:00+03:00` },
            { time: "10:30", endTime: "11:15", available: true, datetimeIso: `${selectedDate}T10:30:00+03:00` },
            { time: "11:30", endTime: "12:15", available: true, datetimeIso: `${selectedDate}T11:30:00+03:00` },
            { time: "13:30", endTime: "14:15", available: true, datetimeIso: `${selectedDate}T13:30:00+03:00` },
            { time: "14:30", endTime: "15:15", available: true, datetimeIso: `${selectedDate}T14:30:00+03:00` },
            { time: "15:30", endTime: "16:15", available: true, datetimeIso: `${selectedDate}T15:30:00+03:00` },
            { time: "16:30", endTime: "17:15", available: true, datetimeIso: `${selectedDate}T16:30:00+03:00` },
            { time: "17:30", endTime: "18:15", available: true, datetimeIso: `${selectedDate}T17:30:00+03:00` },
          ]);
        }
      })
      .catch((err) => {
        console.warn("Slot sorgulama hatası:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // Props güncellendiğinde notları ve ürünü yenile
  useEffect(() => {
    if (prefilledProduct) setProductSlug(prefilledProduct);
    if (prefilledNotes) setNotes(prefilledNotes);
  }, [prefilledProduct, prefilledNotes]);

  // Randevu Gönderim Fonksiyonu
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedSlot) {
      setErrorMsg("Lütfen size uygun bir saat aralığı (slot) seçin.");
      return;
    }

    if (!customerName || !customerEmail || !companyName) {
      setErrorMsg("Lütfen ad soyad, kurumsal e-posta ve şirket adı alanlarını doldurun.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedSlot.time,
          customerName,
          customerEmail,
          customerPhone,
          companyName,
          productSlug,
          notes,
          roiLossEstimate,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Randevu kaydı oluşturulamadı.");
      }

      setBookingResult(data.meeting);
      if (onSuccessCallback) {
        onSuccessCallback(data.meeting);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Bağlantı hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Meet Linkini Kopyalama
  const handleCopyMeetUrl = () => {
    if (!bookingResult?.meetUrl) return;
    navigator.clipboard.writeText(bookingResult.meetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // ICS Dosyasını Doğrudan İndirme
  const handleDownloadIcs = () => {
    if (!bookingResult?.icsContent) return;
    const blob = new Blob([bookingResult.icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nexa-toplanti-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Calendar Web Linki Üretimi
  const getGoogleCalendarUrl = () => {
    if (!bookingResult) return "#";
    const startIso = bookingResult.startTimeIso ? new Date(bookingResult.startTimeIso) : new Date();
    const endIso = bookingResult.endTimeIso ? new Date(bookingResult.endTimeIso) : new Date(Date.now() + 45 * 60000);

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = encodeURIComponent(`Nexa Strateji & Teknik Mimari: ${companyName} x Umut Erdoğan`);
    const details = encodeURIComponent(
      `Google Meet Katılımı: ${bookingResult.meetUrl}\n\nKatılımcılar: ${customerName} & Umut Erdoğan (Nexa Global)\nOdak: ${productSlug}`
    );
    const location = encodeURIComponent(bookingResult.meetUrl);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(startIso)}/${fmt(endIso)}&details=${details}&location=${location}`;
  };

  // Başarılı Ekranı
  if (bookingResult) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 sm:p-8 text-center text-slate-100 shadow-2xl">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-44 w-80 rounded-full bg-emerald-500/15 blur-[70px]" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <span className="mt-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
          Google Meet & Takvim Slotu Ayrıldı
        </span>

        <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
          Strateji Seansınız Başarıyla Planlandı!
        </h3>

        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-300">
          Sayın <strong className="text-white">{customerName}</strong> ({companyName}), görüşme takvime işlendi ve davetiyeniz <strong className="text-cyan-300">{customerEmail}</strong> adresinize gönderildi.
        </p>

        {/* Randevu Kartı Özeti */}
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>Tarih & Saat:</span>
            </div>
            <span className="text-xs font-bold text-white">
              {selectedDate} &bull; {selectedSlot?.time} - {selectedSlot?.endTime} (TSİ)
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <User className="h-4 w-4 text-blue-400" />
              <span>Toplantı Sahibi:</span>
            </div>
            <span className="text-xs font-medium text-slate-200">
              Umut Erdoğan (Kurucu & Baş Mühendis)
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-2">
              <Video className="h-4 w-4 text-emerald-400" />
              <span>Google Meet Bağlantınız:</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-slate-900 px-3 py-2">
              <input
                type="text"
                readOnly
                value={bookingResult.meetUrl}
                className="w-full bg-transparent text-xs font-mono text-cyan-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyMeetUrl}
                className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Kopyala"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a
                href={bookingResult.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-1 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/20 transition-colors"
                title="Odaya Git"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            {copiedLink && (
              <p className="mt-1 text-[11px] font-mono text-emerald-400">
                Bağlantı panoya kopyalandı!
              </p>
            )}
          </div>
        </div>

        {/* Takvime Ekle Aksiyonları */}
        <div className="mx-auto mt-6 flex max-w-md flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            Google Takvime Ekle
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-400" />
            .ICS Takvimini İndir
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setBookingResult(null);
            setSelectedSlot(null);
          }}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 cursor-pointer"
        >
          Yeni Bir Seans Planla
        </button>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl border border-slate-800/80 bg-slate-950 p-5 sm:p-7 text-slate-100 shadow-xl ${compact ? "max-w-2xl" : "max-w-4xl"} mx-auto`}>
      {/* Background Accent */}
      <div className="pointer-events-none absolute -top-24 right-0 h-44 w-72 rounded-full bg-cyan-500/10 blur-[80px]" />

      {/* Header Info */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-cyan-400">
            <Sparkles className="h-3 w-3" />
            Nexa In-House Scheduler v2.0
          </div>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white">
            Umut Erdoğan ile Strateji Toplantısı
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            45 Dakika &bull; Google Meet &bull; Doğrudan Sistem Mimarı ile B2B Seans
          </p>
        </div>

        {roiLossEstimate && roiLossEstimate > 0 && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-3.5 py-2 text-right">
            <span className="block text-[11px] font-mono text-red-400">Hedeflenen Kaçak Önleme</span>
            <span className="text-sm font-extrabold text-red-300">
              {roiLossEstimate.toLocaleString("tr-TR")} ₺ / ay
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleBooking} className="space-y-6">
        {/* ADIM 1: Gün Seçimi (7 Günlük Horizontal Picker) */}
        <div>
          <label className="mb-2 block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
            1. Uygun Günü Seçin
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {days.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs transition-all cursor-pointer border ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/10 font-bold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">
                    {item.dayName}
                  </span>
                  <span className={`mt-1 font-semibold ${isSelected ? "text-cyan-300" : "text-slate-200"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ADIM 2: Saat Slotu Seçimi */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
              2. Uygun Saati Seçin (TSİ / UTC+3)
            </label>
            {loadingSlots && (
              <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Takvim taranıyor...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.time === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-xs transition-all border ${
                    !slot.available
                      ? "opacity-35 cursor-not-allowed border-slate-900 bg-slate-950 text-slate-600"
                      : isSelected
                      ? "border-cyan-400 bg-cyan-500/25 text-white shadow-md shadow-cyan-500/20 font-bold"
                      : "border-slate-800/90 bg-slate-900/70 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800/80 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`h-3.5 w-3.5 ${isSelected ? "text-cyan-300" : "text-slate-400"}`} />
                    <span>{slot.time}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {slot.available ? "Boş" : "Dolu"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ADIM 3: İletişim & Kurumsal Bilgiler */}
        <div className="border-t border-slate-800/80 pt-5">
          <label className="mb-3 block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
            3. Kurumsal İletişim Bilgileri
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Ad Soyad *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Örn: Ahmet Yılmaz"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Şirket / Kurum Adı *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Örn: Yılmaz İnşaat A.Ş."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Kurumsal E-Posta *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="ahmet@yilmazinsaat.com.tr"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Telefon / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  placeholder="0532 000 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">İlgilenilen Nexa Çözümü</label>
              <select
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="nexa-erp">Nexa ERP (İnşaat Şantiye CDE, 3D BIM, Dexie.js PWA)</option>
                <option value="nexa-franchise">Nexa Franchise & Çoklu Mağaza Rollout Platformu</option>
                <option value="nexa-pos">Nexa POS: Restoran, Cafe ve Perakende OS</option>
                <option value="nexa-commerce">Nexa Commerce: API-First E-Ticaret ve Filo GPS</option>
                <option value="nexa-custom">Özel B2B SaaS, SAP / OData Entegrasyonu ve IoT Donanım</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Toplantı Notları / Şantiye Bilgisi</label>
              <textarea
                rows={2}
                placeholder="Örn: 3 aktif şantiyemiz için çevrimdışı hakediş ve taşeron metraj şişirme denetimi istiyoruz."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Gönder Butonu */}
        <button
          type="submit"
          disabled={isSubmitting || !selectedSlot}
          className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[length:200%_auto] py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:bg-[right_center] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Slot Ayrılıyor ve Google Meet Bağlantısı Oluşturuluyor...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>
                {selectedSlot
                  ? `${selectedDate} ${selectedSlot.time} Seansını Onayla ve Takvime Ekle`
                  : "Lütfen Bir Saat Seçin"}
              </span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-500">
          Rezervasyonunuz tamamlandığında Google Meet bağlantısı ve RFC 5545 .ics takvim davetiyesi anında kurumsal e-posta adresinize iletilecektir.
        </p>
      </form>
    </div>
  );
}

