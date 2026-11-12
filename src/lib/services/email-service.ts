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

export interface SendColdMailPayload {
  to: string;
  name: string;
  companyName: string;
  jobTitle?: string;
  campaignType?: string; // "Nexa ERP", "Franchise", "POS", "E-Ticaret", "Custom Software"
  customNote?: string;
}

/**
 * B2B Outbound Soğuk E-Posta Şablon Üreticisi
 * Spam filtrelerine takılmayan, sade, kişiselleştirilmiş ve direkt kurucu ağzından yazılmış metinler.
 */
export function generateColdEmailContent(payload: SendColdMailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const name = payload.name?.trim() || "Yetkili";
  const company = payload.companyName?.trim() || "Şirketiniz";
  const title = payload.jobTitle?.trim() || "";
  const campaign = (payload.campaignType || "Nexa ERP").toLowerCase();

  let subject = `${company} süreçleri & Nexa B2B mimarisi hakkında`;
  let hookParagraph = "";
  let valuePoints = "";

  if (campaign.includes("erp") || campaign.includes("inşaat") || campaign.includes("santiye")) {
    subject = `${company} şantiye & hakediş mimarisi hakkında (${name})`;
    hookParagraph = `${company} bünyesinde ${title ? `${title} olarak ` : ""}yürüttüğünüz şantiye ve taahhüt operasyonlarını yakından takip ediyorum.`;
    valuePoints = `Geleneksel ERP'lerin sahada internetsiz çalışamaması ve taşeron hakedişlerindeki metraj şişirmeleri inşaat şirketlerinde ciddi kâr erimelerine yol açıyor.

Nexa ERP ile geliştirdiğimiz altyapıda:
• İnternet olmayan şantiyede dahi kesintisiz veri girişi (%100 Çevrimdışı Dexie.js PWA),
• 3D/5D BIM modelindeki onaylı sınırları aşan imalatlarda otomatik hakediş blokesi,
• YİBF ve Türkiye yapı denetim süreçleriyle çift yönlü mutabakat sağlıyoruz.`;
  } else if (campaign.includes("franchise") || campaign.includes("rollout") || campaign.includes("sube") || campaign.includes("mağaza")) {
    subject = `${company} şube rollout & denetim süreçleri (${name})`;
    hookParagraph = `${company} markasının büyüme ve şubeleşme (rollout) operasyonlarını ilgiyle izliyorum.`;
    valuePoints = `Çoklu mağaza açılışlarında yaşanan taşeron gecikmeleri, teslimat (punch list) QA eksikleri ve şube ciro/royalty takibi büyüme hızını kesebiliyor.

Nexa Franchise ile:
• Yeni şube açılışlarını harita ve Stage-Gate onay kapılarıyla tek ekrandan yönetme,
• Mağaza 3D mimari şablonları üzerinden eksiksiz taşeron denetimi,
• Konsolide satın alma ve anlık şube ciro royalty otomasyonu sunuyoruz.`;
  } else if (campaign.includes("pos") || campaign.includes("kasa") || campaign.includes("restoran") || campaign.includes("cafe")) {
    subject = `${company} kasa & operasyon altyapısı (${name})`;
    hookParagraph = `${company} bünyesindeki perakende / servis noktalarında kasa ve sipariş süreçlerini inceledim.`;
    valuePoints = `Mevcut yazar kasa ve donanımların hantallığı yoğun saatlerde müşteri kaybına sebep olabiliyor.

Nexa POS ile:
• STM Yazılım ve Artı POS donanımlarıyla tak-çalıştır entegrasyon,
• QR Menü, garson el terminali ve mutfak ekranı (KDS) arasında sıfır gecikmeli haberleşme,
• İnternet kopsa dahi kesintisiz çalışan çevrimdışı bulut kasa mimarisi sağlıyoruz.`;
  } else if (campaign.includes("ticaret") || campaign.includes("commerce") || campaign.includes("filo") || campaign.includes("lojistik")) {
    subject = `${company} e-ticaret & filo lojistik mimarisi (${name})`;
    hookParagraph = `${company} lojistik ve sevkiyat süreçlerini daha verimli kılmak adına sizinle iletişime geçmek istedim.`;
    valuePoints = `API-first headless altyapımız ile B2B bayi portalı, anlık filo GPS telemetrisi ve teslimat süresini %30 azaltan yapay zeka destekli rota optimizasyonunu tek platformda birleştirdik.`;
  } else {
    subject = `${company} x Nexa: Kurumsal SaaS & Entegrasyon (${name})`;
    hookParagraph = `${company} bünyesindeki ${title ? `${title} pozisyonunuz ve ` : ""}dijital dönüşüm hedeflerinizi yakından inceliyorum.`;
    valuePoints = `Şirketinizin mevcut SAP, Logo veya şirket içi veri tabanı sistemleriyle çift yönlü çalışan, NeonDB serverless PostgreSQL altyapılı ve %100 kod mülkiyeti şirketinizde kalan terzi işi kurumsal SaaS çözümleri üretiyoruz.`;
  }

  const text = `
Merhaba ${name},

${hookParagraph}

${valuePoints}

${payload.customNote ? `\nEk Not: ${payload.customNote}\n` : ""}
Önümüzdeki günlerde takviminiz uygunsa, ${company} için 15 dakikalık kısa bir canlı teknik demo sunmak isterim. Doğrudan takvimimden size en uygun saati seçebilirsiniz:
https://nxa.com.tr/randevu

Veya bu e-postayı uygun olduğunuz bir gün ve saati belirterek doğrudan yanıtlayabilirsiniz.

Başarılar dilerim,

Umut Erdoğan
Kurucu & Sistem Mimarı | Nexa Global
umut@nxa.com.tr | +90 850 308 6392
https://nxa.com.tr

---
Not: Bu bilgilendirme e-postasını almak istemiyorsanız "Listeden Çıkar" yazarak yanıtlamanız yeterlidir.
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto;">
    <p>Merhaba ${name},</p>
    
    <p>${hookParagraph}</p>
    
    <div style="margin: 20px 0; padding: 18px 20px; background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px; white-space: pre-line; color: #334155; font-size: 14px; line-height: 1.65;">
${valuePoints}
    </div>

    ${payload.customNote ? `<p style="color: #475569; font-style: italic;"><strong>Not:</strong> ${payload.customNote}</p>` : ""}

    <p>Önümüzdeki günlerde takviminiz uygunsa, <strong>${company}</strong> süreçleri için 15 dakikalık kısa bir canlı demo sunmak isterim.</p>

    <p style="margin: 26px 0;">
      <a href="https://nxa.com.tr/randevu" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px;">
        Takvimden 15 Dakikalık Demo Seçin &rarr;
      </a>
    </p>

    <p style="font-size: 13px; color: #64748b;">
      (Veya bu e-postayı uygun olduğunuz gün/saati belirterek doğrudan yanıtlayabilirsiniz.)
    </p>

    <p style="margin-top: 32px; border-top: 1px solid #e2e8f0; pt-4; font-size: 14px;">
      Görüşmek dileğiyle,<br>
      <strong>Umut Erdoğan</strong><br>
      Kurucu & Sistem Mimarı | Nexa Global<br>
      <a href="https://nxa.com.tr" style="color: #0284c7; text-decoration: none;">nxa.com.tr</a> &bull; <a href="mailto:umut@nxa.com.tr" style="color: #0284c7; text-decoration: none;">umut@nxa.com.tr</a>
    </p>

    <p style="margin-top: 24px; font-size: 11px; color: #94a3b8;">
      Bu e-posta nxa.com.tr Outbound B2B İletişim Motoru tarafından iletilmiştir. Gelecekte e-posta almak istemiyorsanız "Çıkar" yazarak yanıtlamanız yeterlidir.
    </p>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

/**
 * Resend API ile B2B Soğuk Satış E-Postası (Outbound Cold Email) Gönderir
 */
export async function sendB2bColdEmail(payload: SendColdMailPayload): Promise<EmailSendResult & { subject?: string }> {
  const { subject, html, text } = generateColdEmailContent(payload);
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Umut Erdoğan <umut@nxa.com.tr>";

  if (!apiKey || apiKey === "re_dummy_build_key" || apiKey.startsWith("dummy")) {
    console.log(`[EmailService] Resend API Key test modunda. Soğuk e-posta simüle edildi:
    Alıcı: ${payload.to} (${payload.name} / ${payload.companyName})
    Konu: ${subject}
    Kampanya: ${payload.campaignType || "Genel"}`);

    return {
      success: true,
      messageId: `sim_cold_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      simulated: true,
      subject,
      message: "Soğuk e-posta simülasyonu başarıyla tamamlandı (Dev ortamı).",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const res = await resend.emails.send({
      from: fromEmail,
      to: [payload.to],
      bcc: ["umut@nxa.com.tr"],
      replyTo: "umut@nxa.com.tr",
      subject,
      html,
      text,
    });

    if (res.error) {
      console.warn("[EmailService] Cold email gönderim hatası:", res.error);
      return {
        success: false,
        messageId: "",
        subject,
        message: res.error.message || "Soğuk e-posta gönderilemedi.",
      };
    }

    console.log(`[EmailService] Soğuk e-posta iletildi: ID=${res.data?.id}`);
    return {
      success: true,
      messageId: res.data?.id || `msg_${Date.now()}`,
      subject,
      message: "Soğuk e-posta başarıyla iletildi.",
    };
  } catch (err: any) {
    console.error("[EmailService] Cold email hatası:", err);
    return {
      success: false,
      messageId: "",
      subject,
      message: err?.message || "Soğuk e-posta servisine erişilemedi.",
    };
  }
}

export interface SendLeadFollowUpEmailPayload {
  to: string;
  name: string;
  company?: string;
  requestedProduct?: string;
  message?: string;
}

/**
 * Müşteri taleplerine (Strateji Toplantısı, Demo İste, Web Formu) kurumsal
 * "Talebiniz alınmıştır, [Ürün] için size en kısa sürede ulaşacağız" e-postası gönderir.
 */
export async function sendLeadFollowUpEmail(payload: SendLeadFollowUpEmailPayload): Promise<EmailSendResult & { subject?: string }> {
  const name = payload.name || "Değerli Müşterimiz";
  const company = payload.company || "Şirketiniz";
  const product = payload.requestedProduct || "Nexa Kurumsal Çözümleri";
  const subject = `Talebiniz Alındı: ${product} | Nexa B2B Sistemleri`;
  const currentYear = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; background-color: #ffffff;">
  <div style="max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; background-color: #ffffff;">
    <div style="margin-bottom: 24px; border-bottom: 2px solid #0284c7; padding-bottom: 12px;">
      <span style="font-size: 11px; font-family: monospace; font-weight: bold; color: #0284c7; text-transform: uppercase; letter-spacing: 2px;">NEXA B2B ENTERPRISE ARCHITECTURE</span>
      <h2 style="margin: 6px 0 0 0; font-size: 20px; color: #0f172a;">Talebiniz Alınmıştır</h2>
    </div>

    <p style="font-size: 16px; color: #0f172a;">Sayın <strong>${name}</strong>,</p>
    
    <p><strong>${company}</strong> adına iletmiş olduğunuz <strong>${product}</strong> talebiniz ve sistem ön değerlendirme kaydınız Nexa mühendislik ekibimiz tarafından başarıyla alınmıştır.</p>
    
    <div style="margin: 22px 0; padding: 18px 20px; background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a; font-size: 15px;">Ön Kayıt Özeti:</p>
      <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px;">
        <li style="margin-bottom: 6px;"><strong>İlgilenilen Ürün/Çözüm:</strong> ${product}</li>
        <li style="margin-bottom: 6px;"><strong>Kurum:</strong> ${company}</li>
        ${payload.message ? `<li style="margin-bottom: 6px;"><strong>İletilen Proje Notu:</strong> ${payload.message}</li>` : ""}
        <li><strong>Durum:</strong> Değerlendirmede &bull; Öncelikli Randevu Sırasında</li>
      </ul>
    </div>

    <p style="font-weight: 600; color: #0f172a; font-size: 15px;">
      Talebiniz alınmıştır, <strong>${product}</strong> için size en kısa sürede ulaşacağız.
    </p>

    <p style="color: #475569;">
      Bu süreçte şantiyelerinizde/operasyonlarınızda %100 çevrimdışı (offline-first PWA) çalışma, Dexie.js veri tutarlılığı veya mevcut ERP entegrasyonu (SAP, Mikro, Logo vb.) ihtiyaçlarınızı doğrudan inceleyip şirketinize özel teknik mimari yol haritası ile birlikte döneceğiz.
    </p>

    <p style="margin: 28px 0;">
      <a href="https://nxa.com.tr/randevu" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px;">
        Görüşmeyi Takvimden Şimdi Netleştirin &rarr;
      </a>
    </p>

    <p style="margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 14px; color: #334155;">
      Saygılarımızla,<br>
      <strong>Umut Erdoğan</strong><br>
      Kurucu & Sistem Mimarı | Nexa Global<br>
      <a href="https://nxa.com.tr" style="color: #0284c7; text-decoration: none;">nxa.com.tr</a> &bull; <a href="mailto:umut@nxa.com.tr" style="color: #0284c7; text-decoration: none;">umut@nxa.com.tr</a>
    </p>

    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 28px 0 12px 0;" />
    <p style="font-size: 11px; color: #94a3b8; margin: 0;">
      Bu bilgilendirme e-postası nxa.com.tr CRM otomasyon motoru tarafından iletilmiştir. © ${currentYear} Nexa Yazılım & B2B SaaS Ekosistemleri.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `Sayın ${name},\n\n${company} adına iletmiş olduğunuz ${product} talebiniz ve sistem ön değerlendirme kaydınız başarıyla alınmıştır.\n\nTalebiniz alınmıştır, ${product} için size en kısa sürede ulaşacağız.\n\nUmut Erdoğan\nKurucu & Sistem Mimarı | Nexa Global\nhttps://nxa.com.tr`;

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Umut Erdoğan <umut@nxa.com.tr>";

  if (!apiKey || apiKey === "re_dummy_build_key" || apiKey.startsWith("dummy")) {
    console.log(`[EmailService] Resend API Key test modunda. Talep onay e-postası simüle edildi:
    Alıcı: ${payload.to} (${name} / ${company})
    Ürün: ${product}`);

    return {
      success: true,
      messageId: `sim_lead_ack_${Date.now()}`,
      simulated: true,
      subject,
      message: "Talebiniz alınmıştır konulu kurumsal e-posta başarıyla iletildi (Simülasyon).",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const res = await resend.emails.send({
      from: fromEmail,
      to: [payload.to],
      bcc: ["umut@nxa.com.tr"],
      replyTo: "umut@nxa.com.tr",
      subject,
      html,
      text,
    });

    if (res.error) {
      console.warn("[EmailService] Lead follow-up email hatası:", res.error);
      return {
        success: false,
        messageId: "",
        subject,
        message: res.error.message || "E-posta gönderilemedi.",
      };
    }

    return {
      success: true,
      messageId: res.data?.id || `msg_${Date.now()}`,
      subject,
      message: "Talebiniz alınmıştır konulu kurumsal e-posta başarıyla iletildi.",
    };
  } catch (err: any) {
    console.error("[EmailService] Lead follow-up hatası:", err);
    return {
      success: false,
      messageId: "",
      subject,
      message: err?.message || "E-posta servisine erişilemedi.",
    };
  }
}

