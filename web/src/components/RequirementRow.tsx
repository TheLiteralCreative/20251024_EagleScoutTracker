'use client';

import { useEffect, useMemo, useState, useTransition } from "react";

import { requestRankApproval } from "@/app/actions/request-rank-approval";
import { updateSubtaskProgress } from "@/app/actions/update-subtask-progress";
import { createRankProgressNote } from "@/app/actions/create-rank-progress-note";

export type UpdateRankProgressAction = (formData: FormData) => Promise<
  | {
      success?: string;
      error?: string;
    }
  | void
>;

type RequirementRowRequirement = {
  id: string;
  code: string;
  title: string;
  summary: string | null;
  detail: string | null;
  resourceUrl: string | null;
  dependencyText: string | null;
  durationDays: number | null;
  durationMonths: number | null;
};

type RequirementRowProgress = {
  id: string;
  startedAt: string | null;
  eligibleAt: string | null;
  completedAt: string | null;
  approved: boolean;
  approvedInitials: string | null;
  approvalComment: string | null;
  notes: string | null;
  updatedAt: string;
  approvalRequestedLeaderId: string | null;
  approvalRequestedAt: string | null;
};

type SubtaskRow = {
  id: string;
  code: string;
  title: string;
  detail: string | null;
  completedAt: string | null;
};

type NoteEntry = {
  id: string;
  body: string;
  createdAt: string;
  author:
    | {
        id: string;
        firstName: string;
        lastName: string;
        initials: string;
        role: string;
      }
    | null;
};

type LeaderOption = {
  id: string;
  label: string;
  initials: string;
};

type RequirementRowProps = {
  requirement: RequirementRowRequirement;
  progress: RequirementRowProgress | null;
  subtasks: SubtaskRow[];
  noteEntries: NoteEntry[];
  leaders: LeaderOption[];
  scoutUserId: string | null;
  scoutId: string;
  onSubmit: UpdateRankProgressAction;
};

const toInputDate = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const formatDisplayDate = (value?: string | Date | null) => {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
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
  subtasks,
  noteEntries,
  leaders,
  scoutUserId,
  scoutId,
  onSubmit,
}: RequirementRowProps) {
  const [isPending, startTransition] = useTransition();
  const [startedAt, setStartedAt] = useState<string>(() => toInputDate(progress?.startedAt ?? null));
  const [completedAt, setCompletedAt] = useState<string>(() => toInputDate(progress?.completedAt ?? null));
  const [eligibleOverride, setEligibleOverride] = useState<string>(() => toInputDate(progress?.eligibleAt ?? null));
  const [notes, setNotes] = useState<string>(progress?.notes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultLeaderId = progress?.approvalRequestedLeaderId ?? leaders[0]?.id ?? "";
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>(defaultLeaderId);
  const [newNote, setNewNote] = useState<string>("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [noteMessage, setNoteMessage] = useState<string | null>(null);
  const [pendingSubtask, setPendingSubtask] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isRequesting, startRequestTransition] = useTransition();
  const [isAddingNote, startAddNoteTransition] = useTransition();
  const [isTogglingSubtask, startToggleSubtaskTransition] = useTransition();

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

  useEffect(() => {
    if (!requestMessage && !requestError) {
      return;
    }

    const timeout = setTimeout(() => {
      setRequestMessage(null);
      setRequestError(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [requestMessage, requestError]);

  useEffect(() => {
    if (!noteMessage && !noteError) {
      return;
    }

    const timeout = setTimeout(() => {
      setNoteMessage(null);
      setNoteError(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [noteMessage, noteError]);

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

  const dependencyMessage =
    requirement.dependencyText && !progress?.completedAt
      ? requirement.dependencyText
      : null;

  const requestedLeaderName = progress?.approvalRequestedLeaderId
    ? leaders.find((item) => item.id === progress.approvalRequestedLeaderId)?.label ?? null
    : null;

  const requestedAtDisplay = progress?.approvalRequestedAt
    ? formatDisplayDate(progress.approvalRequestedAt)
    : null;

  const handleRequestApproval = () => {
    if (!progress?.id) {
      setRequestError("Save progress first before requesting approval.");
      return;
    }
    if (!selectedLeaderId) {
      setRequestError("Choose a leader to notify.");
      return;
    }
    setRequestError(null);
    setRequestMessage(null);

    const formData = new FormData();
    formData.append("progressId", progress.id);
    formData.append("leaderId", selectedLeaderId);
    if (scoutUserId) {
      formData.append("actorId", scoutUserId);
    }

    startRequestTransition(async () => {
      const result = await requestRankApproval(formData);
      if (result?.error) {
        setRequestError(result.error);
        return;
      }
      setRequestMessage("Approval requested.");
    });
  };

  const handleToggleSubtask = (subtaskId: string, completed: boolean) => {
    if (!progress?.id) {
      setError("Save the requirement progress before updating subtasks.");
      return;
    }
    setPendingSubtask(subtaskId);
    const formData = new FormData();
    formData.append("rankProgressId", progress.id);
    formData.append("subtaskId", subtaskId);
    formData.append("completed", completed ? "true" : "false");

    startToggleSubtaskTransition(async () => {
      const result = await updateSubtaskProgress(formData);
      if (result?.error) {
        setError(result.error);
      }
      setPendingSubtask(null);
    });
  };

  const handleAddNote = () => {
    if (!progress?.id) {
      setNoteError("Save progress before adding notes.");
      return;
    }
    if (!newNote.trim()) {
      setNoteError("Enter a note before saving.");
      return;
    }
    setNoteError(null);
    setNoteMessage(null);

    const formData = new FormData();
    formData.append("rankProgressId", progress.id);
    if (scoutUserId) {
      formData.append("authorId", scoutUserId);
    }
    formData.append("body", newNote.trim());

    startAddNoteTransition(async () => {
      const result = await createRankProgressNote(formData);
      if (result?.error) {
        setNoteError(result.error);
        return;
      }
      setNewNote("");
      setNoteMessage("Note added.");
    });
  };

  return (
    <tr className="align-top text-slate-200">
      <td className="py-4 pr-4 font-semibold text-slate-100 sm:text-base">{requirement.code}</td>
      <td className="py-4 pr-4 text-slate-300">
        <div className="font-medium text-slate-100">{requirement.title}</div>
        {requirement.summary && (
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">{requirement.summary}</p>
        )}
        {(requirement.detail || requirement.resourceUrl) && (
          <details className="mt-2 text-xs text-slate-400">
            <summary className="cursor-pointer select-none text-slate-300 underline decoration-dotted">
              View full description
            </summary>
            {requirement.detail && (
              <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-slate-300">
                {requirement.detail}
              </p>
            )}
            {requirement.resourceUrl && (
              <a
                className="mt-2 inline-flex items-center text-[13px] font-semibold text-sky-300 hover:text-sky-200"
                href={requirement.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Official reference
              </a>
            )}
          </details>
        )}
        {subtasks.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Subtasks</p>
            <ul className="flex flex-col gap-2 text-xs text-slate-300">
              {subtasks.map((subtask) => {
                const completed = !!subtask.completedAt;
                const busy = isTogglingSubtask && pendingSubtask === subtask.id;
                return (
                  <li key={subtask.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                      checked={completed}
                      disabled={!progress?.id || busy}
                      onChange={(event) => handleToggleSubtask(subtask.id, event.target.checked)}
                    />
                    <div>
                      <p className="font-medium text-slate-200">
                        {subtask.code}: {subtask.title}
                      </p>
                      {subtask.detail && (
                        <p className="text-[11px] text-slate-500">{subtask.detail}</p>
                      )}
                      {completed && (
                        <p className="text-[11px] text-emerald-300">
                          Completed {formatDisplayDate(subtask.completedAt)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
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
          {dependencyMessage && (
            <p className="text-[11px] leading-relaxed text-slate-400">{dependencyMessage}</p>
          )}
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
      <td className="py-4 pr-4 text-slate-300">
        <div className="flex flex-col gap-2">
          {approvalBadge}
          {!progress?.approved && (
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-3 text-xs">
              {leaders.length === 0 ? (
                <p className="text-slate-500">No leaders assigned yet. Request your admin to link one.</p>
              ) : (
                <>
                  <label className="flex flex-col gap-1 text-slate-400">
                    <span className="uppercase tracking-[0.25em] text-slate-500">Select leader</span>
                    <select
                      className="rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500/40"
                      value={selectedLeaderId}
                      onChange={(event) => setSelectedLeaderId(event.target.value)}
                    >
                      <option value="">Choose...</option>
                      {leaders.map((leader) => (
                        <option key={leader.id} value={leader.id}>
                          {leader.label} ({leader.initials})
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={handleRequestApproval}
                    disabled={isRequesting}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-amber-200 transition hover:border-amber-400 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/50 disabled:text-slate-500"
                  >
                    {isRequesting ? "Requesting..." : "Request approval"}
                  </button>
                </>
              )}
              {requestedLeaderName && (
                <p className="mt-2 text-[11px] text-slate-400">
                  Requested from {requestedLeaderName}
                  {requestedAtDisplay ? ` on ${requestedAtDisplay}` : ""}
                </p>
              )}
              {requestMessage && (
                <p className="mt-2 text-[11px] text-emerald-300">{requestMessage}</p>
              )}
              {requestError && (
                <p className="mt-2 text-[11px] text-rose-300">{requestError}</p>
              )}
            </div>
          )}
        </div>
      </td>
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
        {progress?.id && (
          <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400">
            <label className="flex flex-col gap-2 text-slate-400">
              <span className="uppercase tracking-[0.2em] text-slate-500">Add timeline note</span>
              <textarea
                className="min-h-[70px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40"
                value={newNote}
                onChange={(event) => setNewNote(event.target.value)}
                placeholder="Share progress details or questions for your leader"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAddNote}
                disabled={isAddingNote}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/50 disabled:text-slate-500"
              >
                {isAddingNote ? "Saving..." : "Add note"}
              </button>
              {noteMessage && (
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                  {noteMessage}
                </span>
              )}
              {noteError && (
                <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-rose-200">
                  {noteError}
                </span>
              )}
            </div>
          </div>
        )}
        {noteEntries.length > 0 && (
          <div className="mt-4 space-y-2 text-xs text-slate-400">
            <p className="uppercase tracking-[0.25em] text-slate-500">Timeline</p>
            <ul className="flex flex-col gap-2">
              {noteEntries.map((note) => (
                <li key={note.id} className="rounded-lg border border-slate-800/60 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between gap-4 text-[11px] text-slate-500">
                    <span>
                      {note.author
                        ? `${note.author.firstName} ${note.author.lastName} (${note.author.role})`
                        : "Unknown"}
                    </span>
                    <span>{formatDisplayDate(note.createdAt)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{note.body}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </td>
    </tr>
  );
}
