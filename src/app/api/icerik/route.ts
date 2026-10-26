import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const icerikler = await prisma.icerik.findMany();

    const icerikObj: Record<string, string> = {};
    icerikler.forEach((i) => {
      icerikObj[i.key] = i.deger;
    });

    return NextResponse.json({
      basarili: true,
      icerikler: icerikObj,
    });
  } catch (hata) {
    console.error("İçerik alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}