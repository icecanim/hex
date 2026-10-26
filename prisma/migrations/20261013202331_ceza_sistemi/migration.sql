-- CreateTable
CREATE TABLE "BasvuruDeneme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "tur" TEXT NOT NULL,
    "denemeSayisi" INTEGER NOT NULL DEFAULT 1,
    "sonDeneme" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "banli" BOOLEAN NOT NULL DEFAULT false,
    "banBitis" DATETIME,
    "banSebep" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BasvuruDeneme_discordId_tur_key" ON "BasvuruDeneme"("discordId", "tur");
