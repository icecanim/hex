import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const kategoriler = await prisma.kuralKategori.findMany({
      orderBy: { sira: "asc" },
      include: {
        maddeler: {
          orderBy: { sira: "asc" },
        },
      },
    });

    return NextResponse.json({
      basarili: true,
      kategoriler,
    });
  } catch (hata) {
    console.error("Kurallar alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}