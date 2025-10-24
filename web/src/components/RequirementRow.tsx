'use client';

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Requirement, RankProgress } from "@/generated/prisma/client";

type UpdateRankProgressAction = (formData: FormData) => Promise<
  | {
      success?: string;
      error?: string;
    }
  | void
>;

type RequirementRowProps = {
  requirement: Requirement;
  progress?: RankProgress | null;
  scoutId: string;
  onSubmit: UpdateRankProgressAction;
};

const toInputDate = (value?: Date | string | null) => {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const formatDisplayDate = (value?: Date | null) => {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(value);
};

const calculateEligiblePreview = (
  startedAt: string,
  durationDays?: number | null,
  durationMonths?: number | null
): string => {
  if (!startedAt) {
    return "—";
  }

  const startDate = new Date(startedAt);

  if (Number.isNaN(startDate.getTime())) {
    return "—";
  }

  let candidate = new Date(startDate);

  if (durationMonths && durationMonths > 0) {
    const desiredMonth = candidate.getUTCMonth() + durationMonths;
    candidate.setUTCMonth(desiredMonth);

    const diff = desiredMonth - candidate.getUTCMonth();
    if (diff !== durationMonths) {
      candidate.setUTCDate(0);
    }
  }

  if (durationDays && durationDays > 0) {
    candidate = new Date(candidate.getTime() + durationDays * 24 * 60 * 60 * 1000);
  }

  return formatDisplayDate(candidate);
};

export function RequirementRow({
  requirement,
  progress,
  scoutId,
  onSubmit,
}: RequirementRowProps) {
  const [isPending, startTransition] = useTransition();
  const [startedAt, setStartedAt] = useState<string>(() => toInputDate(progress?.startedAt ?? null));
  const [completedAt, setCompletedAt] = useState<string>(() =>
    toInputDate(progress?.completedAt ?? null)
  );
  const [eligibleOverride, setEligibleOverride] = useState<string>(() =>
    toInputDate(progress?.eligibleAt ?? null)
  );
  const [notes, setNotes] = useState<string>(progress?.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!message && !error) {
      return;
    }

    const timeout = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [message, error]);

  const eligiblePreview = useMemo(
    () =>
      calculateEligiblePreview(
        startedAt,
        requirement.durationDays ?? null,
        requirement.durationMonths ?? null
      ),
    [startedAt, requirement.durationDays, requirement.durationMonths]
  );

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("scoutId", scoutId);
    formData.append("requirementId", requirement.id);
    if (progress?.id) {
      formData.append("progressId", progress.id);
    }
    formData.append("startedAt", startedAt);
    formData.append("completedAt", completedAt);
    formData.append("eligibleAt", eligibleOverride);
    formData.append("notes", notes);

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await onSubmit(formData);

      if (result && "error" in result && result.error) {
        setError(result.error);
        return;
      }

      setMessage("Saved");
    });
  };

  const resetProgress = () => {
    setStartedAt("");
    setCompletedAt("");
    setEligibleOverride("");
    setNotes("");
  };

  const approvalBadge = progress?.approved ? (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
      {progress.approvedInitials ?? "OK"}
    </span>
  ) : (
    <span className="rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">
      Pending
    </span>
  );

  return (
    <tr className="align-top text-slate-200">
      <td className="py-4 pr-4 font-semibold text-slate-100 sm:text-base">{requirement.code}</td>
      <td className="py-4 pr-4 text-slate-300">
        <div className="font-medium text-slate-100">{requirement.title}</div>
        {requirement.description && (
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">{requirement.description}</p>
        )}
      </td>
      <td className="py-4 pr-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>Start</span>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40"
            value={startedAt}
            onChange={(event) => setStartedAt(event.target.value)}
            max="9999-12-31"
          />
        </label>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>Eligible</span>
          <div className="rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100">
            {eligiblePreview}
          </div>
          <details className="text-[11px] text-slate-500">
            <summary className="cursor-pointer select-none text-slate-400">
              Override date
            </summary>
            <input
              type="date"
              className="mt-2 w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40"
              value={eligibleOverride}
              onChange={(event) => setEligibleOverride(event.target.value)}
              max="9999-12-31"
            />
          </details>
        </div>
      </td>
      <td className="py-4 pr-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>Completed</span>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40"
            value={completedAt}
            onChange={(event) => setCompletedAt(event.target.value)}
            max="9999-12-31"
          />
        </label>
      </td>
      <td className="py-4 pr-4">{approvalBadge}</td>
      <td className="py-4 text-slate-300">
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            <span>Notes</span>
            <textarea
              className="min-h-[80px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add context or reminders"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/50 disabled:text-slate-500"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={resetProgress}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-600/60 bg-slate-800/60 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-400 hover:bg-slate-700/60 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900/50 disabled:text-slate-600"
            >
              Clear
            </button>
            {message && (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                {message}
              </span>
            )}
            {error && (
              <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-rose-200">
                {error}
              </span>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
