'use client';

import { useMemo, useState } from "react";
import Link from "next/link";

import { Rank } from "@/generated/prisma/enums";
import { RequirementRow, UpdateRankProgressAction } from "@/components/RequirementRow";

type ScoutSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  unit: string | null;
  council: string | null;
  currentRank: Rank | null;
  dateOfBirth: string | null;
};

type RequirementData = {
  id: string;
  code: string;
  title: string;
  summary: string | null;
  detail: string | null;
  resourceUrl: string | null;
  dependencyText: string | null;
  durationDays: number | null;
  durationMonths: number | null;
  sortOrder: number;
};

type ProgressData = {
  id: string;
  startedAt: string | null;
  eligibleAt: string | null;
  completedAt: string | null;
  approved: boolean;
  approvedInitials: string | null;
  approvalComment: string | null;
  notes: string | null;
  updatedAt: string;
};

type RankPanel = {
  key: Rank;
  label: string;
  color: string;
  requirements: Array<{
    requirement: RequirementData;
    progress: ProgressData | null;
  }>;
};

type NextStepEntry = {
  key: string;
  rank: Rank;
  rankLabel: string;
  requirement: RequirementData;
  progress: {
    startedAt: string | null;
    eligibleAt: string | null;
    completedAt: string | null;
  } | null;
  messages: string[];
};

type NotesEntry = {
  id: string;
  requirementCode: string;
  requirementTitle: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    initials: string | null;
    role: string;
  } | null;
};

type ScoutTabsProps = {
  scout: ScoutSummary;
  rankPanels: RankPanel[];
  nextSteps: NextStepEntry[];
  notesFeed: NotesEntry[];
  updateAction: UpdateRankProgressAction;
};

export function ScoutTabs({
  scout,
  rankPanels,
  nextSteps,
  notesFeed,
  updateAction,
}: ScoutTabsProps) {
  const defaultTab = rankPanels.length > 0 ? `rank:${rankPanels[0].key}` : "next";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const tabButtons = useMemo(() => {
    const rankTabs = rankPanels.map((panel) => ({
      key: `rank:${panel.key}`,
      label: panel.label,
    }));

    return [
      ...rankTabs,
      { key: "next", label: "Next Steps" },
      { key: "notes", label: "Notes" },
    ];
  }, [rankPanels]);

  const formattedDob = scout.dateOfBirth ? formatDate(scout.dateOfBirth) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
        <h2 className="text-lg font-semibold uppercase tracking-[0.25em] text-slate-400">
          Scout Snapshot
        </h2>
        <div className="mt-4 grid gap-4 text-sm text-slate-200 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Name</p>
            <p className="mt-1 font-medium">
              {scout.firstName} {scout.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Current Rank</p>
            <p className="mt-1 font-medium">
              {scout.currentRank ? rankLabelFromEnum(scout.currentRank) : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Unit</p>
            <p className="mt-1 font-medium">{scout.unit ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">DOB</p>
            <p className="mt-1 font-medium">{formattedDob ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Email</p>
            <p className="mt-1 font-medium">{scout.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Phone</p>
            <p className="mt-1 font-medium">{scout.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Council</p>
            <p className="mt-1 font-medium">{scout.council ?? "—"}</p>
          </div>
          <div>
            <Link
              href="/leader"
              className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/80"
            >
              Leader dashboard
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          {tabButtons.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                  isActive
                    ? "border-slate-200 bg-slate-100 text-slate-900"
                    : "border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {rankPanels.map((panel) => {
            const tabKey = `rank:${panel.key}`;
            if (tabKey !== activeTab) {
              return null;
            }

            return (
              <article
                key={panel.key}
                className={`rounded-3xl border border-slate-800 bg-gradient-to-br p-6 shadow-lg shadow-slate-950/40 ${panel.color ?? "from-slate-900 via-slate-900/60 to-slate-900"}`}
              >
                <header className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {panel.label}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      {panel.requirements.length} requirements
                    </p>
                  </div>
                </header>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-800/80 text-left text-sm sm:text-base">
                    <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      <tr className="text-[11px] sm:text-xs">
                        <th className="py-3 pr-4 font-medium">Code</th>
                        <th className="py-3 pr-4 font-medium">Requirement</th>
                        <th className="py-3 pr-4 font-medium whitespace-nowrap">Started</th>
                        <th className="py-3 pr-4 font-medium whitespace-nowrap">Eligible</th>
                        <th className="py-3 pr-4 font-medium whitespace-nowrap">Completed</th>
                        <th className="py-3 pr-4 font-medium whitespace-nowrap">Approved</th>
                        <th className="py-3 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {panel.requirements.map(({ requirement, progress }) => {
                        const progressKey = progress
                          ? `${requirement.id}-${progress.updatedAt}`
                          : `${requirement.id}-new`;
                        return (
                          <RequirementRow
                            key={progressKey}
                            requirement={requirement}
                            progress={progress}
                            scoutId={scout.id}
                            onSubmit={updateAction}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}

          {activeTab === "next" && (
            <section className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 sm:grid-cols-3">
              {nextSteps.length === 0 ? (
                <div className="col-span-full flex flex-col items-center gap-2 text-center text-slate-200">
                  <h3 className="text-lg font-semibold">All tasks complete! 🎉</h3>
                  <p className="text-sm text-slate-400">
                    Once new requirements open up, they’ll show here with recommended priority.
                  </p>
                </div>
              ) : (
                nextSteps.map((item) => (
                  <div
                    key={item.key}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {item.rankLabel}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        {item.requirement.code}: {item.requirement.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-300">
                      {item.requirement.summary ?? "Work with your patrol or leader to complete this task."}
                    </p>
                    <ul className="flex flex-col gap-2 text-xs text-slate-400">
                      {item.messages.map((message, index) => (
                        <li key={index} className="rounded-lg border border-slate-800/70 bg-slate-900/70 px-3 py-2">
                          {message}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto text-xs text-slate-500">
                      <p>
                        Started: {item.progress?.startedAt ? formatDate(item.progress.startedAt) : "Not yet"}
                      </p>
                      <p>
                        Earliest eligible:{" "}
                        {item.progress?.eligibleAt ? formatDate(item.progress.eligibleAt) : "Once started"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

          {activeTab === "notes" && (
            <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
              <header>
                <h3 className="text-xl font-semibold tracking-tight">Requirement Notes</h3>
                <p className="text-sm text-slate-400">
                  Entries from scouts and leaders are grouped here so you can review progress and feedback.
                </p>
              </header>

              {notesFeed.length === 0 ? (
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6 text-center text-slate-300">
                  No notes yet. Add context from the requirement table to start a log.
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {notesFeed.map((note) => (
                    <li
                      key={note.id}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-4 text-sm text-slate-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            {note.requirementCode}
                          </p>
                          <p className="font-semibold">{note.requirementTitle}</p>
                        </div>
                        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">{note.body}</p>
                      <p className="mt-3 text-xs text-slate-500">
                        {note.author
                          ? `${note.author.firstName} ${note.author.lastName} (${note.author.role})`
                          : "Unknown author"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function rankLabelFromEnum(rank: Rank) {
  switch (rank) {
    case Rank.SCOUT:
      return "Scout";
    case Rank.TENDERFOOT:
      return "Tenderfoot";
    case Rank.SECOND_CLASS:
      return "Second Class";
    case Rank.FIRST_CLASS:
      return "First Class";
    case Rank.STAR:
      return "Star";
    case Rank.LIFE:
      return "Life";
    case Rank.EAGLE:
      return "Eagle";
    default:
      return rank;
  }
}
