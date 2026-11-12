import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectMongoDB } from "@/lib/mongodb";
import { Quote } from "@/models/Quote";
import { createCrmLead } from "@/lib/services/crm-service";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_build_key");

// 1. YENİ TEKLİF OLUŞTURMA FONKSİYONU (Formdan Gelenler İçin)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const details = formData.get("details") as string;
    const company = (formData.get("company") as string) || name || "Belirtilmemiş Şirket";
    const requestedProduct = (formData.get("requestedProduct") as string) || "Nexa Özel Proje & Teklif";
    const file = formData.get("file") as File | null;

    // 1. Prisma CRM & ContactRequest Modeline Kaydet (Admin Paneli / CRM için)
    try {
      await createCrmLead({
        name: name || "İsimsiz Talep",
        email: email || "iletisim@musteri.com",
        phone: phone || undefined,
        company: company,
        companyName: company,
        requestedProduct: requestedProduct,
        campaignType: requestedProduct,
        message: details,
        notes: details,
        source: "Web Formu / Teklif Talebi",
        status: "NEW",
      });
    } catch (crmErr) {
      console.warn("[Teklif API] CRM Lead kayıt uyarısı:", crmErr);
    }

    // 2. Mongoose (Legacy Veritabanı) Kaydet
    try {
      await connectMongoDB();
      await Quote.create({
        name,
        email: email || "Belirtilmedi",
        phone: phone || "Belirtilmedi",
        company,
        serviceType: requestedProduct,
        details,
      });
    } catch (mongoErr) {
      console.warn("[Teklif API] Mongo kayıt uyarısı:", mongoErr);
    }

    let attachments = [];

    // Eğer dosya yüklendiyse e-postaya ekle
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // 2. Sana Bildirim E-postası Gönder
    await resend.emails.send({
      from: "Nexa Sistem <info@nxa.com.tr>",
      to: "info@nxa.com.tr", // Kendi e-postan
      subject: `Yeni Teklif Talebi: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Yeni Bir Teklif Talebi Var! 🚀</h2>
          <p><strong>Müşteri Adı:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email || "Girilmedi"}</p>
          <p><strong>Telefon:</strong> ${phone || "Girilmedi"}</p>
          <hr />
          <h3>Proje Detayları:</h3>
          <p style="white-space: pre-wrap;">${details}</p>
          <br />
          <p><small>${attachments.length > 0 ? "📎 Bu talebe bir dosya eklendi (Ekte bulabilirsin)." : "Herhangi bir dosya eklenmedi."}</small></p>
        </div>
      `,
      attachments: attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Teklif form hatası:", error);
    return NextResponse.json({ error: "Form gönderilemedi" }, { status: 500 });
  }
}

// 2. TEKLİF DURUMU GÜNCELLEME FONKSİYONU (Admin Paneli İçin)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    await connectMongoDB();
    // İlgili teklifi bulup durumunu güncelliyoruz
    await Quote.findByIdAndUpdate(id, { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Durum güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Durum güncellenemedi" },
      { status: 500 },
    );
  }
}
