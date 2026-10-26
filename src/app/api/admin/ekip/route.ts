import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// GET: Tüm ekip üyelerini al
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

    const uyeler = await prisma.ekipUye.findMany({
      orderBy: { sira: "asc" },
    });

    return NextResponse.json({ basarili: true, uyeler });
  } catch (hata) {
    console.error("Ekip alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Ekip üyesi ekle/sil/güncelle
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ hata: "Giriş yapın" }, { status: 401 });
    }

    const discordId = (session.user as any).discordId;
    const admin = await adminMi(discordId);
    if (!admin) {
      return NextResponse.json({ hata: "Yetkiniz yok" }, { status: 403 });
    }

    const { aksiyon, id, veri } = await req.json();

    // Üye ekle
    if (aksiyon === "ekle") {
      const maxSira = await prisma.ekipUye.aggregate({
        _max: { sira: true },
      });
      const yeniSira = (maxSira._max.sira || 0) + 1;

      const uye = await prisma.ekipUye.create({
        data: {
          isim: veri.isim,
          rol: veri.rol,
          ikon: veri.ikon || "👤",
          renk: veri.renk || "from-amber-500 to-amber-700",
          sira: yeniSira,
        },
      });

      return NextResponse.json({ basarili: true, uye });
    }

    // Üye sil
    if (aksiyon === "sil") {
      await prisma.ekipUye.delete({ where: { id } });
      return NextResponse.json({ basarili: true });
    }

    // Üye güncelle
    if (aksiyon === "guncelle") {
      const uye = await prisma.ekipUye.update({
        where: { id },
        data: {
          isim: veri.isim,
          rol: veri.rol,
          ikon: veri.ikon,
          renk: veri.renk,
        },
      });

      return NextResponse.json({ basarili: true, uye });
    }

    return NextResponse.json({ hata: "Bilinmeyen aksiyon" }, { status: 400 });
  } catch (hata) {
    console.error("Ekip işlemi hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}