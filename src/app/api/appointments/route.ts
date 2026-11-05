import { NextResponse } from "next/server";
import {
  getAvailableCalendarSlots,
  createCalendarAppointment,
  MeetingRequest,
} from "@/lib/services/google-calendar-service";
import { createCrmLead } from "@/lib/services/crm-service";
import { sendB2bEmail } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

/**
 * GET: Seçilen tarihteki boş Google Calendar slotlarını listeler.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: "Geçersiz veya eksik tarih parametresi. Format: YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const slots = await getAvailableCalendarSlots(dateStr);

    return NextResponse.json({
      success: true,
      date: dateStr,
      slots,
    });
  } catch (error: any) {
    console.error("[API appointments GET error]:", error);
    return NextResponse.json(
      { error: "Takvim slotları alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

/**
 * POST: Kullanıcı bir randevu slotu seçtiğinde takvimde rezerve eder,
 * Google Meet linki ve RFC 5545 .ics takvim dosyasını üretir,
 * Prisma Lead / CRM tablosuna kaydeder ve Resend API ile e-posta gönderir.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      productSlug,
      notes,
      roiLossEstimate,
    } = body;

    // Temel doğrulama
    if (!date || !time || !customerName || !customerEmail || !companyName) {
      return NextResponse.json(
        {
          error:
            "Eksik bilgi. Tarih, saat, ad soyad, kurumsal e-posta ve şirket adı zorunludur.",
        },
        { status: 400 }
      );
    }

    // 1. Google Calendar'da Randevu ve Meet Linki Oluştur
    const meetingRequest: MeetingRequest = {
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      productSlug: productSlug || "nexa-erp",
      notes,
      roiLossEstimate,
    };

    const meetingResult = await createCalendarAppointment(meetingRequest);

    // 2. Prisma Lead / CRM Tablosuna Kaydet (Aşama: PENDING - Yeni Randevu)
    const detailedNotes = [
      notes || "Strateji ve mimari seansı talebi",
      `Planlanan Saat: ${date} ${time} (TSİ)`,
      `Google Meet: ${meetingResult.meetUrl}`,
      roiLossEstimate ? `Hesaplanan ROI Kaybı: ${roiLossEstimate.toLocaleString("tr-TR")} ₺/ay` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    await createCrmLead({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      companyName,
      productSlug: productSlug || "nexa-erp",
      productTitle: productSlug ? `Nexa ${productSlug.toUpperCase()}` : "Nexa ERP & Mimari",
      budget: roiLossEstimate ? `${roiLossEstimate.toLocaleString("tr-TR")} ₺/ay tasarruf potansiyeli` : "Belirtilmedi",
      notes: detailedNotes,
      source: "InHouse_Scheduler",
    });

    // 3. Resend API ile Kurumsal Onay ve ICS Takvim E-postası Gönder
    try {
      await sendB2bEmail({
        to: customerEmail,
        name: customerName,
        companyName,
        type: "appointment_confirmation",
        data: {
          date,
          time,
          meetUrl: meetingResult.meetUrl,
          productTitle: productSlug || "Nexa ERP & Teknik Mimari",
          notes,
        },
        icsContent: meetingResult.icsContent,
      });
    } catch (mailErr) {
      console.warn("[API appointments] Onay e-postası gönderim uyarısı:", mailErr);
    }

    return NextResponse.json({
      success: true,
      meeting: meetingResult,
      message: "Randevunuz oluşturuldu, takvim davetiyesi e-posta adresinize gönderildi.",
    });
  } catch (error: any) {
    console.error("[API appointments POST error]:", error);
    return NextResponse.json(
      { error: "Randevu oluşturulurken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}

