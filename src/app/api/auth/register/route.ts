import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User"; // SÜSLÜ PARANTEZLER KALDIRILDI 

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Veritabanına bağlan
    await connectMongoDB();

    // 2. Kullanıcı zaten var mı?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kayıtlı." },
        { status: 400 },
      );
    }

    // 3. Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Kaydet
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer", // Varsayılan rol
    });

    return NextResponse.json(
      { message: "Kullanıcı başarıyla kaydedildi." },
      { status: 201 },
    );
  } catch (error: any) {
    // Hatayı hem terminale bas hem de client'a gönder ki görebilelim
    console.error("Kayıt Hatası Detayı:", error);
    return NextResponse.json(
      { error: error.message || "Kayıt sırasında bir hata oluştu." },
      { status: 500 },
    );
  }
}
