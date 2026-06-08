import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import {
  getDefaultBillingCycle,
  getEffectivePrice,
  getCycleLabel,
} from "@/lib/product-pricing";
import type { IProduct } from "@/types/product";
import { ArrowRight, Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

type LeanProduct = IProduct & { _id: { toString(): string } };

export default async function HizmetlerPage() {
  let services: LeanProduct[] = [];

  try {
    await connectMongoDB();
    const _force = Product.modelName;

    services = (await Product.find({ type: "service", isActive: { $ne: false } })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()) as unknown as LeanProduct[];
  } catch (error) {
    console.error("Hizmetler çekilirken hata:", error);
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_55%)]" />

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
            Ajans Hizmetleri
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            İşinizi büyüten{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              profesyonel çözümler
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Tasarım, geliştirme ve dijital pazarlama hizmetlerimiz veritabanından
            dinamik olarak listelenir. Her hizmet için anında teklif alabilirsiniz.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-4 text-slate-400">
              Henüz listelenen hizmet bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const cycle = getDefaultBillingCycle(service);
              const price = getEffectivePrice(service, cycle);
              const cycleLabel = getCycleLabel(cycle, "service");
              const features = service.features ?? [];

              return (
                <article
                  key={service._id.toString()}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-nexa-anthracite/40 to-black p-6 transition hover:border-purple-500/40"
                >
                  <h2 className="font-display text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </h2>

                  <div className="mt-4 flex items-baseline text-white">
                    <span className="text-3xl font-bold">
                      ₺{price.toLocaleString("tr-TR")}
                    </span>
                    {cycleLabel && (
                      <span className="ml-1 text-sm text-slate-400">
                        {cycleLabel}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 flex-1 text-sm text-slate-400 leading-relaxed">
                    {service.description}
                  </p>

                  {features.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                      {features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/checkout/${service._id.toString()}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                  >
                    Teklif Al
                    <ArrowRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
