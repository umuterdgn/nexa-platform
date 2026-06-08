import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  BarChart3, 
  ShoppingBag, 
  Users2, 
  Settings, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Güvenlik Duvarı: Admin olmayan hiçbir alt sayfaya bile sızamaz
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/profil");
  }

  const menuItems = [
    { href: "/admin", label: "Genel Bakış (İstatistik)", icon: <BarChart3 size={18} /> },
    { href: "/admin/urunler", label: "Ürünler & Fiyatlandırma", icon: <ShoppingBag size={18} /> },
    { href: "/admin/hizmetler", label: "Hizmetler (CMS)", icon: <Settings size={18} /> },
    { href: "/admin/musteriler", label: "Müşteri Yönetimi", icon: <Users2 size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-nexa-electric/30">
      
      {/* 🔮 Sabit Fütüristik Sol Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-nexa-anthracite/20 backdrop-blur-xl px-4 py-6 flex flex-col justify-between">
        <div>
          {/* Üst Alan / Logo */}
          <div className="flex items-center justify-between px-2 mb-8 border-b border-white/5 pb-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-widest text-nexa-electric-bright">HQ Panel</span>
              <span className="font-display text-lg font-bold text-white">Nexa Workspace</span>
            </div>
            <Link href="/profil" className="text-slate-500 hover:text-white transition-colors" title="Müşteri Paneline Dön">
              <ArrowLeft size={16} />
            </Link>
          </div>

          {/* Menü Linkleri */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 group-hover:text-nexa-neon transition-colors">
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                <ChevronRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Alt Alan / Yönetici Profil Özeti */}
        <div className="border-t border-white/5 pt-4 flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-nexa-electric/20 border border-nexa-electric/40 flex items-center justify-between justify-center text-xs font-bold text-nexa-electric-bright uppercase">
            {session.user?.name?.substring(0, 2)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{session.user?.name}</span>
            <span className="text-xs text-nexa-neon font-mono">Root Admin</span>
          </div>
        </div>
      </aside>

      {/* 🚀 Sağ Taraf: Dinamik Sayfa İçerikleri */}
      <div className="flex-1 pl-64">
        {children}
      </div>

    </div>
  );
}