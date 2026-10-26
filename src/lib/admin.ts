import { prisma } from "@/lib/prisma";

export async function adminMi(discordId: string): Promise<boolean> {
  if (!discordId) return false;

  console.log("🔍 adminMi çağrıldı:", discordId);
  console.log("🔍 Tipi:", typeof discordId);
  console.log("🔍 Uzunluk:", discordId.length);

  // ÖNCE tüm adminleri çek, sonra JS'de karşılaştır
  const tumAdminler = await prisma.admin.findMany();
  console.log("🔍 Toplam admin sayısı:", tumAdminler.length);
  console.log("🔍 Adminlerin discordId'leri:", tumAdminler.map(a => a.discordId));

  const aranan = String(discordId).trim();
  console.log("🔍 Aranan (trim'li):", aranan);
  console.log("🔍 Aranan uzunluk:", aranan.length);

  const admin = tumAdminler.find(
    (a) => String(a.discordId).trim() === aranan
  );

  console.log("🔍 admin bulundu mu?:", !!admin);
  console.log("🔍 admin bilgisi:", admin);

  return !!admin;
}

export async function adminBilgisi(discordId: string) {
  if (!discordId) return null;

  const tumAdminler = await prisma.admin.findMany();
  const aranan = String(discordId).trim();

  return (
    tumAdminler.find((a) => String(a.discordId).trim() === aranan) || null
  );
}