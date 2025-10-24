-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'LEADER', 'SCOUT');

-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDING', 'APPROVED', 'REVOKED');

-- AlterTable
ALTER TABLE "rank_progress" ADD COLUMN     "approvalComment" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT;

-- AlterTable
ALTER TABLE "requirements" ADD COLUMN     "durationDays" INTEGER,
ADD COLUMN     "durationMonths" INTEGER,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "scouts" ADD COLUMN     "council" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL,
    "bsaId" TEXT,
    "initials" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leader_scout_links" (
    "id" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    "scoutId" TEXT NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leader_scout_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merit_badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isEagleRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merit_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merit_badge_requirements" (
    "id" TEXT NOT NULL,
    "meritBadgeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merit_badge_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merit_badge_progress" (
    "id" TEXT NOT NULL,
    "scoutId" TEXT NOT NULL,
    "meritBadgeId" TEXT NOT NULL,
    "dateStarted" TIMESTAMP(3),
    "dateCompleted" TIMESTAMP(3),
    "counselorName" TEXT,
    "counselorPhone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merit_badge_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merit_badge_requirement_status" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merit_badge_requirement_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_of_reviews" (
    "id" TEXT NOT NULL,
    "scoutId" TEXT NOT NULL,
    "rank" "Rank" NOT NULL,
    "previousRankBorActual" TIMESTAMP(3),
    "thisRankBorActual" TIMESTAMP(3),
    "thisRankBorProjected" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_of_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leader_scout_links_leaderId_scoutId_key" ON "leader_scout_links"("leaderId", "scoutId");

-- CreateIndex
CREATE UNIQUE INDEX "merit_badges_name_key" ON "merit_badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "merit_badge_requirements_meritBadgeId_code_key" ON "merit_badge_requirements"("meritBadgeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "merit_badge_progress_scoutId_meritBadgeId_key" ON "merit_badge_progress"("scoutId", "meritBadgeId");

-- CreateIndex
CREATE UNIQUE INDEX "merit_badge_requirement_status_progressId_requirementId_key" ON "merit_badge_requirement_status"("progressId", "requirementId");

-- CreateIndex
CREATE UNIQUE INDEX "board_of_reviews_scoutId_rank_key" ON "board_of_reviews"("scoutId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "scouts_userId_key" ON "scouts"("userId");

-- AddForeignKey
ALTER TABLE "scouts" ADD CONSTRAINT "scouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank_progress" ADD CONSTRAINT "rank_progress_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leader_scout_links" ADD CONSTRAINT "leader_scout_links_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leader_scout_links" ADD CONSTRAINT "leader_scout_links_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "scouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leader_scout_links" ADD CONSTRAINT "leader_scout_links_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merit_badge_requirements" ADD CONSTRAINT "merit_badge_requirements_meritBadgeId_fkey" FOREIGN KEY ("meritBadgeId") REFERENCES "merit_badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merit_badge_progress" ADD CONSTRAINT "merit_badge_progress_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "scouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merit_badge_progress" ADD CONSTRAINT "merit_badge_progress_meritBadgeId_fkey" FOREIGN KEY ("meritBadgeId") REFERENCES "merit_badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merit_badge_requirement_status" ADD CONSTRAINT "merit_badge_requirement_status_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "merit_badge_progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merit_badge_requirement_status" ADD CONSTRAINT "merit_badge_requirement_status_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "merit_badge_requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_of_reviews" ADD CONSTRAINT "board_of_reviews_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "scouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

