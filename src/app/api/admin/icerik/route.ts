import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { hata: "Giriş yapmamışsınız" },
        { status: 401 }
      );
    }

    const discordId = (session.user as any).discordId;
    const admin = await adminMi(discordId);

    if (!admin) {
      return NextResponse.json({ hata: "Yetkiniz yok" }, { status: 403 });
    }

    const { key, deger } = await req.json();

    if (!key || deger === undefined) {
      return NextResponse.json({ hata: "Geçersiz veri" }, { status: 400 });
    }

    // Upsert: varsa güncelle, yoksa oluştur
    const icerik = await prisma.icerik.upsert({
      where: { key },
      update: {
        deger,
        updatedBy: discordId,
      },
      create: {
        key,
        deger,
        updatedBy: discordId,
      },
    });

    console.log(`✅ İçerik güncellendi: ${key}`);

    return NextResponse.json({ basarili: true, icerik });
  } catch (hata) {
    console.error("İçerik güncellenemedi:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}