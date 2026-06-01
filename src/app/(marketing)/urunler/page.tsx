import { MOCK_PRODUCTS } from "@/lib/products-mock";
import { PricingCard } from "@/components/products/PricingCard";

export const metadata = {
  title: "SaaS Ürünleri",
  description: "Nexa Randevu, AI WhatsApp Bot ve Kasa Takip — işletmeniz için premium SaaS çözümleri.",
};

export default function UrunlerPage() {
  return (
    <div className="bg-black">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.2),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#3B82F6]">
            SaaS Vitrini
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            İşinizi büyüten{" "}
            <span className="text-gradient-nexa">Nexa ürünleri</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Randevu, yapay zeka ve finans yönetimini tek ekosistemde birleştirin.
            Şeffaf fiyatlandırma, anında aktivasyon.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-3">
          {MOCK_PRODUCTS.map((product) => (
            <PricingCard key={product.id} product={product} />
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-slate-500">
          Tüm planlar KDV dahil fiyatlandırılmıştır. Yıllık ödemede %20 indirim yakında.
        </p>
      </section>
    </div>
  );
}
