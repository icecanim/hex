import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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

    const ayarlar = await prisma.basvuruAyar.findMany({
      orderBy: { tur: "asc" },
    });

    return NextResponse.json({ basarili: true, ayarlar });
  } catch (hata) {
    console.error("Ayarlar alınamadı:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const { tur, acik } = await req.json();

    if (!tur || typeof acik !== "boolean") {
      return NextResponse.json({ hata: "Geçersiz veri" }, { status: 400 });
    }

    const ayar = await prisma.basvuruAyar.update({
      where: { tur },
      data: { acik, updatedBy: discordId },
    });

    await prisma.basvuruLog.create({
      data: {
        discordId,
        tur,
        islem: acik ? "basvuru-acildi" : "basvuru-kapandi",
      },
    });

    console.log(`🔓 ${tur} başvurusu ${acik ? "AÇILDI" : "KAPATILDI"}`);

    if (acik) {
      const turIsimleri: Record<string, string> = {
        whitelist: "Whitelist",
        seherbaz: "Seherbaz",
        bakanlik: "Bakanlık",
        profesor: "Profesör",
        "olum-yiyen": "Ölüm Yiyen",
      };

      const turIsim = turIsimleri[tur] || tur;

      try {
        await fetch("http://localhost:3001/duyuru-gonder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: `📢 ${turIsim} Başvuruları Açıldı!`,
            icerik: `**${turIsim}** başvuruları açılmıştır. Siteye giriş yaparak başvurabilirsiniz.\n\n🔗 http://localhost:3000/basvuru`,
          }),
        });
        console.log("✅ Otomatik duyuru gönderildi");
      } catch (botHata) {
        console.log("Duyuru gönderilemedi:", botHata);
      }

      try {
        await prisma.duyuru.create({
          data: {
            baslik: `📢 ${turIsim} Başvuruları Açıldı!`,
            icerik: `**${turIsim}** başvuruları açılmıştır. Siteye giriş yaparak başvurabilirsiniz.`,
            gonderen: discordId,
          },
        });
        console.log("✅ Site duyurusu kaydedildi");
      } catch (duyuruHata) {
        console.log("Site duyurusu kaydedilemedi:", duyuruHata);
      }
    }

    return NextResponse.json({ basarili: true, ayar });
  } catch (hata) {
    console.error("Ayar güncellenemedi:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}