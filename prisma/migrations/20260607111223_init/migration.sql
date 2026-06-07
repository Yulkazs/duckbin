-- CreateTable
CREATE TABLE "snippets" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(7) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "code" TEXT NOT NULL,
    "language" VARCHAR(50) NOT NULL,
    "theme" VARCHAR(50) NOT NULL,
    "ownerToken" VARCHAR(64) NOT NULL,
    "passwordHash" VARCHAR(255),
    "burnAfterReading" BOOLEAN NOT NULL DEFAULT false,
    "burnedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "snippets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "snippets_slug_key" ON "snippets"("slug");

-- CreateIndex
CREATE INDEX "snippets_slug_idx" ON "snippets"("slug");

-- CreateIndex
CREATE INDEX "snippets_createdAt_idx" ON "snippets"("createdAt");
