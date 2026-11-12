import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAllCrmLeads } from "@/lib/services/crm-service";
import { CrmDashboardClient } from "@/components/admin/CrmDashboardClient";
import { Target, Sparkles, Send, Users2, Database } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Otonom Satış & Lead Yönetimi (CRM) | Nexa Admin",
  description: "Outbound B2B satış makinesi, Resend soğuk e-posta otomasyonu ve PhantomBuster lead hunisi.",
  robots: { index: false, follow: false },
};

export default async function AdminCrmPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/profil");
  }

  const leads = await getAllCrmLeads();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Üst Başlık ve Tanıtım */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Nexa B2B Outbound Sales Engine & CRM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Otonom Satış & Lead Yönetimi
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
              PhantomBuster/LinkedIn ve web formlarından toplanan potansiyel müşterilere Resend API ile spama düşmeyen kişiselleştirilmiş soğuk mailler atın, dönüşüm hunisini tek ekrandan yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{leads.length} Aktif Potansiyel Müşteri</span>
            </div>
          </div>
        </div>

        {/* İnteraktif Kanban ve Data Table Dashboard */}
        <CrmDashboardClient initialLeads={leads} />
      </div>
    </div>
  );
}

