-- CreateTable
CREATE TABLE "MarketUrun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isim" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "fiyat" INTEGER NOT NULL,
    "ozellikler" TEXT NOT NULL DEFAULT '',
    "ikon" TEXT NOT NULL DEFAULT '🛒',
    "renk" TEXT NOT NULL DEFAULT 'from-amber-500 to-amber-700',
    "populer" BOOLEAN NOT NULL DEFAULT false,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
