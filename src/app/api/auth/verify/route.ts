import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=invalid_token`);
  }

  try {
    await connectMongoDB();

    const user = await User.findOne({ verificationToken: token }).select(
      "+verificationToken",
    );

    if (!user) {
      return NextResponse.redirect(`${appUrl}/auth/login?error=invalid_token`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.redirect(`${appUrl}/auth/login?verified=1`);
  } catch (error) {
    console.error("E-posta doğrulama hatası:", error);
    return NextResponse.redirect(`${appUrl}/auth/login?error=verification_failed`);
  }
}
