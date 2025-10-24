'use server';

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

type ActionResult = {
  success?: string;
  error?: string;
};

export const createRankProgressNote = async (formData: FormData): Promise<ActionResult> => {
  const rankProgressId = formData.get("rankProgressId");
  const authorId = formData.get("authorId");
  const body = formData.get("body");

  if (!rankProgressId || typeof rankProgressId !== "string") {
    return { error: "Missing progress reference." };
  }

  if (!body || typeof body !== "string" || body.trim().length === 0) {
    return { error: "Please enter a note before saving." };
  }

  try {
    await prisma.rankProgressNote.create({
      data: {
        rankProgressId,
        authorId: authorId && typeof authorId === "string" ? authorId : null,
        body: body.trim(),
      },
    });

    revalidatePath("/");
    revalidatePath("/leader");

    return { success: "Note added." };
  } catch (error) {
    console.error("Failed to create rank progress note", error);
    return { error: "Could not add note. Please try again." };
  }
};
