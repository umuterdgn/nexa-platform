import emailjs from "@emailjs/nodejs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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