import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { adminMi } from "@/lib/admin";



export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const tur = searchParams.get("tur");
    const durum = searchParams.get("durum");
    const arama = searchParams.get("arama");

    const where: any = {};

    if (tur && tur !== "tumu") {
      where.tur = tur;
    }

    if (durum && durum !== "tumu") {
      where.durum = durum;
    }

    if (arama) {
      where.OR = [
        { discordId: { contains: arama } },
        { discordAd: { contains: arama } },
      ];
    }

    const basvurular = await prisma.basvuru.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      basarili: true,
      basvurular: basvurular.map((b) => ({
        ...b,
        veriler: JSON.parse(b.veriler),
      })),
    });
  } catch (hata) {
    console.error("Başvurular alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}