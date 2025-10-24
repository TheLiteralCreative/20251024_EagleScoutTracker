'use server';

import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";

type ActionResult = {
  success?: string;
  error?: string;
};

const inferInitials = (firstName: string, lastName: string, fallback?: string | null) => {
  if (fallback && fallback.trim().length > 0) {
    return fallback.trim().toUpperCase();
  }

  const first = firstName?.trim().at(0) ?? "";
  const last = lastName?.trim().at(0) ?? "";

  return `${first}${last}`.toUpperCase();
};

export const approveRankProgress = async (formData: FormData): Promise<ActionResult> => {
  const progressId = formData.get("progressId");
  const leaderId = formData.get("leaderId");
  const commentValue = formData.get("approvalComment");

  if (!progressId || typeof progressId !== "string") {
    return { error: "Missing progress reference." };
  }

  if (!leaderId || typeof leaderId !== "string") {
    return { error: "Missing leader reference." };
  }

  const approvalComment =
    commentValue && typeof commentValue === "string" && commentValue.trim().length > 0
      ? commentValue.trim()
      : null;

  try {
    const [progress, leader] = await Promise.all([
      prisma.rankProgress.findUnique({
        where: { id: progressId },
        select: {
          id: true,
          scoutId: true,
          requirementId: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: leaderId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          initials: true,
        },
      }),
    ]);

    if (!progress) {
      return { error: "Progress record not found." };
    }

    if (!leader) {
      return { error: "Leader not found." };
    }

    const approvedAt = new Date();

    await prisma.rankProgress.update({
      where: { id: progressId },
      data: {
        approved: true,
        approvedById: leader.id,
        approvedAt,
        approvedInitials: inferInitials(leader.firstName, leader.lastName, leader.initials),
        approvalComment,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: leader.id,
        action: "RANK_PROGRESS_APPROVED",
        entity: "RankProgress",
        entityId: progress.id,
        metadata: {
          scoutId: progress.scoutId,
          requirementId: progress.requirementId,
          approvedAt: approvedAt.toISOString(),
          approvalComment,
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/leader");

    return { success: "Requirement approved." };
  } catch (error) {
    console.error("Failed to approve rank progress", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      (error.code === "P2025" || error.code === "P2003")
    ) {
      return { error: "Unable to approve this record. Please refresh." };
    }

    return { error: "Something went wrong while approving. Please try again." };
  }
};
