import { NextResponse } from "next/server";
import { createCrmLead } from "@/lib/services/crm-service";

export const dynamic = "force-dynamic";

/**
 * Make.com, PhantomBuster, Zapier veya harici B2B veri toplayıcılarından
 * gelen lead verilerini Prisma CRM'e aktaran otonom webhook uç noktası.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // Eğer secret tanımlanmışsa bearer token kontrolü yap
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      const apiKeyQuery = new URL(req.url).searchParams.get("key");
      if (apiKeyQuery !== webhookSecret) {
        return NextResponse.json(
          { error: "Geçersiz webhook yetkilendirme anahtarı." },
          { status: 401 }
        );
      }
    }

    const body = await req.json();

    // PhantomBuster / Make.com değişken formatlarını tolere et
    const name =
      body.name ||
      body.fullName ||
      body.first_name ||
      body.contactName ||
      (body.email ? body.email.split("@")[0] : "B2B Yetkilisi");
    const email = body.email || body.contactEmail || body.workEmail;
    const company = body.company || body.companyName || body.organization || "Belirtilmemiş Kurum";
    const phone = body.phone || body.phoneNumber || body.mobile;
    const source = body.source || body.channel || "Make_Webhook";
    const productSlug = body.productSlug || body.service || "nexa-erp";
    const budget = body.budget || body.estimatedBudget || "Otomatik Entegrasyon";
    const notes =
      body.notes ||
      body.message ||
      body.description ||
      `PhantomBuster/Make.com otonom lead aktarımı. Pozisyon: ${body.title || "Yönetici"}`;

    if (!email) {
      return NextResponse.json(
        { error: "Eksik e-posta. Lead aktarımı için en azından 'email' alanı zorunludur." },
        { status: 400 }
      );
    }

    const createdLead = await createCrmLead({
      name,
      email,
      phone,
      companyName: company,
      productSlug,
      productTitle: body.productTitle || `Nexa ${productSlug.toUpperCase()}`,
      budget,
      notes,
      source: `Webhook_${source}`,
    });

    console.log(
      `[Webhook Leads] Harici B2B Lead başarıyla CRM'e kaydedildi: ${email} (${company}) - Kaynak: ${source}`
    );

    return NextResponse.json({
      success: true,
      leadId: createdLead.id,
      receivedAt: new Date().toISOString(),
      message: "Lead başarıyla CRM veritabanına aktarıldı.",
    });
  } catch (error: any) {
    console.error("[Webhook leads POST error]:", error);
    return NextResponse.json(
      { error: "Webhook verisi işlenirken hata oluştu." },
      { status: 500 }
    );
  }
}

