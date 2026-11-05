import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAllCrmLeads } from "@/lib/services/crm-service";
import { CrmKanbanBoard } from "@/components/admin/CrmKanbanBoard";
import { Inbox, Target, Sparkles, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CRM ve Teklif Talepleri (Kanban) | Nexa Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTekliflerPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/profil");
  }

  const leads = await getAllCrmLeads();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Üst Başlık Alanı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Nexa B2B CRM & Dönüşüm Hunisi</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Gelen Teklifler ve Müşteri Talepleri
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Strateji toplantıları ve teklif formlarından gelen tüm müşteri hareketlerini Kanban aşamalarıyla yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
              Toplam: {leads.length} Talep
            </div>
          </div>
        </div>

        {/* İNTERAKTİF KANBAN BOARD */}
        <CrmKanbanBoard initialLeads={leads} />
      </div>
    </div>
  );
}
