import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { adminMi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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

    await prisma.duyuru.delete({
      where: { id },
    });

    return NextResponse.json({ basarili: true });
  } catch (hata) {
    console.error("Duyuru silinemedi:", hata);
    return NextResponse.json({ hata: "Sunucu hatası" }, { status: 500 });
  }
}