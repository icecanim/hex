import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// DELETE: Ban kaldır
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const ban = await prisma.ban.update({
      where: { id },
      data: {
        kaldirildi: true,
        kaldiranId: adminDiscordId,
        kaldirmaTarihi: new Date(),
      },
    });

    console.log(`✅ Ban kaldırıldı: ${id}`);

    return NextResponse.json({ basarili: true, ban });
  } catch (hata) {
    console.error("Ban kaldırma hatası:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}