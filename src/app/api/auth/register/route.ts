import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { prisma } from "@/lib/prisma";
import { sendB2bEmail } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password, companyName, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Lütfen ad soyad, e-posta ve şifre alanlarını doldurun." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Kullanıcı Zaten Kayıtlı Mı?
    let userExists = false;
    try {
      await connectMongoDB();
      const existingMongo = await User.findOne({ email: emailLower });
      if (existingMongo) userExists = true;
    } catch (e) {
      // Devam et
    }

    if (!userExists) {
      try {
        const existingPrisma = await (prisma as any).user?.findUnique({
          where: { email: emailLower },
        });
        if (existingPrisma) userExists = true;
      } catch (e) {
        // Devam et
      }
    }

    if (userExists) {
      return NextResponse.json(
        { error: "Bu e-posta adresiyle zaten kayıtlı bir hesap bulunuyor." },
        { status: 400 }
      );
    }

    // 2. Şifreleme ve Doğrulama Kodları Üretimi
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 Haneli OTP Kodu
    const verificationToken = crypto.randomBytes(24).toString("hex"); // Kriptografik Aktivasyon Linki

    // 3. Mongoose Veritabanına Kaydet (isVerified: false olarak başlar)
    try {
      await connectMongoDB();
      await User.create({
        name,
        email: emailLower,
        password: hashedPassword,
        role: "customer",
        isVerified: false,
        verificationCode,
        verificationToken,
      });
    } catch (mErr) {
      console.warn("[Register API] MongoDB kayıt uyarısı:", mErr);
    }

    // 4. Prisma Veritabanına Kaydet (isVerified: false)
    try {
      await (prisma as any).user?.upsert({
        where: { email: emailLower },
        update: {
          name,
          password: hashedPassword,
          companyName: companyName || undefined,
          phone: phone || undefined,
          isVerified: false,
        },
        create: {
          name,
          email: emailLower,
          password: hashedPassword,
          companyName: companyName || undefined,
          phone: phone || undefined,
          role: "customer",
          isVerified: false,
        },
      });
      console.log(`[Register API] Prisma User (isVerified=false) kaydedildi: ${emailLower}`);
    } catch (pErr) {
      console.warn("[Register API] Prisma kayıt uyarısı:", pErr);
    }

    // 5. Resend API ile 6 Haneli Doğrulama Kodu ve Aktivasyon Linki Gönder
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nxa.com.tr";
    const verifyUrl = `${appUrl}/api/auth/verify?token=${verificationToken}&email=${encodeURIComponent(emailLower)}`;

    try {
      await sendB2bEmail({
        to: emailLower,
        name,
        companyName: companyName || "Nexa Kurumsal",
        type: "email_verification",
        data: {
          verificationCode,
          verificationToken,
          verifyUrl,
        },
      });
    } catch (mailErr) {
      console.warn("[Register API] Doğrulama e-postası gönderim uyarısı (Simüle ediliyor):", mailErr);
    }

    return NextResponse.json(
      {
        success: true,
        email: emailLower,
        message:
          "Kayıt başarılı. Lütfen e-posta adresinize gönderilen 6 haneli doğrulama kodunu onaylayın.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Register API] Kritik Hata:", error);
    return NextResponse.json(
      { error: error?.message || "Kayıt işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
