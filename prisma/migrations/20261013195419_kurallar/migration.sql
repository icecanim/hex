-- CreateTable
CREATE TABLE "KuralKategori" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baslik" TEXT NOT NULL,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KuralMadde" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kategoriId" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KuralMadde_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KuralKategori" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
