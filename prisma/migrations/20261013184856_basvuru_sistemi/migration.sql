-- CreateTable
CREATE TABLE "BasvuruAyar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tur" TEXT NOT NULL,
    "acik" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

-- CreateTable
CREATE TABLE "BasvuruLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "tur" TEXT NOT NULL,
    "islem" TEXT NOT NULL,
    "detay" TEXT,
    "ceza" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "BasvuruAyar_tur_key" ON "BasvuruAyar"("tur");
