-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT,
    "environment" TEXT,
    "tag" TEXT,
    "path" TEXT,
    "error" TEXT,
    "user" TEXT,
    "created_at" DATETIME
);
