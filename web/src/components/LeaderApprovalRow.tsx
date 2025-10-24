'use client';

import { useEffect, useState, useTransition } from "react";
import type { RankProgress, Requirement, Scout } from "@/generated/prisma/client";

type ApprovalAction = (formData: FormData) => Promise<
  | {
      success?: string;
      error?: string;
    }
  | void
>;

type LeaderApprovalRowProps = {
  leaderId: string;
  progress: RankProgress & {
    requirement: Requirement;
    scout: Pick<Scout, "id" | "firstName" | "lastName">;
  };
  onApprove: ApprovalAction;
  onRevoke: ApprovalAction;
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

export function LeaderApprovalRow({ leaderId, progress, onApprove, onRevoke }: LeaderApprovalRowProps) {
  const [comment, setComment] = useState<string>(() => progress.approvalComment ?? "");
  const [isPending, startTransition] = useTransition();
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

  const submit = (intent: "approve" | "revoke") => {
    const formData = new FormData();
    formData.append("progressId", progress.id);

    if (intent === "approve") {
      formData.append("leaderId", leaderId);
      formData.append("approvalComment", comment);
    } else {
      formData.append("actorId", leaderId);
      formData.append("revocationReason", comment);
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await (intent === "approve" ? onApprove(formData) : onRevoke(formData));

      if (result && "error" in result && result.error) {
        setError(result.error);
        return;
      }

      setMessage(intent === "approve" ? "Approved" : "Revoked");
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-md shadow-slate-950/40">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Requirement</p>
          <h3 className="text-lg font-semibold text-slate-100">
            {progress.requirement.code}: {progress.requirement.title}
          </h3>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>
            Scout: <span className="font-semibold text-slate-100">{progress.scout.firstName} {progress.scout.lastName}</span>
          </p>
          <p>Started • {formatDisplayDate(progress.startedAt)}</p>
          <p>Eligible • {formatDisplayDate(progress.eligibleAt)}</p>
          <p>Completed • {formatDisplayDate(progress.completedAt)}</p>
        </div>
      </header>

      {progress.requirement.description && (
        <p className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4 text-sm text-slate-300">
          {progress.requirement.description}
        </p>
      )}

      {progress.notes && (
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Scout Notes</p>
          <p className="mt-2 whitespace-pre-wrap text-slate-200">{progress.notes}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
          <span>Approval comment</span>
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a note for the scout (e.g., initials, feedback, or follow-up instructions)"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => submit("approve")}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900/50 disabled:text-slate-500"
          >
            {isPending ? "Submitting..." : "Approve"}
          </button>
          <button
            type="button"
            onClick={() => submit("revoke")}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900/50 disabled:text-slate-500"
          >
            {isPending ? "Updating..." : "Revoke"}
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
    </div>
  );
}
