import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const duyurular = await prisma.duyuru.findMany({
      orderBy: { createdAt: "desc" },
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