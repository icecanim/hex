import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { adminMi, adminBilgisi } from "@/lib/admin";

export async function GET() {
  console.log("=== ADMİN KONTROL BAŞLADI ===");

  try {
    const session = await auth();

    console.log("Session var mı?:", !!session);
    console.log("Session user:", JSON.stringify(session?.user, null, 2));

    if (!session?.user) {
      console.log("❌ Session yok");
      return NextResponse.json(
        { adminMi: false, hata: "Giriş yapmamışsınız" },
        { status: 401 }
      );
    }

    const discordId = (session.user as any).discordId;
    console.log("📌 Discord ID:", discordId);

    if (!discordId) {
      console.log("❌ Discord ID yok");
      return NextResponse.json(
        { adminMi: false, hata: "Discord ID bulunamadı" },
        { status: 400 }
      );
    }

    console.log("✅ Discord ID var, adminMi çağrılıyor...");
    const admin = await adminMi(discordId);
    const bilgi = await adminBilgisi(discordId);

    console.log("📌 Admin mi?:", admin);
    console.log("📌 Bilgi:", bilgi);
    console.log("=== ADMİN KONTROL BİTTİ ===");

    return NextResponse.json({
      adminMi: admin,
      bilgi: bilgi,
    });
  } catch (hata) {
    console.error("❌ Admin kontrol hatası:", hata);
    return NextResponse.json(
      { adminMi: false, hata: "Sunucu hatası" },
      { status: 500 }
    );
  }
}