-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('SCOUT', 'TENDERFOOT', 'SECOND_CLASS', 'FIRST_CLASS', 'STAR', 'LIFE', 'EAGLE');

-- CreateTable
CREATE TABLE "scouts" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "currentRank" "Rank",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirements" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rank" "Rank" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank_progress" (
    "id" TEXT NOT NULL,
    "scoutId" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "eligibleAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedInitials" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rank_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "requirements_code_key" ON "requirements"("code");

-- CreateIndex
CREATE INDEX "requirements_rank_sortOrder_idx" ON "requirements"("rank", "sortOrder");

-- CreateIndex
CREATE INDEX "rank_progress_requirementId_idx" ON "rank_progress"("requirementId");

-- CreateIndex
CREATE UNIQUE INDEX "rank_progress_scoutId_requirementId_key" ON "rank_progress"("scoutId", "requirementId");

-- AddForeignKey
ALTER TABLE "rank_progress" ADD CONSTRAINT "rank_progress_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "scouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank_progress" ADD CONSTRAINT "rank_progress_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
