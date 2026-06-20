import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { UserMenu } from "@/components/dashboard/UserMenu";
import {
  getDaysRemaining,
  Subscription,
  type ISubscriptionDocument,
} from "@/models/Subscription";
import { ActiveProductCard } from "@/components/dashboard/ActiveProductCard";
import { PaymentActivationBanner } from "@/components/dashboard/PaymentActivationBanner";
import { getProductIcon } from "@/lib/product-icons";
import { Product, type IProductDocument } from "@/models/Product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PopulatedSubscription = ISubscriptionDocument & {
  productId: IProductDocument;
};

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ odeme?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profil");
  }

  const { odeme } = await searchParams;

  await connectMongoDB();

  const _forceRegisterProductSchema = Product.modelName;
  const _forceRegisterSubscriptionSchema = Subscription.modelName;

  // 1. Veriyi Mongoose üzerinden lean() ile ham olarak çekiyoruz
  const rawSubs = await Subscription.find({ userId: session.user.id })
    .populate<{ productId: IProductDocument }>("productId")
    .sort({ updatedAt: -1 })
    .lean();

  // 2. Next.js Client Component hatasını engellemek için ObjectId ve Date sınıflarını saf metne serileştiriyoruz
  const subs = JSON.parse(JSON.stringify(rawSubs)) as PopulatedSubscription[];

  const activeSubs = subs.filter(
    (s) => s.status === "active" && s.productId && getDaysRemaining(s) > 0,
  );

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-display text-xl font-semibold">
            <span className="text-gradient-nexa">Nexa</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:inline">
              {session.user.name ?? session.user.email}
            </span>
            <UserMenu role={session.user.role} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {odeme === "basarili" && <PaymentActivationBanner />}

        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-[#3B82F6]">
            Müşteri Paneli
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Hoş geldiniz, {session.user.name?.split(" ")[0] ?? "Müşteri"}
          </h1>
          <p className="mt-2 text-slate-400">
            Aktif SaaS ürünlerinizi buradan yönetebilirsiniz.
          </p>
        </div>

        <section>
          <h2 className="mb-6 text-lg font-semibold text-white">
            Aktif Ürünlerim
          </h2>

          {activeSubs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#0F172A]/40 p-12 text-center">
              <p className="text-slate-400">Henüz aktif ürününüz yok.</p>
              <Link
                href="/urunler"
                className="mt-4 inline-block text-sm font-medium text-[#3B82F6] hover:underline"
              >
                Ürünleri inceleyin →
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {activeSubs.map((sub) => {
                const product = sub.productId;
                const daysRemaining = getDaysRemaining(sub);
                const totalDays = Math.ceil(
                  (new Date(sub.endDate).getTime() -
                    new Date(sub.startDate).getTime()) /
                    86_400_000,
                );

                return (
                  <ActiveProductCard
                    key={String(sub._id)}
                    name={product.title}
                    daysRemaining={daysRemaining}
                    totalDays={totalDays || 30}
                    panelUrl={`/sso?subId=${String(sub._id)}`}
                    icon={getProductIcon(product.slug)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
