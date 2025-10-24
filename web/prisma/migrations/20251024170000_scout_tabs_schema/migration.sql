-- AlterTable
ALTER TABLE "requirements" ADD COLUMN     "dependencyText" TEXT,
ADD COLUMN     "detail" TEXT,
ADD COLUMN     "resourceUrl" TEXT,
ADD COLUMN     "summary" TEXT;

-- CreateTable
CREATE TABLE "requirement_subtasks" (
    "id" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requirement_subtasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement_subtask_progress" (
    "id" TEXT NOT NULL,
    "rankProgressId" TEXT NOT NULL,
    "subtaskId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requirement_subtask_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank_progress_notes" (
    "id" TEXT NOT NULL,
    "rankProgressId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rank_progress_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "requirement_subtasks_requirementId_code_key" ON "requirement_subtasks"("requirementId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "requirement_subtask_progress_rankProgressId_subtaskId_key" ON "requirement_subtask_progress"("rankProgressId", "subtaskId");

-- CreateIndex
CREATE INDEX "rank_progress_notes_rankProgressId_idx" ON "rank_progress_notes"("rankProgressId");

-- AddForeignKey
ALTER TABLE "requirement_subtasks" ADD CONSTRAINT "requirement_subtasks_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_subtask_progress" ADD CONSTRAINT "requirement_subtask_progress_rankProgressId_fkey" FOREIGN KEY ("rankProgressId") REFERENCES "rank_progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_subtask_progress" ADD CONSTRAINT "requirement_subtask_progress_subtaskId_fkey" FOREIGN KEY ("subtaskId") REFERENCES "requirement_subtasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank_progress_notes" ADD CONSTRAINT "rank_progress_notes_rankProgressId_fkey" FOREIGN KEY ("rankProgressId") REFERENCES "rank_progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank_progress_notes" ADD CONSTRAINT "rank_progress_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

