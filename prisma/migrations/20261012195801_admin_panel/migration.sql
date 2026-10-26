-- CreateTable
CREATE TABLE "Basvuru" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tur" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "discordAd" TEXT,
    "veriler" TEXT NOT NULL,
    "durum" TEXT NOT NULL DEFAULT 'beklemede',
    "onaylayan" TEXT,
    "mulakat" TEXT,
    "notlar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "isim" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Duyuru" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baslik" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "gonderen" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_discordId_key" ON "Admin"("discordId");
