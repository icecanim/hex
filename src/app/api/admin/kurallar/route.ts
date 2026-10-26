import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// GET: Tüm kuralları al
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

    const kategoriler = await prisma.kuralKategori.findMany({
      orderBy: { sira: "asc" },
      include: {
        maddeler: {
          orderBy: { sira: "asc" },
        },
      },
    });

    return NextResponse.json({ basarili: true, kategoriler });
  } catch (hata) {
    console.error("Kurallar alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Kategori ekle
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

    // Kategori ekle
    if (aksiyon === "kategori-ekle") {
      const maxSira = await prisma.kuralKategori.aggregate({
        _max: { sira: true },
      });
      const yeniSira = (maxSira._max.sira || 0) + 1;

      const kategori = await prisma.kuralKategori.create({
        data: {
          baslik: veri.baslik,
          sira: yeniSira,
        },
      });

      return NextResponse.json({ basarili: true, kategori });
    }

    // Kategori sil
    if (aksiyon === "kategori-sil") {
      await prisma.kuralKategori.delete({
        where: { id },
      });

      return NextResponse.json({ basarili: true });
    }

    // Kategori güncelle
    if (aksiyon === "kategori-guncelle") {
      const kategori = await prisma.kuralKategori.update({
        where: { id },
        data: { baslik: veri.baslik },
      });

      return NextResponse.json({ basarili: true, kategori });
    }

    // Madde ekle
    if (aksiyon === "madde-ekle") {
      const maxSira = await prisma.kuralMadde.aggregate({
        where: { kategoriId: veri.kategoriId },
        _max: { sira: true },
      });
      const yeniSira = (maxSira._max.sira || 0) + 1;

      const madde = await prisma.kuralMadde.create({
        data: {
          kategoriId: veri.kategoriId,
          icerik: veri.icerik,
          sira: yeniSira,
        },
      });

      return NextResponse.json({ basarili: true, madde });
    }

    // Madde sil
    if (aksiyon === "madde-sil") {
      await prisma.kuralMadde.delete({
        where: { id },
      });

      return NextResponse.json({ basarili: true });
    }

    // Madde güncelle
    if (aksiyon === "madde-guncelle") {
      const madde = await prisma.kuralMadde.update({
        where: { id },
        data: { icerik: veri.icerik },
      });

      return NextResponse.json({ basarili: true, madde });
    }

    return NextResponse.json({ hata: "Bilinmeyen aksiyon" }, { status: 400 });
  } catch (hata) {
    console.error("Kural işlemi hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}