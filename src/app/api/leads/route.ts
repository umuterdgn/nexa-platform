import { NextRequest, NextResponse } from "next/server";
import { saveLead, getLeads } from "@/lib/content-store";
import { sendLeadMagnetEmail, nodemailerTransporter } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir kurumsal e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanSource = source?.trim() || "Digitalization_PDF_Report";

    // 1. Save to Prisma Lead Model
    const lead = await saveLead(cleanEmail, cleanSource);

    // 2. Automatically send welcome/thank you email with link to B2B Digitalization PDF Report
    await sendLeadMagnetEmail(cleanEmail);

    // 3. Return 200 OK to trigger success animation on frontend
    return NextResponse.json(
      {
        success: true,
        message: "Rapor talebiniz alındı. İndirme bağlantısı e-posta adresinize gönderildi.",
        lead,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Talebiniz kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Leads alınamadı." },
      { status: 500 }
    );
  }
}
