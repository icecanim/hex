import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
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

    const { baslik, icerik } = await req.json();

    if (!baslik || !icerik) {
      return NextResponse.json(
        { hata: "Başlık ve içerik zorunludur" },
        { status: 400 }
      );
    }

    console.log(`📢 Duyuru gönderiliyor: ${baslik}`);

    // Bot'a gönder (kanala mesaj atsın)
    try {
      const yanit = await fetch("http://localhost:3001/duyuru-gonder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baslik, icerik }),
      });

      if (!yanit.ok) {
        throw new Error("Bot'a gönderilemedi");
      }
    } catch (botHata) {
      console.error("Bot hatası:", botHata);
      return NextResponse.json(
        { hata: "Bot'a bağlanılamadı. Bot açık mı?" },
        { status: 500 }
      );
    }

    // Duyuruyu veritabanına kaydet
    await prisma.duyuru.create({
      data: {
        baslik,
        icerik,
        gonderen: discordId,
      },
    });

    return NextResponse.json({
      basarili: true,
    });
  } catch (hata) {
    console.error("Duyuru hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}

export async function GET() {
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

    const duyurular = await prisma.duyuru.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      basarili: true,
      duyurular,
    });
  } catch (hata) {
    console.error("Duyurular alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}