-- CreateTable
CREATE TABLE "EkipUye" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isim" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "ikon" TEXT NOT NULL DEFAULT '👤',
    "renk" TEXT NOT NULL DEFAULT 'from-amber-500 to-amber-700',
    "sira" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
