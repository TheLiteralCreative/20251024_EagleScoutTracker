import Link from "next/link";
import { redirect } from "next/navigation";

import { LinkStatus, Rank } from "@/generated/prisma/enums";
import { updateRankProgress } from "@/app/actions/update-rank-progress";
import { prisma } from "@/lib/prisma";
import { ScoutTabs } from "@/components/ScoutTabs";
import { requireUser } from "@/lib/session";

const rankMetadata: Record<Rank, { title: string; color: string }> = {
  [Rank.SCOUT]: { title: "Scout", color: "from-slate-500/10 via-slate-500/5 to-slate-500/10" },
  [Rank.TENDERFOOT]: {
    title: "Tenderfoot",
    color: "from-amber-500/10 via-amber-500/5 to-amber-500/10",
  },
  [Rank.SECOND_CLASS]: {
    title: "Second Class",
    color: "from-emerald-500/10 via-emerald-500/5 to-emerald-500/10",
  },
  [Rank.FIRST_CLASS]: {
    title: "First Class",
    color: "from-sky-500/10 via-sky-500/5 to-sky-500/10",
  },
  [Rank.STAR]: {
    title: "Star",
    color: "from-purple-500/10 via-purple-500/5 to-purple-500/10",
  },
  [Rank.LIFE]: {
    title: "Life",
    color: "from-rose-500/10 via-rose-500/5 to-rose-500/10",
  },
  [Rank.EAGLE]: {
    title: "Eagle",
    color: "from-red-500/10 via-red-500/5 to-red-500/10",
  },
};

const rankOrder: Rank[] = [
  Rank.SCOUT,
  Rank.TENDERFOOT,
  Rank.SECOND_CLASS,
  Rank.FIRST_CLASS,
  Rank.STAR,
  Rank.LIFE,
  Rank.EAGLE,
];

export default async function Home() {
  const viewer = await requireUser({ roles: ["SCOUT", "LEADER", "ADMIN"] });
  if (!viewer) {
    redirect("/login");
  }

  const scoutInclude = {
    include: {
      progress: {
        include: {
          noteEntries: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  initials: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          subtasks: {
            include: {
              subtask: true,
            },
          },
        },
      },
      leaderLinks: {
        include: {
          leader: true,
        },
      },
      user: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "asc" } as const,
  };

  let scout = await prisma.scout.findFirst({
    where: viewer.role === "SCOUT" ? { userId: viewer.id } : undefined,
    ...scoutInclude,
  });

  if (!scout && viewer.role !== "SCOUT") {
    scout = await prisma.scout.findFirst(scoutInclude);
  }

  const requirements = await prisma.requirement.findMany({
    include: {
      subtasks: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: [{ rank: "asc" }, { sortOrder: "asc" }],
  });

  if (!scout || requirements.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 text-center text-slate-100">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Path-to-Eagle Tracker
        </h1>
        <p className="max-w-xl text-balance text-slate-300">
          I couldn&apos;t find any seeded data. Once your database is running, apply the migrations
          and seed sample records with <code className="rounded bg-slate-800/80 px-2 py-1">npm run
          db:migrate</code> followed by <code className="rounded bg-slate-800/80 px-2 py-1">npm run
          db:seed</code>, then reload this page.
        </p>
      </main>
    );
  }

  const progressByRequirement = new Map(
    scout.progress.map((item) => [item.requirementId, item])
  );

  const requirementMap = new Map(requirements.map((req) => [req.id, req]));

  const leaders = scout.leaderLinks
    .filter((link) => link.status === LinkStatus.APPROVED && link.leader)
    .map((link) => ({
      id: link.leaderId,
      label: `${link.leader!.firstName} ${link.leader!.lastName}`,
      initials:
        link.leader!.initials ??
        `${link.leader!.firstName.at(0) ?? ""}${link.leader!.lastName.at(0) ?? ""}`.toUpperCase(),
    }));

  const scoutUserId = scout.user?.id ?? null;

  const rankPanels = rankOrder
    .map((rank) => {
      const rankRequirements = requirements.filter((requirement) => requirement.rank === rank);

      if (rankRequirements.length === 0) {
        return null;
      }

      return {
        key: rank,
        label: rankMetadata[rank].title,
        color: rankMetadata[rank].color,
        requirements: rankRequirements.map((requirement) => {
          const progress = progressByRequirement.get(requirement.id);
          const subtaskProgressMap = new Map(
            progress?.subtasks.map((entry) => [entry.subtaskId, entry]) ?? []
          );
          const subtasks = requirement.subtasks.map((subtask) => {
            const progressEntry = subtaskProgressMap.get(subtask.id);
            return {
              id: subtask.id,
              code: subtask.code,
              title: subtask.title,
              detail: subtask.detail ?? null,
              completedAt: progressEntry?.completedAt?.toISOString() ?? null,
            };
          });
          const noteEntries =
            progress?.noteEntries.map((note) => ({
              id: note.id,
              body: note.body,
              createdAt: note.createdAt.toISOString(),
              author: note.author
                ? {
                    id: note.author.id,
                    firstName: note.author.firstName,
                    lastName: note.author.lastName,
                    initials:
                      note.author.initials ??
                      `${note.author.firstName.at(0) ?? ""}${note.author.lastName.at(0) ?? ""}`.toUpperCase(),
                    role: note.author.role,
                  }
                : null,
            })) ?? [];

          return {
            requirement: {
              id: requirement.id,
              code: requirement.code,
              title: requirement.title,
              summary: requirement.summary ?? requirement.description ?? null,
              detail: requirement.detail ?? null,
              resourceUrl: requirement.resourceUrl ?? null,
              dependencyText: requirement.dependencyText ?? null,
              durationDays: requirement.durationDays ?? null,
              durationMonths: requirement.durationMonths ?? null,
              sortOrder: requirement.sortOrder,
            },
            progress: progress
              ? {
                  id: progress.id,
                  startedAt: progress.startedAt?.toISOString() ?? null,
                  eligibleAt: progress.eligibleAt?.toISOString() ?? null,
                  completedAt: progress.completedAt?.toISOString() ?? null,
                  approved: progress.approved,
                  approvedInitials: progress.approvedInitials,
                  approvalComment: progress.approvalComment,
                  notes: progress.notes ?? null,
                  updatedAt: progress.updatedAt.toISOString(),
                  approvalRequestedLeaderId: progress.approvalRequestedLeaderId ?? null,
                  approvalRequestedAt: progress.approvalRequestedAt?.toISOString() ?? null,
                }
              : null,
            subtasks,
            noteEntries,
          };
        }),
      };
    })
    .filter(Boolean) as Array<{
    key: Rank;
    label: string;
    color: string;
    requirements: Array<{
      requirement: {
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
      progress: {
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
      } | null;
      subtasks: Array<{
        id: string;
        code: string;
        title: string;
        detail: string | null;
        completedAt: string | null;
      }>;
      noteEntries: Array<{
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
      }>;
    }>;
  }>;

  const nextSteps = rankPanels
    .flatMap((panel) =>
      panel.requirements.map((entry) => {
        const { requirement, progress } = entry;
        const completed =
          !!progress?.approved && !!progress?.completedAt && !!progress?.approvedInitials;
        if (completed) {
          return null;
        }

        const rankIndex = rankOrder.indexOf(panel.key);
        const hasDuration =
          (requirement.durationDays ?? 0) > 0 || (requirement.durationMonths ?? 0) > 0;
        const inProgress = !!progress?.startedAt && !progress?.completedAt;
        const priority =
          rankIndex * 1000 + (hasDuration ? 0 : 300) + (inProgress ? 50 : 200) + requirement.sortOrder;

        const messages: string[] = [];
        if (hasDuration) {
          const months = requirement.durationMonths;
          const days = requirement.durationDays;
          const parts: string[] = [];
          if (months && months > 0) {
            parts.push(`${months} month${months > 1 ? "s" : ""}`);
          }
          if (days && days > 0) {
            parts.push(`${days}-day`);
          }
          messages.push(`Time-bound requirement (${parts.join(" and ") || "duration-based"}). Start early.`);
        }
        if (requirement.dependencyText) {
          messages.push(requirement.dependencyText);
        }
        if (inProgress) {
          messages.push("Already started—finish to keep momentum.");
        } else {
          messages.push(`Next pending item in ${panel.label}.`);
        }

        return {
          key: `${panel.key}-${requirement.code}`,
          rank: panel.key,
          rankLabel: panel.label,
          requirement,
              progress: progress
                ? {
                    startedAt: progress.startedAt,
                    eligibleAt: progress.eligibleAt,
                    completedAt: progress.completedAt,
                  }
            : null,
          messages,
          priority,
        };
      })
    )
    .filter(Boolean) as Array<{
    key: string;
    rank: Rank;
    rankLabel: string;
    requirement: (typeof rankPanels)[number]["requirements"][number]["requirement"];
    progress: {
      startedAt: string | null;
      eligibleAt: string | null;
      completedAt: string | null;
    } | null;
    messages: string[];
    priority: number;
  }>;

  const nextStepsTop = nextSteps.sort((a, b) => a.priority - b.priority).slice(0, 3);

  const notesFeed = scout.progress
    .flatMap((entry) => {
      const requirement = requirementMap.get(entry.requirementId);
      if (!requirement) {
        return [];
      }

      return entry.noteEntries.map((note) => ({
        id: note.id,
        requirementCode: requirement.code,
        requirementTitle: requirement.title,
        body: note.body,
        createdAt: note.createdAt.toISOString(),
        author: note.author
          ? {
              id: note.author.id,
              firstName: note.author.firstName,
              lastName: note.author.lastName,
              initials: note.author.initials,
              role: note.author.role,
            }
          : null,
      }));
    })
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <header className="grid gap-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-900/90 p-8 shadow-xl shadow-slate-950/60 sm:grid-cols-[1.5fr_1fr] sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Scout Profile</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {scout.firstName} {scout.lastName}
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              current rank ·{" "}
              <span className="font-medium text-slate-200">
                {rankMetadata[scout.currentRank ?? Rank.SCOUT]?.title ?? "Scout"}
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
              <Link
                href="/leader"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/80"
              >
                Leader dashboard
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-left text-sm sm:text-base">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-100">
                {scout.email ?? <span className="text-slate-500">Not provided</span>}
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Requirements Logged</dt>
              <dd className="mt-1 text-slate-100">
                {scout.progress.filter((item) => item.completedAt).length} completed
              </dd>
            </div>
          </dl>
        </header>

        <ScoutTabs
          scout={{
            id: scout.id,
            firstName: scout.firstName,
            lastName: scout.lastName,
            email: scout.email,
            phone: scout.phone,
            unit: scout.unit,
            council: scout.council,
            currentRank: scout.currentRank ?? null,
            dateOfBirth: scout.dateOfBirth?.toISOString() ?? null,
          }}
          rankPanels={rankPanels}
          nextSteps={nextStepsTop}
          notesFeed={notesFeed}
          updateAction={updateRankProgress}
          leaders={leaders}
          scoutUserId={scoutUserId}
        />
      </div>
    </main>
  );
}
