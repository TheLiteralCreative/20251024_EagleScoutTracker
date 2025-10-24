'use server';

import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";

type ActionResult = {
  success?: string;
  error?: string;
};

export const revokeRankProgress = async (formData: FormData): Promise<ActionResult> => {
  const progressId = formData.get("progressId");
  const actorId = formData.get("actorId");
  const reasonValue = formData.get("revocationReason");

  if (!progressId || typeof progressId !== "string") {
    return { error: "Missing progress reference." };
  }

  const revocationReason =
    reasonValue && typeof reasonValue === "string" && reasonValue.trim().length > 0
      ? reasonValue.trim()
      : null;

  try {
    const progress = await prisma.rankProgress.update({
      where: { id: progressId },
      data: {
        approved: false,
        approvedById: null,
        approvedAt: null,
        approvedInitials: null,
        approvalComment: revocationReason,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: actorId && typeof actorId === "string" ? actorId : null,
        action: "RANK_PROGRESS_REVOKED",
        entity: "RankProgress",
        entityId: progress.id,
        metadata: {
          scoutId: progress.scoutId,
          requirementId: progress.requirementId,
          revocationReason,
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/leader");

    return { success: "Approval revoked." };
  } catch (error) {
    console.error("Failed to revoke rank progress", error);

    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return { error: "Progress record was not found." };
    }

    return { error: "Something went wrong while revoking. Please try again." };
  }
};
