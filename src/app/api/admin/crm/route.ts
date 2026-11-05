import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllCrmLeads,
  updateLeadStage,
  createCrmLead,
  type CrmStage,
} from "@/lib/services/crm-service";

/**
 * Admin CRM & Teklif / Talep Yönetimi API'si
 * GET /api/admin/crm - Tüm leadleri getirir
 * PATCH /api/admin/crm - Kanban aşamasını günceller
 * POST /api/admin/crm - Yeni talep ekler
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const leads = await getAllCrmLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Leads listelenemedi" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const body = await req.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json(
        { error: "leadId ve status parametreleri zorunludur" },
        { status: 400 }
      );
    }

    const validStages: CrmStage[] = ["PENDING", "CONTACTED", "WON", "LOST"];
    if (!validStages.includes(status)) {
      return NextResponse.json({ error: "Geçersiz aşama durumu" }, { status: 400 });
    }

    await updateLeadStage(leadId, status);

    return NextResponse.json({
      success: true,
      message: `Talep durumu başarıyla "${status}" olarak güncellendi.`,
      leadId,
      status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Aşama güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, companyName, productSlug, budget, notes, source } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Ad Soyad ve E-posta zorunludur" },
        { status: 400 }
      );
    }

    const newLead = await createCrmLead({
      name,
      email,
      phone,
      companyName,
      productSlug,
      budget,
      notes,
      source: source || "Strateji_Toplantisi",
    });

    return NextResponse.json({
      success: true,
      message: "Talebiniz başarıyla alındı. Ekibimiz sizinle en kısa sürede iletişime geçecektir.",
      lead: newLead,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Talep kaydedilemedi" },
      { status: 500 }
    );
  }
}

