import { Resend } from "resend";

export interface SendEmailPayload {
  to: string;
  name: string;
  companyName: string;
  type: "appointment_confirmation" | "audit_report" | "order_confirmation" | "email_verification";
  data?: {
    date?: string;
    time?: string;
    meetUrl?: string;
    productTitle?: string;
    productSlug?: string;
    roiLossMonthly?: number;
    roiLossYearly?: number;
    notes?: string;
    planName?: string;
    amount?: number;
    ssoUrl?: string;
    verificationCode?: string;
    verificationToken?: string;
    verifyUrl?: string;
  };
  icsContent?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId: string;
  simulated?: boolean;
  message?: string;
}

/**
 * Spam Filtrelerine Takılmayan, Düz Metin (Plain-Text) Görünümlü B2B Executive E-Posta Şablonları
 * HTML yapısı bilinçli olarak sade, yüksek okunabilirlikli ve doğrudan Umut Erdoğan tarafından
 * yazılmış izlenimi veren temiz bir tipografiyle tasarlanmıştır.
 */
function generateExecutiveEmailHtml(payload: SendEmailPayload): { subject: string; html: string; text: string } {
  const { name, companyName, type, data } = payload;
  const currentYear = new Date().getFullYear();

  if (type === "appointment_confirmation") {
    const meetUrl = data?.meetUrl || "https://meet.google.com/nxa-b2b-meet";
    const dateStr = data?.date || "Belirlenen Tarih";
    const timeStr = data?.time || "14:00";
    const product = data?.productTitle || "Nexa ERP & Teknik Mimari";

    const subject = `Nexa Strateji & Mimari Görüşmesi: ${companyName} x Umut Erdoğan`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff;">
  <div style="max-width: 620px; margin: 0 auto;">
    <p>Merhaba ${name},</p>
    
    <p><strong>${companyName}</strong> için talep ettiğiniz Nexa B2B Strateji ve Teknik Mimari seansınız takvimime başarıyla eklendi.</p>
    
    <div style="margin: 24px 0; padding: 18px 20px; background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a; font-size: 16px;">Toplantı Detayları:</p>
      <ul style="margin: 0; padding-left: 20px; color: #334155;">
        <li style="margin-bottom: 6px;"><strong>Tarih:</strong> ${dateStr}</li>
        <li style="margin-bottom: 6px;"><strong>Saat:</strong> ${timeStr} (TSİ / UTC+3 - 45 Dakika)</li>
        <li style="margin-bottom: 6px;"><strong>Görüşme Odası:</strong> <a href="${meetUrl}" style="color: #0284c7; text-decoration: underline; font-weight: 600;" target="_blank">${meetUrl}</a></li>
        <li style="margin-bottom: 6px;"><strong>Odak Konu:</strong> ${product}</li>
        ${data?.notes ? `<li style="margin-bottom: 6px;"><strong>Ön Değerlendirme Notları:</strong> ${data.notes}</li>` : ""}
      </ul>
    </div>

    <p>Görüşmemizde özellikle şu başlıklara odaklanacağız:</p>
    <ul style="color: #334155; padding-left: 20px;">
      <li style="margin-bottom: 6px;">Şantiye / saha şartlarında %100 çevrimdışı (Dexie.js PWA) veri tutarlılığı,</li>
      <li style="margin-bottom: 6px;">3D BIM tabanlı hakediş otomasyonu ve metraj kaçaklarının önlenmesi,</li>
      <li style="margin-bottom: 6px;">Mevcut ERP / muhasebe sistemlerinizle (SAP, Mikro, Logo vb.) entegrasyon fizibilitesi.</li>
    </ul>

    <p>Takvim davetiyeniz (RFC 5545 <strong>.ics</strong> dosyası) bu e-postanın ekinde yer almaktadır. Üzerine tıklayarak Apple Takvim, Outlook veya Google Takviminize doğrudan kaydedebilirsiniz.</p>

    <p style="margin-top: 32px;">Görüşmek üzere,<br>
    <strong>Umut Erdoğan</strong><br>
    Kurucu & Sistem Mimarı | Nexa Global<br>
    <a href="https://nxa.com.tr" style="color: #0284c7; text-decoration: none;">nxa.com.tr</a> &bull; <a href="mailto:umut@nxa.com.tr" style="color: #0284c7; text-decoration: none;">umut@nxa.com.tr</a>
    </p>

    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 36px 0 16px 0;" />
    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
      Bu e-posta nxa.com.tr In-House Randevu Motoru aracılığıyla doğrudan iletilmiştir. © ${currentYear} Nexa Yazılım & B2B SaaS Ekosistemleri.
    </p>
  </div>
</body>
</html>
    `.trim();

    const text = `
Merhaba ${name},

${companyName} için talep ettiğiniz Nexa B2B Strateji ve Teknik Mimari seansınız takvimime başarıyla eklendi.

Toplantı Detayları:
- Tarih: ${dateStr}
- Saat: ${timeStr} (TSİ - 45 Dakika)
- Google Meet Bağlantısı: ${meetUrl}
- Odak Konu: ${product}
${data?.notes ? `- Notlar: ${data.notes}\n` : ""}

Görüşmemizde özellikle saha şartlarında çevrimdışı mimari, hakediş kaçakları ve kurumsal sistem entegrasyonu başlıklarına odaklanacağız.

Takvim davetiyeniz (.ics dosyası) ektedir.

Görüşmek üzere,
Umut Erdoğan
Kurucu & Sistem Mimarı | Nexa Global
https://nxa.com.tr - umut@nxa.com.tr
    `.trim();

    return { subject, html, text };
  }

  if (type === "audit_report") {
    const monthlyLoss = data?.roiLossMonthly ? `${data.roiLossMonthly.toLocaleString("tr-TR")} ₺` : "185.000 ₺+";
    const yearlyLoss = data?.roiLossYearly ? `${data.roiLossYearly.toLocaleString("tr-TR")} ₺` : "2.200.000 ₺+";
    const subject = `${companyName} - Dijitalleşme & Hakediş Kaçağı Teknik Analiz Raporu`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff;">
  <div style="max-width: 620px; margin: 0 auto;">
    <p>Merhaba ${name},</p>
    
    <p>Web sitemizdeki ROI ve Operasyonel Kaçak Hesaplayıcı üzerinden ilettiğiniz parametreleri baz alarak <strong>${companyName}</strong> için hazırladığımız ön analiz raporunu paylaşıyorum.</p>
    
    <div style="margin: 24px 0; padding: 20px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #991b1b; font-size: 16px;">Finansal Kaçak Özeti:</p>
      <p style="margin: 0; color: #b91c1c; font-size: 22px; font-weight: 800;">
        Aylık Tahmini Kayıp: ${monthlyLoss}
      </p>
      <p style="margin: 4px 0 0 0; color: #7f1d1d; font-size: 14px;">
        Yıllık Birikimli Nakit Kaçağı: <strong>${yearlyLoss}</strong>
      </p>
    </div>

    <p><strong>Tespit Edilen 3 Kritik Darboğaz:</strong></p>
    <ol style="color: #334155; padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong>Taşeron Metraj Şişirmesi (%3 Standart Sapma):</strong> Manuel Excel veya statik yazılımlarda 3D BIM modeliyle bağlanmayan imalat hakedişlerinde sektör ortalaması %3 nakit kaçağı oluşmaktadır.</li>
      <li style="margin-bottom: 8px;"><strong>Şantiyede Veri Senkronizasyon Gecikmesi:</strong> İnternet çekmeyen katlarda veya bodrumlarda veri kaybı yaşanmakta, akşam ofiste çift işçilik yapılmaktadır.</li>
      <li style="margin-bottom: 8px;"><strong>Personel & Mesai Takipsizliği:</strong> QR/BLE donanımı olmayan şantiyelerde taşeron personel sayıları şişirilmektedir.</li>
    </ol>

    <p>Bu kayıpları Nexa ERP'nin <strong>Dexie.js Çevrimdışı PWA</strong> ve <strong>3D BIM Otomatik Hakediş Bloke</strong> motoru ile ilk ay içerisinde sıfırlamak mümkündür.</p>

    <p>Sizin için özel bir canlı demo veya POC (Proof of Concept) kurgulamak isterseniz, doğrudan takvimimden uygun bir slot seçebilirsiniz:</p>

    <p style="margin: 20px 0;">
      <a href="https://nxa.com.tr/randevu" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px;">
        Teknik Mimari Seansı Planla &rarr;
      </a>
    </p>

    <p style="margin-top: 32px;">Saygılarımla,<br>
    <strong>Umut Erdoğan</strong><br>
    Kurucu & Sistem Mimarı | Nexa Global<br>
    <a href="mailto:umut@nxa.com.tr" style="color: #0284c7; text-decoration: none;">umut@nxa.com.tr</a>
    </p>
  </div>
</body>
</html>
    `.trim();

    const text = `
Merhaba ${name},

${companyName} için hazırlanan ön analiz raporuna göre:
- Tahmini Aylık Operasyonel Kayıp: ${monthlyLoss}
- Yıllık Birikimli Nakit Kaçağı: ${yearlyLoss}

Bu kayıpların ana nedenleri:
1. 3D BIM hakediş blokesi olmaması nedeniyle taşeron metraj şişirmesi (%3).
2. Şantiye çevrimdışı veri kaybı ve manuel Excel çift işçiliği.
3. Personel ve İSG saha takibinin dijitalleşmemesi.

Bu kayıpları sıfırlamak için takvimimden randevu alabilirsiniz:
https://nxa.com.tr/randevu

Saygılarımla,
Umut Erdoğan - Nexa Global
    `.trim();

    return { subject, html, text };
  }

  if (type === "email_verification") {
    const code = data?.verificationCode || "123456";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nxa.com.tr";
    const verifyLink =
      data?.verifyUrl ||
      `${appUrl}/api/auth/verify?token=${data?.verificationToken || ""}&email=${encodeURIComponent(payload.to)}`;
    const subject = `Nexa Güvenlik & Doğrulama Kodunuz: ${code}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff;">
  <div style="max-width: 580px; margin: 0 auto;">
    <p>Merhaba ${name || "Kullanıcı"},</p>
    
    <p>Nexa B2B Cloud Platformuna hoş geldiniz. Hesabınızı güvenle aktifleştirmek, PayTR ödeme adımına ve kurumsal SSO yönetim panellerinize erişebilmek için aşağıdaki 6 haneli doğrulama kodunu kullanın:</p>
    
    <div style="margin: 28px 0; padding: 24px; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; text-align: center;">
      <span style="font-size: 12px; font-family: monospace; text-transform: uppercase; color: #0284c7; letter-spacing: 1px; font-weight: 600;">Tek Kullanımlık Doğrulama Kodu (OTP)</span>
      <div style="font-size: 36px; font-family: monospace; letter-spacing: 8px; font-weight: 800; color: #0369a1; margin: 12px 0;">
        ${code}
      </div>
      <p style="margin: 0; font-size: 13px; color: #64748b;">Bu kod 24 saat boyunca geçerlidir.</p>
    </div>

    <p>Alternatif olarak aşağıdaki bağlantıya tıklayarak hesabınızı doğrudan tek tıkla onaylayabilirsiniz:</p>

    <p style="margin: 20px 0;">
      <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px;">
        Hesabımı Doğrula ve Devam Et &rarr;
      </a>
    </p>

    <p style="color: #64748b; font-size: 13px;">Eğer bu kaydı siz başlatmadıysanız bu e-postayı dikkate almayabilirsiniz.</p>

    <p style="margin-top: 32px;">Saygılarımızla,<br>
    <strong>Nexa Güvenlik Ekibi</strong><br>
    <a href="https://nxa.com.tr" style="color: #0284c7; text-decoration: none;">nxa.com.tr</a> &bull; <a href="mailto:guvenlik@nxa.com.tr" style="color: #0284c7; text-decoration: none;">guvenlik@nxa.com.tr</a>
    </p>
  </div>
</body>
</html>
    `.trim();

    const text = `
Merhaba ${name || "Kullanıcı"},

Nexa hesabınızı aktifleştirmek için 6 haneli doğrulama kodunuz:
${code}

Veya doğrudan doğrulamak için aşağıdaki bağlantıya tıklayın:
${verifyLink}

Bu kod 24 saat geçerlidir.

Nexa Güvenlik Ekibi
guvenlik@nxa.com.tr - https://nxa.com.tr
    `.trim();

    return { subject, html, text };
  }

  // order_confirmation
  const plan = data?.planName || "Kurumsal Yıllık Lisans";
  const product = data?.productTitle || "Nexa ERP Ekosistemi";
  const ssoUrl = data?.ssoUrl || "https://nxa.com.tr/profil";
  const subject = `Nexa Lisans Aktivasyonu ve Kurumsal Erişim - ${companyName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff;">
  <div style="max-width: 620px; margin: 0 auto;">
    <p>Sayın ${name},</p>
    
    <p><strong>${companyName}</strong> adına gerçekleştirdiğiniz <strong>${product} (${plan})</strong> lisans aktivasyonunuz tamamlanmıştır.</p>
    
    <div style="margin: 24px 0; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 6px;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #166534; font-size: 16px;">Abonelik & Erişim Bilgileri:</p>
      <ul style="margin: 0; padding-left: 20px; color: #15803d;">
        <li style="margin-bottom: 6px;"><strong>Kurum:</strong> ${companyName}</li>
        <li style="margin-bottom: 6px;"><strong>Hizmet:</strong> ${product}</li>
        <li style="margin-bottom: 6px;"><strong>Paket:</strong> ${plan}</li>
        <li style="margin-bottom: 6px;"><strong>Durum:</strong> Aktif / Canlıda</li>
      </ul>
    </div>

    <p>Yönetim konsolunuza ve özel SaaS panellerinize doğrudan Müşteri Portalı üzerinden tek tıkla (SSO) erişebilirsiniz:</p>

    <p style="margin: 24px 0;">
      <a href="${ssoUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px;">
        Müşteri Konsoluna Git &rarr;
      </a>
    </p>

    <p>Kurumsal onboarding ve teknik entegrasyon desteği için doğrudan mühendislik ekibimizle iletişime geçebilirsiniz.</p>

    <p style="margin-top: 32px;">Başarılar dileriz,<br>
    <strong>Nexa Global Mühendislik Ekibi</strong><br>
    <a href="https://nxa.com.tr" style="color: #0284c7; text-decoration: none;">nxa.com.tr</a> &bull; <a href="mailto:destek@nxa.com.tr" style="color: #0284c7; text-decoration: none;">destek@nxa.com.tr</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Sayın ${name},

${companyName} adına ${product} (${plan}) lisans aktivasyonunuz tamamlanmıştır.

Müşteri konsolunuza erişmek için:
${ssoUrl}

Nexa Global Mühendislik Ekibi
destek@nxa.com.tr - https://nxa.com.tr
  `.trim();

  return { subject, html, text };
}

/**
 * Resend API Servisi - B2B Kurumsal E-Posta Gönderimi
 */
export async function sendB2bEmail(payload: SendEmailPayload): Promise<EmailSendResult> {
  const { subject, html, text } = generateExecutiveEmailHtml(payload);
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Umut Erdoğan <umut@nxa.com.tr>";

  // Eğer geçerli bir API anahtarı yoksa veya test modundaysa simüle et
  if (!apiKey || apiKey === "re_dummy_build_key" || apiKey.startsWith("dummy")) {
    console.log(`[EmailService] Resend API Key test modunda. E-posta simüle edildi:
    Alıcı: ${payload.to} (${payload.name} / ${payload.companyName})
    Konu: ${subject}
    ICS Eki: ${payload.icsContent ? "Var (" + payload.icsContent.length + " bayt)" : "Yok"}`);

    return {
      success: true,
      messageId: `sim_msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      simulated: true,
      message: "E-posta simülasyonu başarıyla tamamlandı (Dev ortamı).",
    };
  }

  try {
    const resend = new Resend(apiKey);

    const attachments: any[] = [];
    if (payload.icsContent) {
      attachments.push({
        filename: "nexa-strateji-toplanti.ics",
        content: Buffer.from(payload.icsContent, "utf-8").toString("base64"),
      });
    }

    const res = await resend.emails.send({
      from: fromEmail,
      to: [payload.to],
      bcc: ["umut@nxa.com.tr"],
      subject,
      html,
      text,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (res.error) {
      console.warn("[EmailService] Resend gönderim hatası:", res.error);
      return {
        success: false,
        messageId: "",
        message: res.error.message || "E-posta gönderilemedi.",
      };
    }

    console.log(`[EmailService] E-posta başarıyla iletildi: ID=${res.data?.id}`);
    return {
      success: true,
      messageId: res.data?.id || `msg_${Date.now()}`,
      message: "E-posta başarıyla gönderildi.",
    };
  } catch (err: any) {
    console.error("[EmailService] E-posta gönderme istisnası:", err);
    return {
      success: false,
      messageId: "",
      message: err?.message || "E-posta servisiyle iletişim kurulamadı.",
    };
  }
}

