'use server';

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

type ActionResult = {
  success?: string;
  error?: string;
};

export const updateSubtaskProgress = async (formData: FormData): Promise<ActionResult> => {
  const rankProgressId = formData.get("rankProgressId");
  const subtaskId = formData.get("subtaskId");
  const completed = formData.get("completed") === "true";

  if (!rankProgressId || typeof rankProgressId !== "string") {
    return { error: "Missing progress reference." };
  }

  if (!subtaskId || typeof subtaskId !== "string") {
    return { error: "Missing subtask reference." };
  }

  try {
    const completedAt = completed ? new Date() : null;

    await prisma.requirementSubtaskProgress.upsert({
      where: {
        rankProgressId_subtaskId: {
          rankProgressId,
          subtaskId,
        },
      },
      update: {
        completedAt,
      },
      create: {
        rankProgressId,
        subtaskId,
        completedAt,
      },
    });

    revalidatePath("/");
    revalidatePath("/leader");

    return { success: "Subtask updated." };
  } catch (error) {
    console.error("Failed to update subtask progress", error);
    return { error: "Could not update subtask. Please try again." };
  }
};
