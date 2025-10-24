import Link from "next/link";
import { redirect } from "next/navigation";

import { approveRankProgress } from "@/app/actions/approve-rank-progress";
import { revokeRankProgress } from "@/app/actions/revoke-rank-progress";
import { prisma } from "@/lib/prisma";
import { LeaderApprovalRow } from "@/components/LeaderApprovalRow";
import { LinkStatus, Rank } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/session";

const rankLabels: Record<Rank, string> = {
  [Rank.SCOUT]: "Scout",
  [Rank.TENDERFOOT]: "Tenderfoot",
  [Rank.SECOND_CLASS]: "Second Class",
  [Rank.FIRST_CLASS]: "First Class",
  [Rank.STAR]: "Star",
  [Rank.LIFE]: "Life",
  [Rank.EAGLE]: "Eagle",
};

export default async function LeaderDashboard() {
  const viewer = await requireUser({ roles: ["LEADER"] });

  if (!viewer) {
    redirect("/login");
  }

  const leader = await prisma.user.findUnique({
    where: { id: viewer.id },
    include: {
      leaderLinks: {
        where: { status: LinkStatus.APPROVED },
        include: {
          scout: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              currentRank: true,
            },
          },
        },
      },
    },
  });

  if (!leader) {
    redirect("/login");
  }

  const pending = await prisma.rankProgress.findMany({
    where: {
      approved: false,
      approvalRequestedLeaderId: leader.id,
      scout: {
        leaderLinks: {
          some: {
            leaderId: leader.id,
            status: LinkStatus.APPROVED,
          },
        },
      },
    },
        include: {
          requirement: true,
          scout: {
            select: {
              id: true,
          firstName: true,
          lastName: true,
          currentRank: true,
        },
      },
    },
    orderBy: [
      { scout: { lastName: "asc" } },
      { scout: { firstName: "asc" } },
      { requirement: { rank: "asc" } },
      { requirement: { sortOrder: "asc" } },
    ],
  });

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-900/90 p-8 shadow-xl shadow-slate-950/60">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Leader Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {leader.firstName} {leader.lastName}
          </h1>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3 sm:text-base">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Assigned Scouts</dt>
              <dd className="mt-1 text-slate-100">{leader.leaderLinks.length}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Pending Approvals</dt>
              <dd className="mt-1 text-slate-100">{pending.length}</dd>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Initials on file</dt>
              <dd className="mt-1 text-slate-100">
                {leader.initials ?? `${leader.firstName.at(0) ?? ""}${leader.lastName.at(0) ?? ""}`}
              </dd>
            </div>
          </dl>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Pending approvals</h2>
            <Link
              href="/"
              className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm uppercase tracking-[0.25em] text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/80"
            >
              View scout tracker
            </Link>
          </div>

          {pending.length === 0 ? (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center text-slate-100">
              <h3 className="text-xl font-semibold">All caught up! ✅</h3>
              <p className="mt-2 text-sm text-emerald-200">
                There are no outstanding rank requirements awaiting your approval right now.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {pending.map((progress) => (
                <div
                  key={`${progress.id}-${progress.updatedAt?.toISOString() ?? "new"}`}
                  className="flex flex-col gap-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {progress.scout.firstName} {progress.scout.lastName} ·{
                      " "
                    }
                    {rankLabels[progress.scout.currentRank ?? Rank.SCOUT]}
                  </p>
                  <LeaderApprovalRow
                    leaderId={leader.id}
                    progress={progress}
                    onApprove={approveRankProgress}
                    onRevoke={revokeRankProgress}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
