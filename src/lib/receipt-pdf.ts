import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { BillingCycle } from "@/types/product";

const NEXA_BLUE = rgb(0.114, 0.306, 0.847);
const SLATE = rgb(0.39, 0.45, 0.55);
const DARK = rgb(0.06, 0.09, 0.16);
const LIGHT_BG = rgb(0.96, 0.97, 0.98);

function formatBillingCycle(cycle: BillingCycle): string {
  if (cycle === "yearly") return "Yıllık";
  if (cycle === "one_time") return "Tek Seferlik";
  return "Aylık";
}

function formatCurrency(amount: number, currency = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export interface ReceiptData {
  customerName: string;
  customerEmail: string;
  productName: string;
  billingCycle: BillingCycle;
  amount: number;
  currency?: string;
  orderId: string;
  paymentDate: Date;
  startDate: Date;
  endDate: Date;
}

export async function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([420, 595]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 0,
    y: height - 90,
    width,
    height: 90,
    color: DARK,
  });

  page.drawText("NEXA", {
    x: 40,
    y: height - 52,
    size: 26,
    font: fontBold,
    color: NEXA_BLUE,
  });

  page.drawText("Ödeme Dekontu", {
    x: 40,
    y: height - 72,
    size: 11,
    font: fontRegular,
    color: rgb(0.75, 0.8, 0.9),
  });

  page.drawText(`Sipariş No: ${data.orderId}`, {
    x: width - 200,
    y: height - 52,
    size: 9,
    font: fontRegular,
    color: rgb(0.75, 0.8, 0.9),
  });

  page.drawText(formatDate(data.paymentDate), {
    x: width - 200,
    y: height - 68,
    size: 9,
    font: fontRegular,
    color: rgb(0.75, 0.8, 0.9),
  });

  let y = height - 130;

  page.drawText("Müşteri Bilgileri", {
    x: 40,
    y,
    size: 10,
    font: fontBold,
    color: DARK,
  });

  y -= 22;
  page.drawText(data.customerName, {
    x: 40,
    y,
    size: 11,
    font: fontRegular,
    color: DARK,
  });

  y -= 16;
  page.drawText(data.customerEmail, {
    x: 40,
    y,
    size: 10,
    font: fontRegular,
    color: SLATE,
  });

  y -= 40;
  page.drawRectangle({
    x: 40,
    y: y - 80,
    width: width - 80,
    height: 80,
    color: LIGHT_BG,
    borderColor: rgb(0.88, 0.9, 0.94),
    borderWidth: 1,
  });

  page.drawText("Hizmet / Ürün", {
    x: 52,
    y: y - 22,
    size: 9,
    font: fontBold,
    color: SLATE,
  });

  page.drawText("Dönem", {
    x: 220,
    y: y - 22,
    size: 9,
    font: fontBold,
    color: SLATE,
  });

  page.drawText("Tutar", {
    x: width - 110,
    y: y - 22,
    size: 9,
    font: fontBold,
    color: SLATE,
  });

  page.drawText(data.productName, {
    x: 52,
    y: y - 48,
    size: 11,
    font: fontRegular,
    color: DARK,
  });

  page.drawText(formatBillingCycle(data.billingCycle), {
    x: 220,
    y: y - 48,
    size: 10,
    font: fontRegular,
    color: DARK,
  });

  const amountText = formatCurrency(data.amount, data.currency ?? "TRY");
  page.drawText(amountText, {
    x: width - 110,
    y: y - 48,
    size: 11,
    font: fontBold,
    color: DARK,
  });

  y -= 110;
  page.drawLine({
    start: { x: 40, y },
    end: { x: width - 40, y },
    thickness: 1,
    color: rgb(0.88, 0.9, 0.94),
  });

  y -= 28;
  page.drawText("Toplam", {
    x: width - 160,
    y,
    size: 11,
    font: fontBold,
    color: DARK,
  });

  page.drawText(amountText, {
    x: width - 110,
    y,
    size: 14,
    font: fontBold,
    color: NEXA_BLUE,
  });

  y -= 50;
  page.drawText("Abonelik Dönemi", {
    x: 40,
    y,
    size: 10,
    font: fontBold,
    color: DARK,
  });

  y -= 18;
  page.drawText(
    `${formatDate(data.startDate)} — ${formatDate(data.endDate)}`,
    {
      x: 40,
      y,
      size: 10,
      font: fontRegular,
      color: SLATE,
    },
  );

  page.drawText("Bu belge elektronik ortamda oluşturulmuştur.", {
    x: 40,
    y: 40,
    size: 8,
    font: fontRegular,
    color: SLATE,
  });

  page.drawText("nexa-platform.com", {
    x: 40,
    y: 28,
    size: 8,
    font: fontRegular,
    color: NEXA_BLUE,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
