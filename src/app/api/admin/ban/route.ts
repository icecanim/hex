import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// GET: Ban listesi
export async function GET() {
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

    const banlar = await prisma.ban.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ basarili: true, banlar });
  } catch (hata) {
    console.error("Ban listesi hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Ban at
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ hata: "Giriş yapın" }, { status: 401 });
    }

    const adminDiscordId = (session.user as any).discordId;
    const admin = await adminMi(adminDiscordId);
    if (!admin) {
      return NextResponse.json({ hata: "Yetkiniz yok" }, { status: 403 });
    }

    const { discordId, steamId, sebep, sure, kalici } = await req.json();

    if (!discordId && !steamId) {
      return NextResponse.json(
        { hata: "Discord ID veya Steam ID zorunlu" },
        { status: 400 }
      );
    }

    if (!sebep) {
      return NextResponse.json({ hata: "Sebep zorunlu" }, { status: 400 });
    }

    // Ban bitiş tarihi hesapla
    let banBitis: Date | null = null;
    if (!kalici && sure) {
      const suresi = parseInt(sure);
      banBitis = new Date(Date.now() + suresi * 60 * 60 * 1000); // saat cinsinden
    }

    const ban = await prisma.ban.create({
      data: {
        discordId: discordId || null,
        steamId: steamId || null,
        sebep,
        banlayan: adminDiscordId,
        banBitis,
        kalici: kalici || false,
      },
    });

    console.log(
      `🚫 Ban atıldı: ${discordId || steamId} | Sebep: ${sebep} | ${
        kalici ? "Kalıcı" : sure + " saat"
      }`
    );

    // Discord DM gönder
    if (discordId) {
      try {
        await fetch("http://localhost:3001/ban-dm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discordId,
            sebep,
            banBitis,
            kalici,
          }),
        });
      } catch (botHata) {
        console.log("DM gönderilemedi:", botHata);
      }
    }

    return NextResponse.json({ basarili: true, ban });
  } catch (hata) {
    console.error("Ban atma hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}