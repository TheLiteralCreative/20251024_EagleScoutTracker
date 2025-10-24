-- AlterTable
ALTER TABLE "rank_progress" ADD COLUMN     "approvalRequestedAt" TIMESTAMP(3),
ADD COLUMN     "approvalRequestedById" TEXT,
ADD COLUMN     "approvalRequestedLeaderId" TEXT;

-- AddForeignKey
ALTER TABLE "rank_progress" ADD CONSTRAINT "rank_progress_approvalRequestedById_fkey" FOREIGN KEY ("approvalRequestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank_progress" ADD CONSTRAINT "rank_progress_approvalRequestedLeaderId_fkey" FOREIGN KEY ("approvalRequestedLeaderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

