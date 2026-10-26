import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const uyeler = await prisma.ekipUye.findMany({
      orderBy: { sira: "asc" },
    });

    return NextResponse.json({
      basarili: true,
      uyeler,
    });
  } catch (hata) {
    console.error("Ekip alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}