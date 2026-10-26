import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ayarlar = await prisma.basvuruAyar.findMany();

    const durumlar: Record<string, boolean> = {};
    ayarlar.forEach((a) => {
      durumlar[a.tur] = a.acik;
    });

    return NextResponse.json({
      basarili: true,
      durumlar,
    });
  } catch (hata) {
    console.error("Başvuru durum hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}