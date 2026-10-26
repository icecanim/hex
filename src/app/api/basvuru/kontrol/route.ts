import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { hata: "Giriş yapmamışsınız", girisGerekli: true },
        { status: 401 }
      );
    }

    const discordId = (session.user as any).discordId;
    if (!discordId) {
      return NextResponse.json(
        { hata: "Discord ID bulunamadı" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const tur = searchParams.get("tur");

    if (!tur) {
      return NextResponse.json({ hata: "Tür zorunlu" }, { status: 400 });
    }

    // Ban kontrolü
    const deneme = await prisma.basvuruDeneme.findUnique({
      where: {
        discordId_tur: { discordId, tur },
      },
    });

    // Banlı mı?
    if (deneme?.banli && deneme.banBitis) {
      const simdi = new Date();
      if (simdi < deneme.banBitis) {
        return NextResponse.json({
          banli: true,
          banBitis: deneme.banBitis,
          banSebep: deneme.banSebep,
          kalanSure: deneme.banBitis.getTime() - simdi.getTime(),
        });
      } else {
        // Ban süresi dolmuş, temizle
        await prisma.basvuruDeneme.update({
          where: { id: deneme.id },
          data: { banli: false, banBitis: null, banSebep: null },
        });
      }
    }

    // Bu türe başvuru var mı?
    const mevcutBasvuru = await prisma.basvuru.findFirst({
      where: { discordId, tur },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      basarili: true,
      basvuruVar: !!mevcutBasvuru,
      basvuru: mevcutBasvuru
        ? {
            id: mevcutBasvuru.id,
            tur: mevcutBasvuru.tur,
            durum: mevcutBasvuru.durum,
            mulakat: mevcutBasvuru.mulakat,
            createdAt: mevcutBasvuru.createdAt,
            veriler: JSON.parse(mevcutBasvuru.veriler),
          }
        : null,
      denemeSayisi: deneme?.denemeSayisi || 0,
    });
  } catch (hata) {
    console.error("Kontrol hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}