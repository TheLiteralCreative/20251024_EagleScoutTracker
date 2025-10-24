'use server';

import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";

type ActionResult = {
  success?: string;
  error?: string;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseDate = (value: FormDataEntryValue | null): Date | null => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  const desiredMonth = result.getUTCMonth() + months;
  result.setUTCMonth(desiredMonth);

  // Handle month rollover (e.g., adding 1 month to Jan 31 should land on Feb 29/28)
  const monthDiff = desiredMonth - result.getUTCMonth();
  if (monthDiff !== months) {
    result.setUTCDate(0);
  }

  return result;
};

const calculateEligibleDate = (
  startedAt: Date | null,
  durationDays: number | null,
  durationMonths: number | null
): Date | null => {
  if (!startedAt) {
    return null;
  }

  let candidate = new Date(startedAt);

  if (durationMonths && durationMonths > 0) {
    candidate = addMonths(candidate, durationMonths);
  }

  if (durationDays && durationDays > 0) {
    candidate = new Date(candidate.getTime() + durationDays * MS_PER_DAY);
  }

  return candidate;
};

export const updateRankProgress = async (formData: FormData): Promise<ActionResult> => {
  const scoutId = formData.get("scoutId");
  const requirementId = formData.get("requirementId");
  const noteValue = formData.get("notes");
  const startedValue = formData.get("startedAt");
  const completedValue = formData.get("completedAt");
  const manualEligibleValue = formData.get("eligibleAt");

  if (!scoutId || typeof scoutId !== "string") {
    return { error: "Missing scout reference." };
  }

  if (!requirementId || typeof requirementId !== "string") {
    return { error: "Missing requirement reference." };
  }

  const notes =
    noteValue && typeof noteValue === "string" && noteValue.trim().length > 0
      ? noteValue.trim()
      : null;

  const startedAt = parseDate(startedValue);
  const completedAt = parseDate(completedValue);
  const eligibleOverride = parseDate(manualEligibleValue);

  try {
    const [requirement, scout] = await Promise.all([
      prisma.requirement.findUnique({
        where: { id: requirementId },
        select: {
          durationDays: true,
          durationMonths: true,
        },
      }),
      prisma.scout.findUnique({
        where: { id: scoutId },
        select: { userId: true },
      }),
    ]);

    if (!requirement) {
      return { error: "Requirement not found." };
    }

    const computedEligible = calculateEligibleDate(
      startedAt,
      requirement.durationDays ?? null,
      requirement.durationMonths ?? null
    );

    const eligibleAt = computedEligible ?? eligibleOverride;

    const updatedProgress = await prisma.rankProgress.upsert({
      where: {
        scoutId_requirementId: {
          scoutId,
          requirementId,
        },
      },
      update: {
        startedAt,
        eligibleAt,
        completedAt,
        notes,
        approved: false,
        approvedById: null,
        approvedAt: null,
        approvedInitials: null,
        approvalComment: null,
        approvalRequestedAt: null,
        approvalRequestedById: null,
        approvalRequestedLeaderId: null,
      },
      create: {
        scoutId,
        requirementId,
        startedAt,
        eligibleAt,
        completedAt,
        notes,
        approvalRequestedAt: null,
        approvalRequestedById: null,
        approvalRequestedLeaderId: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: scout?.userId ?? null,
        action: "RANK_PROGRESS_UPDATED",
        entity: "RankProgress",
        entityId: updatedProgress.id,
        metadata: {
          scoutId,
          requirementId,
          startedAt: startedAt ? startedAt.toISOString() : null,
          eligibleAt: eligibleAt ? eligibleAt.toISOString() : null,
          completedAt: completedAt ? completedAt.toISOString() : null,
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/leader");

    return { success: "Progress saved." };
  } catch (error) {
    console.error("Failed to update rank progress", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        error: "Unable to update progress because of a missing link. Please refresh and try again.",
      };
    }

    return {
      error: "Something went wrong while saving. Please try again.",
    };
  }
};
