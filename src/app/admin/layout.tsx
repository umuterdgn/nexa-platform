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
  ChevronRight,
  Inbox,
  FileText,
  Target,
  PlusCircle,
  Activity,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Güvenlik Duvarı: Admin olmayan hiçbir alt sayfaya sızamaz
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/profil");
  }

  const menuItems = [
    {
      href: "/admin",
      label: "Genel Bakış & GA4 Trafik",
      icon: <Activity size={18} />,
    },
    {
      href: "/admin/teklifler",
      label: "CRM & Teklifler (Kanban)",
      icon: <Target size={18} />,
    },
    {
      href: "/admin/urun-ekle",
      label: "+ Ürün / SSO Ekle (Prisma)",
      icon: <PlusCircle size={18} />,
    },
    {
      href: "/admin/urunler",
      label: "Ürün Kataloğu & Paketler",
      icon: <ShoppingBag size={18} />,
    },
    {
      href: "/admin/musteriler",
      label: "Müşteri Portföyü",
      icon: <Users2 size={18} />,
    },
    {
      href: "/admin/content",
      label: "İçerik Yönetimi (CMS)",
      icon: <FileText size={18} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sabit Sol Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 py-6 flex flex-col justify-between">
        <div>
          {/* Üst Alan / Logo */}
          <div className="flex items-center justify-between px-2 mb-8 border-b border-slate-800 pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                NEXA EXECUTIVE HQ
              </span>
              <span className="font-display text-lg font-black text-white">
                Admin Konsolu
              </span>
            </div>
            <Link
              href="/profil"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              title="Müşteri Paneline Dön"
            >
              <ArrowLeft size={16} />
            </Link>
          </div>

          {/* Menü Linkleri */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-mono font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-cyan-300 hover:border hover:border-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all"
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* Alt Alan / Yönetici Profil Özeti */}
        <div className="border-t border-slate-800 pt-4 flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400 uppercase">
            {session.user?.name?.substring(0, 2) || "AD"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-white truncate">
              {session.user?.name || "Admin"}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Root Administrator</span>
          </div>
        </div>
      </aside>

      {/* Sağ Taraf: Dinamik Sayfa İçerikleri */}
      <div className="flex-1 pl-64">{children}</div>
    </div>
  );
}
