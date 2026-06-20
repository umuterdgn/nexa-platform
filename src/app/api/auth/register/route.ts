import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateSecureToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur." },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kayıtlı." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateSecureToken();

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      isVerified: false,
      verificationToken,
    });

    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (emailError) {
      console.error("Doğrulama e-postası gönderilemedi:", emailError);
      await User.deleteOne({ email });
      return NextResponse.json(
        { error: "Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message:
          "Kayıt başarılı. Lütfen e-posta adresinize gönderilen doğrulama bağlantısına tıklayın.",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Kayıt Hatası Detayı:", error);
    const message =
      error instanceof Error ? error.message : "Kayıt sırasında bir hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
