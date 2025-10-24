import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { LinkStatus, Rank, Role } from "../src/generated/prisma/enums";

const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Seeding database with sample scout data...");

  await prisma.auditLog.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.boardOfReview.deleteMany();
  await prisma.meritBadgeRequirementStatus.deleteMany();
  await prisma.meritBadgeProgress.deleteMany();
  await prisma.leaderScoutLink.deleteMany();
  await prisma.rankProgress.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.meritBadgeRequirement.deleteMany();
  await prisma.meritBadge.deleteMany();
  await prisma.scout.deleteMany();
  await prisma.user.deleteMany();

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
      durationDays: 14,
    },
    {
      code: "TF-3a",
      title: "Demonstrate a practical use of two half-hitches.",
      description:
        "Tie two half-hitches and describe a situation where you would use the knot.",
      rank: Rank.TENDERFOOT,
      sortOrder: 30,
      durationDays: 14,
    },
    {
      code: "SC-1a",
      title: "Demonstrate how a compass works and orient a map.",
      description:
        "Explain how a magnetic compass works and show how to orient a map.",
      rank: Rank.SECOND_CLASS,
      sortOrder: 10,
      durationDays: 30,
    },
    {
      code: "FC-1a",
      title: "Discuss the principles of Leave No Trace.",
      description:
        "Explain the principles of Leave No Trace and why they are important.",
      rank: Rank.FIRST_CLASS,
      sortOrder: 10,
      durationDays: 30,
    },
  ];

  const [adminUser, leaderUser, scoutUser] = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: "admin@example.com",
        firstName: "Avery",
        lastName: "Admin",
        role: Role.ADMIN,
        phone: "555-0100",
      },
    }),
    prisma.user.create({
      data: {
        email: "leader@example.com",
        firstName: "Logan",
        lastName: "Leader",
        role: Role.LEADER,
        phone: "555-0101",
        initials: "LL",
      },
    }),
    prisma.user.create({
      data: {
        email: "scout@example.com",
        firstName: "Alex",
        lastName: "Trailblazer",
        role: Role.SCOUT,
        phone: "555-0102",
      },
    }),
  ]);

  const scout = await prisma.scout.create({
    data: {
      firstName: "Alex",
      lastName: "Trailblazer",
      email: "alex.trailblazer@example.com",
      phone: "555-0102",
      currentRank: Rank.SECOND_CLASS,
      unit: "Troop 123",
      council: "Grand Valley Council",
      dateOfBirth: new Date("2011-06-15"),
      user: {
        connect: { id: scoutUser.id },
      },
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
          durationDays: req.durationDays ?? null,
          durationMonths: req.durationMonths ?? null,
        },
        create: {
          code: req.code,
          title: req.title,
          description: req.description,
          rank: req.rank,
          sortOrder: req.sortOrder,
          durationDays: req.durationDays ?? null,
          durationMonths: req.durationMonths ?? null,
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
      approvedById: leaderUser.id,
      approvedAt: new Date("2024-02-22"),
    },
    {
      code: "TF-2a",
      startedAt: new Date("2024-02-10"),
      eligibleAt: new Date("2024-02-24"),
      completedAt: new Date("2024-02-25"),
      approved: true,
      approvedInitials: "RM",
      notes: "Demonstrated at troop meeting.",
      approvedById: leaderUser.id,
      approvedAt: new Date("2024-02-28"),
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
        approvedById: progress.approvedById ?? undefined,
        approvedAt: progress.approvedAt ?? undefined,
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
        approvedById: progress.approvedById ?? undefined,
        approvedAt: progress.approvedAt ?? undefined,
        approvedInitials: progress.approvedInitials ?? undefined,
        notes: progress.notes ?? undefined,
      },
    });
  }

  const meritBadge = await prisma.meritBadge.create({
    data: {
      name: "Camping",
      description: "Develop outdoor skills through planning and executing camping trips.",
      isEagleRequired: true,
      requirements: {
        create: [
          {
            code: "1",
            description: "Explain the importance of using the Outdoor Code and Leave No Trace principles.",
            sortOrder: 10,
          },
          {
            code: "2",
            description: "Learn the rules of safe trekking and demonstrate proper equipment selection.",
            sortOrder: 20,
          },
        ],
      },
    },
    include: { requirements: true },
  });

  await prisma.meritBadgeProgress.create({
    data: {
      scoutId: scout.id,
      meritBadgeId: meritBadge.id,
      dateStarted: new Date("2024-01-01"),
      counselorName: "Jordan Rivers",
      notes: "Working through requirements 1 and 2 with patrol.",
      requirements: {
        create: [
          {
            requirementId: meritBadge.requirements[0].id,
            completedAt: new Date("2024-02-18"),
            notes: "Discussed during troop meeting.",
          },
        ],
      },
    },
  });

  await prisma.leaderScoutLink.create({
    data: {
      leaderId: leaderUser.id,
      scoutId: scout.id,
      status: LinkStatus.APPROVED,
      approvedById: adminUser.id,
      approvedAt: new Date("2024-01-10"),
    },
  });

  await prisma.boardOfReview.create({
    data: {
      scoutId: scout.id,
      rank: Rank.TENDERFOOT,
      previousRankBorActual: new Date("2023-10-12"),
      thisRankBorActual: new Date("2024-03-05"),
      thisRankBorProjected: new Date("2024-02-28"),
    },
  });

  await prisma.setting.create({
    data: {
      key: "bor.projected.bufferDays",
      value: "14",
      description: "Number of days to add to eligibility when projecting BOR dates.",
      updatedById: adminUser.id,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: leaderUser.id,
        action: "RANK_PROGRESS_APPROVED",
        entity: "RankProgress",
        entityId: `${scout.id}:${requirements[0].id}`,
        metadata: {
          notes: "Approved after verifying completion during winter campout.",
        },
      },
      {
        actorId: adminUser.id,
        action: "LEADER_LINK_APPROVED",
        entity: "LeaderScoutLink",
        entityId: `${leaderUser.id}:${scout.id}`,
        metadata: {
          method: "manual-admin-action",
        },
      },
    ],
  });

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
