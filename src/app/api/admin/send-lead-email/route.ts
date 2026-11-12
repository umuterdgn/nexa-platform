import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findCrmLeadById, updateLeadStage } from "@/lib/services/crm-service";
import { sendLeadFollowUpEmail } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/send-lead-email
 * CRM ekranındaki "Otomatik Mail Yolla" butonu tarafından tetiklenir.
 * Müşteriye "Talebiniz alınmıştır, [Ürün] için size en kısa sürede ulaşacağız"
 * temalı kurumsal B2B e-postasını Resend API ile gönderir ve lead statüsünü
 * anında "CONTACTED" (İletişime Geçildi) olarak günceller.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim. Yönetici oturumu gereklidir." }, { status: 401 });
    }

    const body = await req.json();
    const { leadId, email, name, company, requestedProduct, message } = body;

    let targetEmail = email;
    let targetName = name;
    let targetCompany = company;
    let targetProduct = requestedProduct;
    let targetMessage = message;

    // Eğer leadId varsa ve bilgiler eksikse DB'den çek
    if (leadId) {
      const existingLead = await findCrmLeadById(leadId);
      if (existingLead) {
        targetEmail = targetEmail || existingLead.email;
        targetName = targetName || existingLead.name;
        targetCompany = targetCompany || existingLead.company || existingLead.companyName;
        targetProduct = targetProduct || existingLead.requestedProduct || existingLead.campaignType || existingLead.productTitle;
        targetMessage = targetMessage || existingLead.message || existingLead.notes;
      }
    }

    if (!targetEmail || !targetEmail.includes("@")) {
      return NextResponse.json(
        { error: "Geçerli bir alıcı e-posta adresi bulunamadı." },
        { status: 400 }
      );
    }

    // Kurumsal B2B E-postasını Gönder
    const emailResult = await sendLeadFollowUpEmail({
      to: targetEmail,
      name: targetName || "Değerli Müşterimiz",
      company: targetCompany || "Kurumunuz",
      requestedProduct: targetProduct || "Nexa ERP & Kurumsal Çözümler",
      message: targetMessage,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error: emailResult.message || "E-posta gönderilemedi.",
          simulated: emailResult.simulated,
        },
        { status: 500 }
      );
    }

    // Lead Durumunu "CONTACTED" Olarak Güncelle
    if (leadId) {
      await updateLeadStage(leadId, "CONTACTED", {
        lastEmailedAt: new Date(),
        incrementEmailCount: true,
      });
    }

    return NextResponse.json({
      success: true,
      status: "CONTACTED",
      message: `"${targetProduct || "Nexa Çözümleri"}" için kurumsal bilgilendirme e-postası başarıyla gönderildi ve aşama 'CONTACTED' olarak güncellendi.`,
      simulated: emailResult.simulated,
      messageId: emailResult.messageId,
    });
  } catch (error: any) {
    console.error("[send-lead-email API error]:", error);
    return NextResponse.json(
      { error: error?.message || "E-posta gönderimi ve durum güncellemesi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

