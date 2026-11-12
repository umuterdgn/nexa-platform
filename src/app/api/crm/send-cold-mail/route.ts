import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findCrmLeadById, updateLeadStage } from "@/lib/services/crm-service";
import { sendB2bColdEmail } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

/**
 * POST /api/crm/send-cold-mail
 * Seçili bir Lead'e Resend API üzerinden kişiselleştirilmiş, spama takılmayan
 * B2B soğuk e-posta (outbound cold email) gönderir ve durumunu EMAILED yapar.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const authHeader = req.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // Admin oturumu veya geçerli webhook secret kontrolü
    const isAdmin = session?.user?.role === "admin";
    const isWebhookAuthorized =
      webhookSecret && authHeader === `Bearer ${webhookSecret}`;

    if (!isAdmin && !isWebhookAuthorized) {
      return NextResponse.json(
        { error: "Yetkisiz Erişim. Sadece yöneticiler soğuk mail tetikleyebilir." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { leadId, customNote } = body;

    let targetEmail = body.email;
    let targetName = body.name;
    let targetCompany = body.company || body.companyName;
    let targetJobTitle = body.jobTitle;
    let targetCampaign = body.campaignType;

    let existingLead: any = null;

    // Eğer leadId verilmişse veritabanından getir
    if (leadId) {
      existingLead = await findCrmLeadById(leadId);
      if (!existingLead) {
        return NextResponse.json(
          { error: `Belirtilen ID (${leadId}) ile Lead kaydı bulunamadı.` },
          { status: 404 }
        );
      }

      targetEmail = existingLead.email;
      targetName = existingLead.name || targetEmail.split("@")[0];
      targetCompany = existingLead.company || existingLead.companyName || "Şirketiniz";
      targetJobTitle = existingLead.jobTitle || "";
      targetCampaign = body.campaignType || existingLead.campaignType || "Nexa ERP";
    }

    if (!targetEmail) {
      return NextResponse.json(
        { error: "E-posta adresi eksik veya geçersiz." },
        { status: 400 }
      );
    }

    // 1. Resend API ile soğuk maili fırlat
    const emailResult = await sendB2bColdEmail({
      to: targetEmail,
      name: targetName || "Yetkili",
      companyName: targetCompany || "Şirketiniz",
      jobTitle: targetJobTitle,
      campaignType: targetCampaign || "Nexa ERP",
      customNote,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error: emailResult.message || "E-posta gönderimi başarısız oldu.",
        },
        { status: 500 }
      );
    }

    // 2. Veritabanındaki Lead durumunu "EMAILED" olarak güncelle
    if (leadId) {
      await updateLeadStage(leadId, "EMAILED", {
        lastEmailedAt: new Date(),
        incrementEmailCount: true,
      });
    }

    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId,
      subject: emailResult.subject,
      simulated: emailResult.simulated || false,
      message: `${targetEmail} adresine soğuk satış e-postası başarıyla iletildi.`,
      leadId: leadId || null,
      status: "EMAILED",
    });
  } catch (error: any) {
    console.error("[POST /api/crm/send-cold-mail error]:", error);
    return NextResponse.json(
      { error: error?.message || "Soğuk mail gönderilirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}

