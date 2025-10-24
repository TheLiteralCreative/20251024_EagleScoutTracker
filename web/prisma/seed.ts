import "dotenv/config";
import { PrismaClient, Rank } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Seeding database with sample scout data...");

  await prisma.rankProgress.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.scout.deleteMany();

  const requirementData = [
    {
      code: "TF-1a",
      title: "Camp overnight with your patrol or troop.",
      description:
        "Attend a patrol or troop campout. Sleep overnight in a tent you helped pitch.",
      rank: Rank.TENDERFOOT,
      sortOrder: 10,
    },
    {
      code: "TF-2a",
      title: "Show how to whip and fuse the ends of a rope.",
      description:
        "Demonstrate how to whip and fuse the ends of a rope to keep it from unraveling.",
      rank: Rank.TENDERFOOT,
      sortOrder: 20,
    },
    {
      code: "TF-3a",
      title: "Demonstrate a practical use of two half-hitches.",
      description:
        "Tie two half-hitches and describe a situation where you would use the knot.",
      rank: Rank.TENDERFOOT,
      sortOrder: 30,
    },
    {
      code: "SC-1a",
      title: "Demonstrate how a compass works and orient a map.",
      description:
        "Explain how a magnetic compass works and show how to orient a map.",
      rank: Rank.SECOND_CLASS,
      sortOrder: 10,
    },
    {
      code: "FC-1a",
      title: "Discuss the principles of Leave No Trace.",
      description:
        "Explain the principles of Leave No Trace and why they are important.",
      rank: Rank.FIRST_CLASS,
      sortOrder: 10,
    },
  ];

  const scout = await prisma.scout.create({
    data: {
      firstName: "Alex",
      lastName: "Trailblazer",
      email: "alex.trailblazer@example.com",
      currentRank: Rank.SECOND_CLASS,
    },
  });

  const requirements = await Promise.all(
    requirementData.map((req, index) =>
      prisma.requirement.upsert({
        where: { code: req.code },
        update: {
          title: req.title,
          description: req.description,
          rank: req.rank,
          sortOrder: req.sortOrder,
        },
        create: {
          code: req.code,
          title: req.title,
          description: req.description,
          rank: req.rank,
          sortOrder: req.sortOrder,
        },
      })
    )
  );

  const progressData = [
    {
      code: "TF-1a",
      startedAt: new Date("2024-01-15"),
      eligibleAt: new Date("2024-02-14"),
      completedAt: new Date("2024-02-20"),
      approved: true,
      approvedInitials: "MB",
      notes: "Completed during winter campout.",
    },
    {
      code: "TF-2a",
      startedAt: new Date("2024-02-10"),
      eligibleAt: new Date("2024-02-24"),
      completedAt: new Date("2024-02-25"),
      approved: true,
      approvedInitials: "RM",
      notes: "Demonstrated at troop meeting.",
    },
    {
      code: "TF-3a",
      startedAt: new Date("2024-03-05"),
      eligibleAt: new Date("2024-03-19"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: "Needs to re-demo knot tying.",
    },
    {
      code: "SC-1a",
      startedAt: new Date("2024-04-01"),
      eligibleAt: new Date("2024-05-01"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "FC-1a",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
  ];

  for (const progress of progressData) {
    const requirement = requirements.find((req) => req.code === progress.code);

    if (!requirement) {
      continue;
    }

    await prisma.rankProgress.upsert({
      where: {
        scoutId_requirementId: {
          scoutId: scout.id,
          requirementId: requirement.id,
        },
      },
      update: {
        startedAt: progress.startedAt,
        eligibleAt: progress.eligibleAt,
        completedAt: progress.completedAt,
        approved: progress.approved,
        approvedInitials: progress.approvedInitials ?? undefined,
        notes: progress.notes ?? undefined,
      },
      create: {
        scoutId: scout.id,
        requirementId: requirement.id,
        startedAt: progress.startedAt,
        eligibleAt: progress.eligibleAt,
        completedAt: progress.completedAt,
        approved: progress.approved,
        approvedInitials: progress.approvedInitials ?? undefined,
        notes: progress.notes ?? undefined,
      },
    });
  }

  console.info("✅ Seed complete! Scout and requirements ready for exploration.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
