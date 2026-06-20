import { connectMongoDB } from "@/lib/mongodb";
import { Quote } from "@/models/Quote";
import StatusSelect from "./StatusSelect"; // 🌟 Yeni eklediğimiz bileşeni import ettik

export const dynamic = "force-dynamic";

async function getQuotes() {
  try {
    await connectMongoDB();
    return await Quote.find({}).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Teklifler çekilirken hata oluştu:", error);
    return [];
  }
}

export default async function AdminTekliflerPage() {
  const quotes = await getQuotes();

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Üst Başlık Alanı */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Gelen Proje Teklifleri
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Nexa üzerinden gönderilen tüm proje ve teklif taleplerinin
              listesi.
            </p>
          </div>
          <div className="rounded-lg bg-blue-500/10 px-4 py-2 border border-blue-500/20 text-sm text-blue-400 font-medium">
            Toplam Talep: {quotes.length}
          </div>
        </div>

        {/* Tablo / Liste Alanı */}
        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/40 backdrop-blur-md">
          {quotes.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Henüz gelen bir teklif talebi bulunmuyor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Müşteri</th>
                    <th className="px-6 py-4">İletişim Bilgileri</th>
                    <th className="px-6 py-4">Proje Detayı</th>
                    <th className="px-6 py-4">Tarih</th>
                    <th className="px-6 py-4 text-right">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {quotes.map((quote: any) => (
                    <tr
                      key={quote._id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-white">
                        {quote.name}
                      </td>

                      <td className="px-6 py-4 space-y-1">
                        <div className="text-slate-300">{quote.email}</div>
                        {quote.phone && quote.phone !== "Belirtilmedi" && (
                          <div className="text-xs text-slate-500">
                            Tel: {quote.phone}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 max-w-md">
                        <p className="text-slate-300 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer whitespace-pre-wrap">
                          {quote.details}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                        {new Date(quote.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* 🌟 GÜNCELLENDİ: Statik span yerine interaktif dropdown bileşenini koyduk */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <StatusSelect
                          quoteId={quote._id.toString()}
                          initialStatus={quote.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
