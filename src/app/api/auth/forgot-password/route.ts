import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateSecureToken, getTokenExpiry } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-posta adresi zorunludur." },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetPasswordToken +resetPasswordExpires",
    );

    if (user) {
      const resetToken = generateSecureToken();
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = getTokenExpiry(1);
      await user.save();

      try {
        await sendPasswordResetEmail(user.email, user.name, resetToken);
      } catch (emailError) {
        console.error("Şifre sıfırlama e-postası gönderilemedi:", emailError);
      }
    }

    return NextResponse.json({
      message:
        "E-posta adresiniz kayıtlıysa şifre sıfırlama bağlantısı gönderildi.",
    });
  } catch (error) {
    console.error("Şifremi unuttum hatası:", error);
    return NextResponse.json(
      { error: "İşlem sırasında bir hata oluştu." },
      { status: 500 },
    );
  }
}
