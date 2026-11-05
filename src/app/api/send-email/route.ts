import { NextResponse } from "next/server";
import { sendB2bEmail, SendEmailPayload } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, name, companyName, type, data, icsContent } = body;

    if (!to || !name || !companyName || !type) {
      return NextResponse.json(
        {
          error: "Eksik parametre. 'to', 'name', 'companyName' ve 'type' alanları zorunludur.",
        },
        { status: 400 }
      );
    }

    if (!["appointment_confirmation", "audit_report", "order_confirmation", "email_verification"].includes(type)) {
      return NextResponse.json(
        {
          error: "Geçersiz e-posta türü. Kabul edilen: appointment_confirmation, audit_report, order_confirmation, email_verification",
        },
        { status: 400 }
      );
    }

    const payload: SendEmailPayload = {
      to,
      name,
      companyName,
      type,
      data,
      icsContent,
    };

    const result = await sendB2bEmail(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || "E-posta gönderimi başarısız oldu.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      simulated: result.simulated,
      message: result.message,
    });
  } catch (error: any) {
    console.error("[API send-email error]:", error);
    return NextResponse.json(
      { error: "Sunucu hatası: E-posta işlenemedi." },
      { status: 500 }
    );
  }
}

