import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token ve yeni şifre zorunludur." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifre en az 8 karakter olmalıdır." },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş sıfırlama bağlantısı." },
        { status: 400 },
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      message: "Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.",
    });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return NextResponse.json(
      { error: "Şifre güncellenirken bir hata oluştu." },
      { status: 500 },
    );
  }
}
