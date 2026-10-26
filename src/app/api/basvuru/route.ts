import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CEZA_SEVIYELERI = [
  { deneme: 1, ceza: "uyari", mesaj: "Zaten başvurunuz var." },
  { deneme: 2, ceza: "uyari-dm", mesaj: "Başvurunuzu spam yapmayın. Son uyarı!" },
  { deneme: 3, ceza: "24-saat-ban", mesaj: "24 saat banlandınız." },
  { deneme: 4, ceza: "7-gun-ban", mesaj: "7 gün banlandınız." },
  { deneme: 5, ceza: "kalici-ban", mesaj: "Kalıcı olarak banlandınız." },
];

function cezaHesapla(denemeSayisi: number) {
  if (denemeSayisi >= 5) return CEZA_SEVIYELERI[4];
  return CEZA_SEVIYELERI[denemeSayisi - 1] || CEZA_SEVIYELERI[0];
}

function banSuresiHesapla(ceza: string): Date | null {
  const simdi = new Date();
  if (ceza === "24-saat-ban") {
    return new Date(simdi.getTime() + 24 * 60 * 60 * 1000);
  }
  if (ceza === "7-gun-ban") {
    return new Date(simdi.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  if (ceza === "kalici-ban") {
    return new Date(simdi.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
  }
  return null;
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { tur, veriler } = body;

    if (!tur || !veriler) {
      return NextResponse.json(
        { hata: "Tür ve veriler zorunlu" },
        { status: 400 }
      );
    }

    // Ban kontrolü
    const denemeKaydi = await prisma.basvuruDeneme.findUnique({
      where: { discordId_tur: { discordId, tur } },
    });

    if (denemeKaydi?.banli && denemeKaydi.banBitis) {
      const simdi = new Date();
      if (simdi < denemeKaydi.banBitis) {
        return NextResponse.json(
          {
            hata: "Banlısınız",
            banli: true,
            banBitis: denemeKaydi.banBitis,
            banSebep: denemeKaydi.banSebep,
          },
          { status: 403 }
        );
      }
    }

    // Bu türe daha önce başvurdu mu?
    const mevcutBasvuru = await prisma.basvuru.findFirst({
      where: { discordId, tur },
    });

    if (mevcutBasvuru) {
      // Deneme sayısını artır
      const yeniDenemeSayisi = (denemeKaydi?.denemeSayisi || 0) + 1;
      const ceza = cezaHesapla(yeniDenemeSayisi);
      const banBitis = banSuresiHesapla(ceza.ceza);

      // Deneme kaydını güncelle/oluştur
      if (denemeKaydi) {
        await prisma.basvuruDeneme.update({
          where: { id: denemeKaydi.id },
          data: {
            denemeSayisi: yeniDenemeSayisi,
            sonDeneme: new Date(),
            banli: !!banBitis,
            banBitis: banBitis,
            banSebep: ceza.ceza,
          },
        });
      } else {
        await prisma.basvuruDeneme.create({
          data: {
            discordId,
            tur,
            denemeSayisi: yeniDenemeSayisi,
            banli: !!banBitis,
            banBitis: banBitis,
            banSebep: ceza.ceza,
          },
        });
      }

      // Log kaydı
      await prisma.basvuruLog.create({
        data: {
          discordId,
          tur,
          islem: "tekrar-deneme",
          detay: `Deneme #${yeniDenemeSayisi}`,
          ceza: ceza.ceza,
        },
      });

      // 2. deneme → Discord DM gönder
      if (yeniDenemeSayisi === 2) {
        try {
          await fetch("http://localhost:3001/uyari-dm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              discordId,
              tur,
              mesaj:
                "⚠️ Başvurunuzu spam yapmayın. Bu son uyarınız! Tekrar denerseniz banlanırsınız.",
            }),
          });
        } catch (botHata) {
          console.log("DM gönderilemedi:", botHata);
        }
      }

      return NextResponse.json(
        {
          hata: ceza.mesaj,
          tekrarDeneme: true,
          denemeSayisi: yeniDenemeSayisi,
          ceza: ceza.ceza,
          banBitis,
          mevcutBasvuru: {
            id: mevcutBasvuru.id,
            tur: mevcutBasvuru.tur,
            durum: mevcutBasvuru.durum,
            mulakat: mevcutBasvuru.mulakat,
            createdAt: mevcutBasvuru.createdAt,
          },
        },
        { status: 409 }
      );
    }

    // İlk başvuru — kaydet
    const basvuru = await prisma.basvuru.create({
      data: {
        tur,
        discordId,
        veriler: JSON.stringify(veriler),
        durum: "beklemede",
      },
    });

    // Deneme kaydı oluştur
    await prisma.basvuruDeneme.create({
      data: {
        discordId,
        tur,
        denemeSayisi: 1,
      },
    });

    // Log
    await prisma.basvuruLog.create({
      data: {
        discordId,
        tur,
        islem: "basvuru-yapildi",
        detay: "İlk başvuru",
      },
    });

    // Bot'a gönder (Discord'a düşsün)
    try {
      await fetch("http://localhost:3001/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tur, veriler }),
      });
    } catch (botHata) {
      console.log("Bot'a gönderilemedi:", botHata);
    }

    return NextResponse.json({
      basarili: true,
      id: basvuru.id,
    });
  } catch (hata) {
    console.error("Başvuru hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}