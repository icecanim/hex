import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { adminMi } from "@/lib/admin";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

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

    const toplam = await prisma.basvuru.count();
    const beklemede = await prisma.basvuru.count({
      where: { durum: "beklemede" },
    });
    const onaylandi = await prisma.basvuru.count({
      where: { durum: "onaylandi" },
    });
    const reddedildi = await prisma.basvuru.count({
      where: { durum: "reddedildi" },
    });

    const whitelist = await prisma.basvuru.count({
      where: { tur: { contains: "Whitelist" } },
    });
    const seherbaz = await prisma.basvuru.count({
      where: { tur: { contains: "Seherbaz" } },
    });
    const bakanlik = await prisma.basvuru.count({
      where: { tur: { contains: "Bakanlık" } },
    });
    const profesor = await prisma.basvuru.count({
      where: { tur: { contains: "Profesör" } },
    });
    const olumYiyen = await prisma.basvuru.count({
      where: { tur: { contains: "Ölüm Yiyen" } },
    });

    const kullaniciSayisi = await prisma.user.count();
    const adminSayisi = await prisma.admin.count();

    return NextResponse.json({
      basarili: true,
      istatistikler: {
        toplam,
        beklemede,
        onaylandi,
        reddedildi,
        turler: { whitelist, seherbaz, bakanlik, profesor, olumYiyen },
        kullaniciSayisi,
        adminSayisi,
      },
    });
  } catch (hata) {
    console.error("İstatistikler alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}