-- CreateTable
CREATE TABLE "Ban" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT,
    "steamId" TEXT,
    "sebep" TEXT NOT NULL,
    "banlayan" TEXT NOT NULL,
    "banBitis" DATETIME,
    "kalici" BOOLEAN NOT NULL DEFAULT false,
    "kaldirildi" BOOLEAN NOT NULL DEFAULT false,
    "kaldiranId" TEXT,
    "kaldirmaTarihi" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
