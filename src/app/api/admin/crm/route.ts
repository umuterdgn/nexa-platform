import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllCrmLeads,
  updateLeadStage,
  createCrmLead,
  deleteCrmLead,
  normalizeLeadStatus,
  type CrmStage,
} from "@/lib/services/crm-service";
import { sendB2bColdEmail } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

/**
 * Admin CRM & Outbound Satış Yönetimi API'si
 * GET    /api/admin/crm - Tüm leadleri getirir
 * PATCH  /api/admin/crm - Aşamayı günceller (NEW -> EMAILED -> MEETING_SET -> CLOSED -> LOST)
 * POST   /api/admin/crm - Yeni manuel lead ekler (Opsiyonel: anında soğuk mail atar)
 * DELETE /api/admin/crm - Lead kaydını siler
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

    const normalized = normalizeLeadStatus(status);
    await updateLeadStage(leadId, normalized);

    return NextResponse.json({
      success: true,
      message: `Talep durumu başarıyla "${normalized}" olarak güncellendi.`,
      leadId,
      status: normalized,
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
    const {
      name,
      email,
      phone,
      company,
      companyName,
      jobTitle,
      campaignType,
      productSlug,
      budget,
      notes,
      source,
      sendColdMailNow,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Ad Soyad ve E-posta zorunludur" },
        { status: 400 }
      );
    }

    const cleanCompany = company || companyName || "Belirtilmemiş Kurum";
    const cleanCampaign = campaignType || "Nexa ERP";

    const newLead = await createCrmLead({
      name,
      email,
      phone,
      company: cleanCompany,
      companyName: cleanCompany,
      jobTitle,
      campaignType: cleanCampaign,
      productSlug: productSlug || cleanCampaign.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      productTitle: cleanCampaign,
      budget,
      notes,
      source: source || "Manuel",
      status: "NEW",
    });

    // Eğer "+ Manuel Lead Ekle" modalında "Kaydet ve Hemen Soğuk Mail Gönder" seçildiyse:
    if (sendColdMailNow) {
      const mailRes = await sendB2bColdEmail({
        to: newLead.email,
        name: newLead.name,
        companyName: cleanCompany,
        jobTitle,
        campaignType: cleanCampaign,
      });

      if (mailRes.success) {
        await updateLeadStage(newLead.id, "EMAILED", {
          lastEmailedAt: new Date(),
          incrementEmailCount: true,
        });
        newLead.status = "EMAILED";
        newLead.emailCount = 1;
        newLead.lastEmailedAt = new Date().toISOString();
      }
    }

    return NextResponse.json({
      success: true,
      message: sendColdMailNow
        ? "Lead kaydedildi ve soğuk satış e-postası gönderildi!"
        : "Potansiyel müşteri CRM'e eklendi.",
      lead: newLead,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lead kaydedilemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let leadId = searchParams.get("id");

    if (!leadId) {
      try {
        const body = await req.json();
        leadId = body.leadId;
      } catch {}
    }

    if (!leadId) {
      return NextResponse.json({ error: "Silinecek leadId belirtilmedi" }, { status: 400 });
    }

    await deleteCrmLead(leadId);
    return NextResponse.json({ success: true, deletedId: leadId });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Silme başarısız" }, { status: 500 });
  }
}
