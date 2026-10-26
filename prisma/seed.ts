import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...");

  // ============ BAŞVURU AYARLARI ============
  const türler = [
    { tur: "whitelist", acik: false },
    { tur: "seherbaz", acik: false },
    { tur: "bakanlik", acik: false },
    { tur: "profesor", acik: false },
    { tur: "olum-yiyen", acik: false },
    { tur: "yetkili", acik: false },
  ];

  for (let ti = 0; ti < türler.length; ti++) {
    const t = türler[ti];
    const mevcut = await prisma.basvuruAyar.findUnique({
      where: { tur: t.tur },
    });

    if (!mevcut) {
      await prisma.basvuruAyar.create({ data: t });
      console.log(`✅ ${t.tur} oluşturuldu`);
    } else {
      console.log(`⏭️ ${t.tur} zaten var`);
    }
  }

  // ============ İÇERİKLER ============
  const icerikler = [
    {
      key: "evren-hikayesi",
      deger: `1971 yılı, büyücülük dünyasının uzun yıllardır görmediği kadar sakin bir dönem olarak tarihe geçmektedir.

Yıllar önce yaşanan Grindelwald Savaşı sona ermiş, Gellert Grindelwald 1945 yılında Albus Dumbledore tarafından mağlup edilmiş ve büyücülük dünyası yaralarını sarmaya başlamıştır.

Hogwarts'ın koridorlarında yeni bir öğrenci nesli eğitim görmektedir. Gryffindor binasında James Potter, Sirius Black, Remus Lupin ve Peter Pettigrew, 1971 yılında okula başlayan öğrenciler arasında yer almaktadır.

Ancak herkesin gözünden kaçan bir kişi vardır...`,
    },
    {
      key: "evren-hikayesi-baslik",
      deger: "1971 Yılı",
    },
    {
      key: "evren-hikayesi-altbaslik",
      deger:
        "Büyücülük dünyasının uzun yıllardır görmediği kadar sakin bir dönem",
    },
  ];

  for (let ii = 0; ii < icerikler.length; ii++) {
    const i = icerikler[ii];
    const mevcut = await prisma.icerik.findUnique({
      where: { key: i.key },
    });

    if (!mevcut) {
      await prisma.icerik.create({ data: i });
      console.log(`✅ ${i.key} oluşturuldu`);
    } else {
      console.log(`⏭️ ${i.key} zaten var`);
    }
  }

  // ============ KURALLAR ============
  const kuralKategorileri = [
    {
      baslik: "Genel Kurallar",
      sira: 1,
      maddeler: [
        "RDM (Random Deathmatch) kesinlikle yasaktır.",
        "VDM (Vehicle Deathmatch) yasaktır.",
        "FailRP (Roleplay dışı davranış) yasaktır.",
        "MetaGaming (OOC bilgiyi IC kullanma) yasaktır.",
        "PowerGaming (Gerçekçi olmayan eylemler) yasaktır.",
        "Yetkililere saygılı olunmalıdır.",
      ],
    },
    {
      baslik: "Karakter Kuralları",
      sira: 2,
      maddeler: [
        "Karakterinize uygun davranmalısınız.",
        "Karakter hikayeniz gerçekçi olmalıdır.",
        "Süper kahraman / anime karakteri yasaktır.",
        "Karakterinizin geçmişi tutarlı olmalıdır.",
      ],
    },
    {
      baslik: "Büyü ve İksir Kuralları",
      sira: 3,
      maddeler: [
        "Yasaklanmış büyüler yetkililer izin verirse kullanılabilir.",
        "İksir yapımı dersliklerde yapılmalıdır.",
        "Zaman döndürücü kullanımı yasaktır.",
        "Kara büyü kullanımı Bakanlık iznine tabidir.",
      ],
    },
    {
      baslik: "Bakanlık ve Okul Kuralları",
      sira: 4,
      maddeler: [
        "Bakanlık yetkililerine saygı gösterilmelidir.",
        "Yasak Orman'a izinsiz giriş yasaktır.",
        "Hogwarts dışına izinsiz çıkılmaz.",
      ],
    },
    {
      baslik: "Ceza Sistemi",
      sira: 5,
      maddeler: [
        "1. İhlal: Sözlü uyarı",
        "2. İhlal: 1 gün ban",
        "3. İhlal: 3 gün ban",
        "4. İhlal: 7 gün ban",
        "5. İhlal: Kalıcı ban",
      ],
    },
  ];

  for (let ki = 0; ki < kuralKategorileri.length; ki++) {
    const kat = kuralKategorileri[ki];
    const mevcutKat = await prisma.kuralKategori.findFirst({
      where: { baslik: kat.baslik },
    });

    if (!mevcutKat) {
      const yeniKat = await prisma.kuralKategori.create({
        data: { baslik: kat.baslik, sira: kat.sira },
      });

      for (let mi = 0; mi < kat.maddeler.length; mi++) {
        await prisma.kuralMadde.create({
          data: {
            kategoriId: yeniKat.id,
            icerik: kat.maddeler[mi],
            sira: mi + 1,
          },
        });
      }
      console.log(
        `✅ ${kat.baslik} oluşturuldu (${kat.maddeler.length} madde)`
      );
    } else {
      console.log(`⏭️ ${kat.baslik} zaten var`);
    }
  }

  // ============ EKİP ============
  const ekipUyeleri = [
    {
      isim: "Kurucu",
      rol: "Founder",
      ikon: "👑",
      renk: "from-red-500 to-red-700",
      sira: 1,
    },
    {
      isim: "Baş Admin",
      rol: "Head Admin",
      ikon: "⚔️",
      renk: "from-amber-500 to-amber-700",
      sira: 2,
    },
    {
      isim: "Admin",
      rol: "Admin",
      ikon: "🛡️",
      renk: "from-blue-500 to-blue-700",
      sira: 3,
    },
    {
      isim: "Moderatör",
      rol: "Moderator",
      ikon: "🔮",
      renk: "from-green-500 to-green-700",
      sira: 4,
    },
    {
      isim: "Yetkili",
      rol: "Helper",
      ikon: "🪄",
      renk: "from-purple-500 to-purple-700",
      sira: 5,
    },
  ];

  const ekipSayisi = await prisma.ekipUye.count();
  if (ekipSayisi === 0) {
    for (let ei = 0; ei < ekipUyeleri.length; ei++) {
      await prisma.ekipUye.create({ data: ekipUyeleri[ei] });
    }
    console.log(`✅ ${ekipUyeleri.length} ekip üyesi oluşturuldu`);
  } else {
    console.log(`⏭️ Ekip zaten var (${ekipSayisi} üye)`);
  }

  // ============ MARKET ============
  const marketUrunleri = [
    {
      isim: "Bronz VIP",
      aciklama: "Yeni başlayanlar için ideal VIP paketi.",
      fiyat: 50,
      ozellikler: "Özel Tag,2 Araç Slotu,Özel Renk",
      ikon: "🥉",
      renk: "from-orange-600 to-orange-800",
      populer: false,
      sira: 1,
    },
    {
      isim: "Gümüş VIP",
      aciklama: "Orta seviye oyuncular için özel paket.",
      fiyat: 100,
      ozellikler: "Özel Tag,5 Araç Slotu,Özel Ev,Özel Renk",
      ikon: "🥈",
      renk: "from-gray-400 to-gray-600",
      populer: true,
      sira: 2,
    },
    {
      isim: "Altın VIP",
      aciklama: "En popüler VIP paketi. Tüm avantajlar!",
      fiyat: 200,
      ozellikler: "Özel Tag,10 Araç Slotu,Özel Ev,Özel Araç,Özel Efektler",
      ikon: "🥇",
      renk: "from-amber-400 to-amber-600",
      populer: true,
      sira: 3,
    },
    {
      isim: "Elmas VIP",
      aciklama: "Sunucunun elit oyuncuları için.",
      fiyat: 500,
      ozellikler:
        "Tüm VIP Avantajları,Kendi Evin,Özel Karakter,Özel Araç,Admin ile İletişim",
      ikon: "💎",
      renk: "from-cyan-400 to-blue-600",
      populer: false,
      sira: 4,
    },
  ];

  const marketSayisi = await prisma.marketUrun.count();
  if (marketSayisi === 0) {
    for (let mi = 0; mi < marketUrunleri.length; mi++) {
      await prisma.marketUrun.create({ data: marketUrunleri[mi] });
    }
    console.log(`✅ ${marketUrunleri.length} market ürünü oluşturuldu`);
  } else {
    console.log(`⏭️ Market zaten var (${marketSayisi} ürün)`);
  }

  console.log("🎉 Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });