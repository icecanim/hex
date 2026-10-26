import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminMi } from "@/lib/admin";




export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { durum, mulakat, notlar } = body;

    const guncelleme: any = {};
    if (durum !== undefined) {
      guncelleme.durum = durum;
      guncelleme.onaylayan = discordId;
    }
    if (mulakat !== undefined) guncelleme.mulakat = mulakat;
    if (notlar !== undefined) guncelleme.notlar = notlar;

    const basvuru = await prisma.basvuru.update({
      where: { id },
      data: guncelleme,
    });

    if (durum === "onaylandi" || durum === "reddedildi") {
      try {
        await fetch("http://localhost:3001/dm-gonder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discordId: basvuru.discordId,
            durum,
            tur: basvuru.tur,
            mulakat: mulakat || basvuru.mulakat,
          }),
        });
      } catch (botHata) {
        console.log("DM gönderilemedi:", botHata);
      }
    }

    return NextResponse.json({
      basarili: true,
      basvuru: {
        ...basvuru,
        veriler: JSON.parse(basvuru.veriler),
      },
    });
  } catch (hata) {
    console.error("Başvuru güncellenemedi:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await prisma.basvuru.delete({
      where: { id },
    });

    return NextResponse.json({ basarili: true });
  } catch (hata) {
    console.error("Başvuru silinemedi:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}