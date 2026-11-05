import emailjs from "@emailjs/nodejs";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_build_key");

// Nodemailer Transporter Utility
export const nodemailerTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || "info@nxa.com.tr",
    pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || "dummy_password",
  },
});

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://nxa.com.tr";
}

function getEmailJsConfig() {
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const serviceId = process.env.EMAILJS_SERVICE_ID;

  if (!publicKey || !privateKey || !serviceId) {
    throw new Error("EmailJS yapılandırması eksik.");
  }

  return { publicKey, privateKey, serviceId };
}

async function sendEmail(
  templateId: string,
  templateParams: Record<string, string>,
) {
  const { publicKey, privateKey, serviceId } = getEmailJsConfig();

  await emailjs.send(serviceId, templateId, templateParams, {
    publicKey,
    privateKey,
  });
}

export async function sendVerificationEmail(
  toEmail: string,
  toName: string,
  token: string,
) {
  const templateId = process.env.EMAILJS_VERIFICATION_TEMPLATE_ID;
  if (!templateId) {
    throw new Error("EMAILJS_VERIFICATION_TEMPLATE_ID tanımlı değil.");
  }

  const verifyLink = `${getAppUrl()}/api/auth/verify?token=${token}`;

  await sendEmail(templateId, {
    user_email: toEmail, // DÜZELTİLDİ: to_email -> user_email
    user_name: toName, // DÜZELTİLDİ: to_name -> user_name
    verification_link: verifyLink, // DÜZELTİLDİ: verify_link -> verification_link
    message:
      "Nexa hesabınızı aktifleştirmek için aşağıdaki bağlantıya tıklayın.",
  });
}

export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  token: string,
) {
  const templateId = process.env.EMAILJS_RESET_TEMPLATE_ID;
  if (!templateId) {
    throw new Error("EMAILJS_RESET_TEMPLATE_ID tanımlı değil.");
  }

  const resetLink = `${getAppUrl()}/auth/reset-password?token=${token}`;

  await sendEmail(templateId, {
    user_email: toEmail, // DÜZELTİLDİ: to_email -> user_email
    user_name: toName, // DÜZELTİLDİ: to_name -> user_name
    reset_link: resetLink, // (Bu zaten doğruydu)
    message:
      "Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın. Bu bağlantı 1 saat geçerlidir.",
  });
}

export async function sendInvoiceEmail(params: {
  toEmail: string;
  toName: string;
  productName: string;
  amount: string;
  orderId: string;
  pdfBase64: string;
}) {
  const templateId = process.env.EMAILJS_INVOICE_TEMPLATE_ID;
  if (!templateId) {
    throw new Error("EMAILJS_INVOICE_TEMPLATE_ID tanımlı değil.");
  }

  const attachmentParam =
    process.env.EMAILJS_INVOICE_ATTACHMENT_PARAM || "invoice_pdf";

  await sendEmail(templateId, {
    user_email: params.toEmail, // DÜZELTİLDİ: to_email -> user_email
    user_name: params.toName, // DÜZELTİLDİ: to_name -> user_name
    product_name: params.productName,
    amount: params.amount,
    order_id: params.orderId,
    message: "Ödemeniz başarıyla alındı. Dekontunuz ektedir.",
    [attachmentParam]: params.pdfBase64,
  });
}
export async function sendInvoiceWithResend(
  toEmail: string,
  toName: string,
  productName: string,
  amount: string,
  orderId: string,
  pdfBuffer: Buffer
) {
  try {
    await resend.emails.send({
      from: "Nexa <info@nxa.com.tr>", // Resend panelinde onayladığın domain
      to: toEmail,
      subject: `Nexa Platform - ${productName} Ödeme Dekontu`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981;">Ödemeniz Başarıyla Alındı! ✅</h2>
          <p>Sayın <strong>${toName}</strong>,</p>
          <p><strong>${productName}</strong> hizmeti için gerçekleştirdiğiniz <strong>${amount} TL</strong> tutarındaki ödemeniz sistemimize başarıyla yansımış ve hizmetiniz aktif edilmiştir.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <p style="margin: 0;"><strong>Sipariş No:</strong> ${orderId}</p>
          </div>
          <p>İşleminize ait detaylı dekont bu e-postanın ekinde (PDF) yer almaktadır.</p>
          <br/>
          <p style="font-size: 12px; color: #64748b;">© 2026 Nexa Platform. Tüm hakları saklıdır.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Nexa_Dekont_${orderId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    console.log("Fatura e-postası Resend ile başarıyla gönderildi!");
  } catch (error) {
    console.error("Resend fatura gönderim hatası:", error);
  }
}

export async function sendLeadMagnetWithNodemailer(toEmail: string) {
  const reportUrl = `${getAppUrl()}/docs/nexa-b2b-dijitallesme-raporu-2026.pdf`;
  const mailOptions = {
    from: '"Nexa B2B Enterprise" <info@nxa.com.tr>',
    to: toEmail,
    subject: "Nexa: B2B Dijitalleşme & Operasyonel Verimlilik Raporunuz Hazır 📊",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background-color: #09090b; color: #f8fafc; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 800; color: #ffffff;">Nexa<span style="color: #10b981;">.</span></span>
          <span style="font-size: 11px; background: rgba(16,185,129,0.15); color: #10b981; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(16,185,129,0.3);">B2B Enterprise</span>
        </div>

        <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin-bottom: 16px;">B2B Dijitalleşme & Operasyon Raporunuz Hazır! 🚀</h1>
        
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
          Şirketinizde manuel operasyon maliyetlerini nasıl <strong>%40 düşürebileceğinizi</strong>, şantiye ve randevu süreçlerini otonomlaştırma modellerini içeren kapsamlı teknik raporumuza aşağıdaki bağlantıdan anında ulaşabilirsiniz.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${reportUrl}" style="background: linear-gradient(135deg, #10b981, #059669); color: #09090b; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 0 20px rgba(16,185,129,0.35);">
            PDF Raporu İndirin (B2B Digitalization Report) →
          </a>
        </div>

        <div style="background-color: #121217; padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #e4e4e7;">
            <strong>Önemli:</strong> Kurucu & Baş Yazılım Mühendisi Umut Erdoğan ile doğrudan 30 dakikalık teknik fizibilite toplantısı ayırtmak isterseniz <a href="${getAppUrl()}/#strateji" style="color: #10b981;">buraya tıklayabilirsiniz</a>.
          </p>
        </div>

        <p style="font-size: 11px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-top: 24px;">
          © 2026 Nexa Platform (nxa.com.tr). Tüm hakları saklıdır.
        </p>
      </div>
    `,
  };

  return await nodemailerTransporter.sendMail(mailOptions);
}

export async function sendLeadMagnetEmail(toEmail: string) {
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")) {
      const reportUrl = `${getAppUrl()}/docs/nexa-b2b-dijitallesme-raporu-2026.pdf`;
      await resend.emails.send({
        from: "Nexa B2B <info@nxa.com.tr>",
        to: toEmail,
        subject: "Nexa: B2B Dijitalleşme & Operasyonel Verimlilik Raporunuz Hazır 📊",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background-color: #09090b; color: #f8fafc; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
              <span style="font-size: 20px; font-weight: 800; color: #ffffff;">Nexa<span style="color: #10b981;">.</span></span>
              <span style="font-size: 11px; background: rgba(16,185,129,0.15); color: #10b981; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(16,185,129,0.3);">B2B Enterprise</span>
            </div>

            <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin-bottom: 16px;">B2B Dijitalleşme & Operasyon Raporunuz Hazır! 🚀</h1>
            
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Şirketinizde manuel operasyon maliyetlerini nasıl <strong>%40 düşürebileceğinizi</strong>, şantiye ve randevu süreçlerini otonomlaştırma modellerini içeren kapsamlı teknik raporumuza aşağıdaki bağlantıdan anında ulaşabilirsiniz.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${reportUrl}" style="background: linear-gradient(135deg, #10b981, #059669); color: #09090b; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 0 20px rgba(16,185,129,0.35);">
                PDF Raporu İndirin (B2B Digitalization Report) →
              </a>
            </div>

            <div style="background-color: #121217; padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
              <p style="margin: 0; font-size: 13px; color: #e4e4e7;">
                <strong>Önemli:</strong> Kurucu & Baş Yazılım Mühendisi Umut Erdoğan ile doğrudan 30 dakikalık teknik fizibilite toplantısı ayırtmak isterseniz <a href="${getAppUrl()}/#strateji" style="color: #10b981;">buraya tıklayabilirsiniz</a>.
              </p>
            </div>

            <p style="font-size: 11px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-top: 24px;">
              © 2026 Nexa Platform (nxa.com.tr). Tüm hakları saklıdır.
            </p>
          </div>
        `,
      });
      console.log("Lead magnet e-postası Resend ile gönderildi:", toEmail);
    } else {
      // Use Nodemailer transporter
      await sendLeadMagnetWithNodemailer(toEmail);
      console.log("Lead magnet e-postası Nodemailer ile gönderildi:", toEmail);
    }
  } catch (error) {
    console.warn("Lead magnet e-posta gönderim uyarısı (fallback dev modu):", error);
  }
}