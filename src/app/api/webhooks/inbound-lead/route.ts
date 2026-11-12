import { NextResponse } from "next/server";
import { createCrmLead, updateLeadStage } from "@/lib/services/crm-service";
import { sendB2bColdEmail } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/inbound-lead
 * Make.com, PhantomBuster, Zapier veya LinkedIn Scraper botlarından
 * gelen B2B potansiyel müşteri verilerini otomatik olarak Prisma Lead tablosuna kaydeder.
 * 
 * Opsiyonel: query'de ?autoMail=true veya body'de autoColdMail: true varsa
 * ilk soğuk e-postayı anında otonom olarak iletir.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET || "nexa-lead-webhook-secret-2026";
    const { searchParams } = new URL(req.url);
    const keyParam = searchParams.get("key");
    const autoMailQuery = searchParams.get("autoMail") === "true";

    // Güvenlik doğrulaması
    const isBearerValid = authHeader === `Bearer ${webhookSecret}`;
    const isKeyValid = keyParam === webhookSecret;

    // Eğer secret tanımlıysa ve iki yöntemden biri tutmuyorsa 401 dön (Dev ortamında esnek)
    if (webhookSecret && !isBearerValid && !isKeyValid && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Geçersiz webhook yetkilendirme anahtarı." },
        { status: 401 }
      );
    }

    const payload = await req.json();

    // PhantomBuster tek obje veya toplu dizi (array) gönderebilir
    const rawItems: any[] = Array.isArray(payload) ? payload : [payload];
    const createdLeads: any[] = [];

    for (const item of rawItems) {
      // 1. İsim normalizasyonu
      const firstName = item.firstName || item.first_name || item.given_name || "";
      const lastName = item.lastName || item.last_name || item.family_name || "";
      const combinedName = `${firstName} ${lastName}`.trim();
      const name =
        item.name ||
        item.fullName ||
        item.full_name ||
        combinedName ||
        (item.email ? item.email.split("@")[0] : "B2B Yetkilisi");

      // 2. E-posta adresi
      const email = item.email || item.mail || item.workEmail || item.contactEmail;
      if (!email || !String(email).includes("@")) {
        continue; // Geçerli e-postası olmayan kayıtları atla
      }

      // 3. Şirket ve Ünvan
      const company =
        item.company ||
        item.companyName ||
        item.company_name ||
        item.organization ||
        item.current_company ||
        "Belirtilmemiş Kurum";

      const jobTitle =
        item.jobTitle ||
        item.job_title ||
        item.title ||
        item.occupation ||
        item.headline ||
        item.position ||
        "Yönetici";

      // 4. Kampanya ve Kaynak
      const campaignType =
        item.campaignType ||
        item.campaign ||
        item.product ||
        item.productTitle ||
        "Nexa ERP";

      const source =
        item.source ||
        item.channel ||
        "PhantomBuster/LinkedIn";

      const phone = item.phone || item.phoneNumber || item.mobile || null;
      const linkedinUrl = item.profileUrl || item.linkedinUrl || item.linkedin || "";

      const notes = [
        item.notes || item.description || item.summary || "",
        linkedinUrl ? `LinkedIn: ${linkedinUrl}` : "",
        jobTitle ? `Ünvan: ${jobTitle}` : "",
        `Kaynak: ${source}`,
      ]
        .filter(Boolean)
        .join(" | ");

      // Lead oluştur
      const lead = await createCrmLead({
        name,
        email: String(email).trim().toLowerCase(),
        phone,
        company,
        companyName: company,
        jobTitle,
        campaignType,
        productSlug: campaignType.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        productTitle: campaignType,
        notes,
        source,
        status: "NEW",
      });

      // 5. Otonom Soğuk Mail Tetikleme (İsteğe bağlı)
      const shouldSendColdMail =
        autoMailQuery ||
        item.autoColdMail === true ||
        item.sendEmailNow === true;

      if (shouldSendColdMail) {
        try {
          await sendB2bColdEmail({
            to: email,
            name,
            companyName: company,
            jobTitle,
            campaignType,
          });
          await updateLeadStage(lead.id, "EMAILED", {
            lastEmailedAt: new Date(),
            incrementEmailCount: true,
          });
          lead.status = "EMAILED";
        } catch (mailErr) {
          console.warn(`[Inbound Webhook] Soğuk mail gönderim uyarısı (${email}):`, mailErr);
        }
      }

      createdLeads.push(lead);
    }

    console.log(
      `[Inbound Webhook] PhantomBuster/Make.com üzerinden ${createdLeads.length} yeni Lead CRM'e eklendi.`
    );

    return NextResponse.json({
      success: true,
      count: createdLeads.length,
      leads: createdLeads,
      message: `${createdLeads.length} potansiyel müşteri başarıyla CRM'e aktarıldı.`,
    });
  } catch (error: any) {
    console.error("[Inbound Webhook error]:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook işlenirken hata oluştu." },
      { status: 500 }
    );
  }
}

