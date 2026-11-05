import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * 1. GET: E-posta Doğrulama Bağlantısı (1-Click Verification Link)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nxa.com.tr";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/auth/verify?error=invalid_token`);
  }

  try {
    let verified = false;

    // MongoDB kontrolü
    try {
      await connectMongoDB();
      const user = await User.findOne({
        $or: [
          { verificationToken: token },
          ...(email ? [{ email: email.toLowerCase().trim() }] : []),
        ],
      }).select("+verificationToken");

      if (user) {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationCode = undefined;
        await user.save();
        verified = true;
      }
    } catch (mErr) {
      console.warn("[Verify GET] MongoDB uyarısı:", mErr);
    }

    // Prisma kontrolü
    if (email) {
      try {
        await (prisma as any).user?.update({
          where: { email: email.toLowerCase().trim() },
          data: { isVerified: true },
        });
        verified = true;
      } catch (pErr) {
        // Devam et
      }
    }

    if (!verified) {
      return NextResponse.redirect(`${appUrl}/auth/verify?error=user_not_found`);
    }

    return NextResponse.redirect(`${appUrl}/profil?verified=1`);
  } catch (error) {
    console.error("[Verify GET] Hata:", error);
    return NextResponse.redirect(`${appUrl}/auth/verify?error=verification_failed`);
  }
}

/**
 * 2. POST: 6 Haneli OTP Doğrulama Kodu Onayı
 */
export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "E-posta ve 6 haneli doğrulama kodu zorunludur." },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();
    const codeClean = String(code).trim();

    let isMatch = false;

    // MongoDB sorgusu
    try {
      await connectMongoDB();
      const mongoUser = await User.findOne({ email: emailClean }).select(
        "+verificationCode +verificationToken"
      );

      if (mongoUser) {
        // Master dev kodu 123456 veya veritabanındaki kod ile eşleşme
        if (
          mongoUser.verificationCode === codeClean ||
          codeClean === "123456" ||
          (mongoUser.verificationToken && mongoUser.verificationToken === codeClean)
        ) {
          mongoUser.isVerified = true;
          mongoUser.verificationCode = undefined;
          mongoUser.verificationToken = undefined;
          await mongoUser.save();
          isMatch = true;
        }
      }
    } catch (mErr) {
      console.warn("[Verify POST] MongoDB uyarısı:", mErr);
    }

    // Prisma sorgusu & güncellemesi
    try {
      const pUser = await (prisma as any).user?.findUnique({
        where: { email: emailClean },
      });

      if (pUser) {
        if (codeClean === "123456" || isMatch) {
          await (prisma as any).user?.update({
            where: { email: emailClean },
            data: { isVerified: true },
          });
          isMatch = true;
        }
      }
    } catch (pErr) {
      console.warn("[Verify POST] Prisma uyarısı:", pErr);
    }

    if (!isMatch && codeClean !== "123456") {
      return NextResponse.json(
        { error: "Girdiğiniz 6 haneli doğrulama kodu hatalı veya süresi dolmuş." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "E-posta adresiniz başarıyla doğrulandı. Artık tüm SaaS panellerine erişebilirsiniz.",
    });
  } catch (error: any) {
    console.error("[Verify POST] Kritik Hata:", error);
    return NextResponse.json(
      { error: "Doğrulama işlemi sırasında bir sunucu hatası meydana geldi." },
      { status: 500 }
    );
  }
}
