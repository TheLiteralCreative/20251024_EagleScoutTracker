'use server';

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { LinkStatus } from "@/generated/prisma/enums";

type ActionResult = {
  success?: string;
  error?: string;
};

export const requestRankApproval = async (formData: FormData): Promise<ActionResult> => {
  const progressId = formData.get("progressId");
  const leaderId = formData.get("leaderId");
  const actorId = formData.get("actorId");

  if (!progressId || typeof progressId !== "string") {
    return { error: "Missing progress reference." };
  }

  if (!leaderId || typeof leaderId !== "string") {
    return { error: "Please select a leader." };
  }

  if (!actorId || typeof actorId !== "string") {
    return { error: "Missing user context for approval request." };
  }

  try {
    const progress = await prisma.rankProgress.findUnique({
      where: { id: progressId },
      select: {
        id: true,
        scoutId: true,
      },
    });

    if (!progress) {
      return { error: "Progress record not found." };
    }

    const link = await prisma.leaderScoutLink.findFirst({
      where: {
        leaderId,
        scoutId: progress.scoutId,
        status: LinkStatus.APPROVED,
      },
    });

    if (!link) {
      return { error: "That leader is not currently assigned to this scout." };
    }

    const requestedAt = new Date();

    await prisma.rankProgress.update({
      where: { id: progress.id },
      data: {
        approvalRequestedLeaderId: leaderId,
        approvalRequestedById: actorId,
        approvalRequestedAt: requestedAt,
        approved: false,
        approvedById: null,
        approvedAt: null,
        approvedInitials: null,
        approvalComment: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId,
        action: "RANK_PROGRESS_REQUESTED",
        entity: "RankProgress",
        entityId: progress.id,
        metadata: {
          scoutId: progress.scoutId,
          requestedLeaderId: leaderId,
          requestedAt: requestedAt.toISOString(),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/leader");

    return { success: "Approval requested." };
  } catch (error) {
    console.error("Failed to request rank approval", error);
    return { error: "Could not submit approval request. Please try again." };
  }
};
