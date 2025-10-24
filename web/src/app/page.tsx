import { Rank } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

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

const formatDate = (date?: Date | null) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

export default async function Home() {
  const scout = await prisma.scout.findFirst({
    include: {
      progress: {
        include: { requirement: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const requirements = await prisma.requirement.findMany({
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

        <section className="flex flex-col gap-6">
          {rankOrder.map((rank) => {
            const rankRequirements = requirements.filter(
              (requirement) => requirement.rank === rank
            );

            if (rankRequirements.length === 0) {
              return null;
            }

            const rankInfo = rankMetadata[rank];

            return (
              <article
                key={rank}
                className={`rounded-3xl border border-slate-800 bg-gradient-to-br p-6 shadow-lg shadow-slate-950/40 ${rankInfo?.color ?? "from-slate-900 via-slate-900/60 to-slate-900"}`}
              >
                <header className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {rankInfo?.title ?? rank}
                  </h2>
                  <span className="rounded-full border border-slate-700/60 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                    {rankRequirements.length} requirements
                  </span>
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
                      {rankRequirements.map((requirement) => {
                        const progress = progressByRequirement.get(requirement.id);
                        return (
                          <tr key={requirement.id} className="align-top text-slate-200">
                            <td className="py-4 pr-4 font-semibold text-slate-100 sm:text-base">
                              {requirement.code}
                            </td>
                            <td className="py-4 pr-4 text-slate-300">
                              <div className="font-medium text-slate-100">{requirement.title}</div>
                              {requirement.description && (
                                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                  {requirement.description}
                                </p>
                              )}
                            </td>
                            <td className="py-4 pr-4 text-slate-300">
                              {formatDate(progress?.startedAt ?? null)}
                            </td>
                            <td className="py-4 pr-4 text-slate-300">
                              {formatDate(progress?.eligibleAt ?? null)}
                            </td>
                            <td className="py-4 pr-4 text-slate-300">
                              {formatDate(progress?.completedAt ?? null)}
                            </td>
                            <td className="py-4 pr-4 text-slate-300">
                              {progress?.approved ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                                  {progress.approvedInitials ?? "OK"}
                                </div>
                              ) : (
                                <span className="rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-slate-300">
                              {progress?.notes ? (
                                <p>{progress.notes}</p>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
