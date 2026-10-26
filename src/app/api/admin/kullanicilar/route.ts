import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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

    const kullanicilar = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        discordId: true,
        createdAt: true,
      },
    });

    const adminler = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log("📊 Kullanıcılar:", kullanicilar.length);
    console.log("📊 Adminler:", adminler.length);
    console.log("📊 Admin listesi:", adminler);

    return NextResponse.json({
      basarili: true,
      kullanicilar,
      adminler,
    });
  } catch (hata) {
    console.error("Kullanıcılar alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}