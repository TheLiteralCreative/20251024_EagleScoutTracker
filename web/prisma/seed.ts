import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { LinkStatus, Rank, Role } from "../src/generated/prisma/enums";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Seeding database with sample scout data...");

  await prisma.auditLog.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.boardOfReview.deleteMany();
  await prisma.meritBadgeRequirementStatus.deleteMany();
  await prisma.meritBadgeProgress.deleteMany();
  await prisma.leaderScoutLink.deleteMany();
  await prisma.rankProgressNote.deleteMany();
  await prisma.requirementSubtaskProgress.deleteMany();
  await prisma.rankProgress.deleteMany();
  await prisma.requirementSubtask.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.meritBadgeRequirement.deleteMany();
  await prisma.meritBadge.deleteMany();
  await prisma.scout.deleteMany();
  await prisma.user.deleteMany();

  const requirementData = [
    {
      code: "TF-1a",
      title: "Gear & packing check",
      summary: "Present yourself and your gear ready for an overnight campout.",
      detail:
        "Show a leader that you are prepared for an overnight campout by laying out your personal clothing, gear, and patrol equipment. Demonstrate how you pack and carry it so that you can hike in and set up quickly.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 10,
    },
    {
      code: "TF-1b",
      title: "Overnight campout",
      summary: "Spend one night on a patrol or troop campout in a tent you helped pitch.",
      detail:
        "Participate in a patrol or troop campout for at least one night. Work with your patrol to pitch the tent you will sleep in and stay overnight as part of the outing roster.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 11,
    },
    {
      code: "TF-1c",
      title: "Outdoor Code reflection",
      summary: "Explain how you lived the Outdoor Code and Leave No Trace on outings.",
      detail:
        "After your outings, explain specific examples of how you practiced the Outdoor Code and Leave No Trace. Share at least one action related to care for the outdoors, wildlife, or other campers.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 12,
    },
    {
      code: "TF-2a",
      title: "Assist with meal prep",
      summary: "Help cook one meal on a campout and explain why sharing duties matters.",
      detail:
        "On a patrol or troop campout assist in preparing one meal. Afterward, discuss with your patrol or leader why sharing meal preparation and cleanup is important to the patrol method and food safety.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 20,
    },
    {
      code: "TF-2b",
      title: "Camp dishwashing",
      summary: "Demonstrate the safe method for cleaning cookware and utensils.",
      detail:
        "While on a campout, demonstrate the correct method for cleaning cookware and utensils according to your unit's food-safety plan (for example, the three-tub method with wash, rinse, and sanitize).",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 21,
    },
    {
      code: "TF-2c",
      title: "Patrol meal importance",
      summary: "Explain why patrols prepare and eat meals together.",
      detail:
        "Explain to your patrol leader or a troop guide why Scouts cook and eat together as a patrol, touching on teamwork, logistics, and the Patrol Method.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 22,
    },
    {
      code: "TF-3a",
      title: "Square knot use",
      summary: "Demonstrate a practical use of the square knot.",
      detail:
        "Tie a square knot and explain a situation on the trail or around camp where it is the right knot to use (for example, joining two ropes of equal diameter).",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 30,
    },
    {
      code: "TF-3b",
      title: "Two half-hitches",
      summary: "Show how to tie and use two half-hitches.",
      detail:
        "Demonstrate tying two half-hitches around a post or tree and describe how the knot secures guy lines or lashings that need to hold under tension.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 31,
    },
    {
      code: "TF-3c",
      title: "Taut-line hitch",
      summary: "Demonstrate tying a taut-line hitch and explain when to use it.",
      detail:
        "Tie the taut-line hitch and show how it adjusts tension on a tent guy line. Explain other situations where an adjustable loop is needed.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 32,
    },
    {
      code: "TF-3d",
      title: "Woods tools care",
      summary: "Demonstrate the care, sharpening, and safe use of the knife, saw, and ax.",
      detail:
        "Show proper carrying, passing, and safety circles for the pocketknife, saw, and ax. Demonstrate sharpening on at least one tool and explain when each tool should be used on outings.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 33,
    },
    {
      code: "TF-4a",
      title: "First-aid skills",
      summary: "Show first aid for common minor injuries and conditions.",
      detail:
        "Demonstrate first-aid steps for simple cuts and scrapes, blisters on the hand and foot, minor burns or scalds, insect or tick bites and stings, venomous snakebite, nosebleed, frostbite, sunburn, and choking.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 40,
    },
    {
      code: "TF-4b",
      title: "Hazardous plants",
      summary: "Describe poisonous plants and how to treat exposure.",
      detail:
        "Identify common poisonous or hazardous plants in your area and explain the treatment for exposure, including preventive actions you can take while camping or hiking.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 41,
    },
    {
      code: "TF-4c",
      title: "Prevention strategies",
      summary: "Explain how to prevent the injuries and illnesses covered in 4a and 4b.",
      detail:
        "Discuss simple steps you can take on hikes and campouts to reduce the chance of the injuries and hazards covered in Tenderfoot requirement 4a and 4b, such as proper clothing, hydration, and trail discipline.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 42,
    },
    {
      code: "TF-4d",
      title: "Personal first-aid kit",
      summary: "Assemble a personal first-aid kit and explain how each item is used.",
      detail:
        "Build a personal first-aid kit appropriate for hiking and camping. Present each item and explain when and how it should be used.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 43,
    },
    {
      code: "TF-6a",
      title: "Fitness baseline",
      summary: "Record baseline measurements for fitness activities.",
      detail:
        "Record your current performance for pushups and situps in 60 seconds, the back-saver sit-and-reach, and a one-mile walk/run. Capture your results in your log.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 50,
    },
    {
      code: "TF-6b",
      title: "30-day fitness plan",
      summary: "Develop and follow a 30-day plan for improvement.",
      detail:
        "Create a plan to improve each baseline fitness activity. Follow the plan for at least 30 days, recording your practice sessions or workouts as you go.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 51,
      durationDays: 30,
      dependencyText: "Requires 30 days of logged activity before completion.",
    },
    {
      code: "TF-6c",
      title: "Show improvement",
      summary: "After 30 days, retest and show improvement in each activity.",
      detail:
        "After completing your plan, repeat the pushup, situp, sit-and-reach, and one-mile tests. Record the new results and show improvement in each activity.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Tenderfoot-Rank-Requirements.pdf",
      rank: Rank.TENDERFOOT,
      sortOrder: 52,
      durationDays: 30,
      dependencyText: "Complete and document the 30-day plan in 6b before retesting.",
    },
    {
      code: "SC-1a",
      title: "Compass & map",
      summary: "Demonstrate how a compass works and orient a map to the terrain.",
      detail:
        "Explain true north versus magnetic north, show parts of a compass, and orient a topographic map to your surroundings using the compass and visible features.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-Second-Class-Rank-Requirements.pdf",
      rank: Rank.SECOND_CLASS,
      sortOrder: 10,
    },
    {
      code: "FC-1a",
      title: "Leave No Trace discussion",
      summary: "Discuss the principles of Leave No Trace and why they matter.",
      detail:
        "Have a conversation with your patrol or troop guide about each Leave No Trace principle. Provide examples of how you have applied or plan to apply them.",
      resourceUrl: "https://www.scouting.org/wp-content/uploads/2024/01/2024-First-Class-Rank-Requirements.pdf",
      rank: Rank.FIRST_CLASS,
      sortOrder: 10,
    },
  ];

  const adminPassword = hashPassword("Admin!123");
  const leaderPassword = hashPassword("Leader!123");
  const scoutPassword = hashPassword("Scout!123");

  const [adminUser, leaderUser, scoutUser] = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: "admin@example.com",
        firstName: "Avery",
        lastName: "Admin",
        role: Role.ADMIN,
        phone: "555-0100",
        passwordHash: adminPassword,
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
        passwordHash: leaderPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: "scout@example.com",
        firstName: "Alex",
        lastName: "Trailblazer",
        role: Role.SCOUT,
        phone: "555-0102",
        passwordHash: scoutPassword,
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
    requirementData.map((req) =>
      prisma.requirement.upsert({
        where: { code: req.code },
        update: {
          title: req.title,
          description: req.summary ?? null,
          summary: req.summary ?? null,
          detail: req.detail ?? null,
          rank: req.rank,
          sortOrder: req.sortOrder,
          durationDays: req.durationDays ?? null,
          durationMonths: req.durationMonths ?? null,
          resourceUrl: req.resourceUrl ?? null,
          dependencyText: req.dependencyText ?? null,
        },
        create: {
          code: req.code,
          title: req.title,
          description: req.summary ?? null,
          summary: req.summary ?? null,
          detail: req.detail ?? null,
          rank: req.rank,
          sortOrder: req.sortOrder,
          durationDays: req.durationDays ?? null,
          durationMonths: req.durationMonths ?? null,
          resourceUrl: req.resourceUrl ?? null,
          dependencyText: req.dependencyText ?? null,
        },
      })
    )
  );

  const requirementMap = new Map(requirements.map((req) => [req.code, req]));

  const requirementSubtasks = [
    {
      requirementCode: "TF-6b",
      code: "TF-6b-log",
      title: "Log each activity session",
      detail: "Capture dates, activities, and effort for all 30 days in your fitness plan.",
      sortOrder: 10,
    },
    {
      requirementCode: "TF-6b",
      code: "TF-6b-review",
      title: "Review plan with a leader",
      detail: "Review your completed 30-day log with a leader or parent partner and capture feedback.",
      sortOrder: 20,
    },
  ];

  const subtasks = await Promise.all(
    requirementSubtasks
      .map((seed) => {
        const requirement = requirementMap.get(seed.requirementCode);
        if (!requirement) {
          return null;
        }

        return prisma.requirementSubtask.upsert({
          where: {
            requirementId_code: {
              requirementId: requirement.id,
              code: seed.code,
            },
          },
          update: {
            title: seed.title,
            detail: seed.detail,
            sortOrder: seed.sortOrder,
          },
          create: {
            requirementId: requirement.id,
            code: seed.code,
            title: seed.title,
            detail: seed.detail,
            sortOrder: seed.sortOrder,
          },
        });
      })
      .filter(Boolean) as Array<ReturnType<typeof prisma.requirementSubtask.upsert>>
  );

  const progressData = [
    {
      code: "TF-1a",
      startedAt: new Date("2024-01-10"),
      eligibleAt: new Date("2024-01-10"),
      completedAt: new Date("2024-01-12"),
      approved: true,
      approvedInitials: "LL",
      notes: "Gear inspection completed before the polar bear campout.",
      approvedById: leaderUser.id,
      approvedAt: new Date("2024-01-13"),
    },
    {
      code: "TF-1b",
      startedAt: new Date("2024-01-13"),
      eligibleAt: new Date("2024-01-13"),
      completedAt: new Date("2024-01-14"),
      approved: true,
      approvedInitials: "LL",
      notes: "Winter cabin overnight with Troop 123.",
      approvedById: leaderUser.id,
      approvedAt: new Date("2024-01-16"),
    },
    {
      code: "TF-1c",
      startedAt: new Date("2024-01-20"),
      eligibleAt: new Date("2024-01-20"),
      completedAt: new Date("2024-01-20"),
      approved: false,
      approvedInitials: null,
      notes: "Shared Leave No Trace examples from the January hike.",
    },
    {
      code: "TF-2a",
      startedAt: new Date("2024-02-10"),
      eligibleAt: new Date("2024-02-10"),
      completedAt: new Date("2024-02-25"),
      approved: true,
      approvedInitials: "RM",
      notes: "Helped patrol cook foil dinners and wash dishes.",
      approvedById: leaderUser.id,
      approvedAt: new Date("2024-02-28"),
    },
    {
      code: "TF-2b",
      startedAt: new Date("2024-02-24"),
      eligibleAt: new Date("2024-02-24"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: "Needs refresher on sanitation rinse sequence.",
      approvalRequestedAt: new Date("2024-03-01"),
      approvalRequestedById: scoutUser.id,
      approvalRequestedLeaderId: leaderUser.id,
    },
    {
      code: "TF-2c",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "TF-3a",
      startedAt: new Date("2024-03-05"),
      eligibleAt: new Date("2024-03-05"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: "Needs to re-demo knot tying.",
      approvalRequestedAt: new Date("2024-03-20"),
      approvalRequestedById: scoutUser.id,
      approvalRequestedLeaderId: leaderUser.id,
    },
    {
      code: "TF-3b",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "TF-3c",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "TF-3d",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "TF-4a",
      startedAt: new Date("2024-03-15"),
      eligibleAt: new Date("2024-03-15"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: "Practiced choking and blister care; need to review venomous bites.",
    },
    {
      code: "TF-4b",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "TF-4c",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "TF-4d",
      startedAt: new Date("2024-03-18"),
      eligibleAt: new Date("2024-03-18"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: "Kit assembled; waiting on leader review.",
    },
    {
      code: "TF-6a",
      startedAt: new Date("2024-04-01"),
      eligibleAt: new Date("2024-04-01"),
      completedAt: new Date("2024-04-01"),
      approved: true,
      approvedInitials: "LL",
      notes: "Logged baseline numbers in fitness tracker.",
      approvedById: leaderUser.id,
      approvedAt: new Date("2024-04-02"),
    },
    {
      code: "TF-6b",
      startedAt: new Date("2024-04-02"),
      eligibleAt: new Date("2024-05-02"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: "Following 30-day fitness plan; log updated weekly.",
      approvalRequestedAt: null,
      approvalRequestedById: null,
      approvalRequestedLeaderId: null,
    },
    {
      code: "TF-6c",
      startedAt: null,
      eligibleAt: null,
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: null,
    },
    {
      code: "SC-1a",
      startedAt: new Date("2024-05-10"),
      eligibleAt: new Date("2024-05-25"),
      completedAt: null,
      approved: false,
      approvedInitials: null,
      notes: "Practiced map orientation on troop hike; needs second attempt.",
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

  const progressRecords: Record<string, string> = {};

  for (const progress of progressData) {
    const requirement = requirements.find((req) => req.code === progress.code);

    if (!requirement) {
      continue;
    }

    const record = await prisma.rankProgress.upsert({
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
        approvalRequestedAt: progress.approvalRequestedAt ?? null,
        approvalRequestedById: progress.approvalRequestedById ?? null,
        approvalRequestedLeaderId: progress.approvalRequestedLeaderId ?? null,
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
        approvalRequestedAt: progress.approvalRequestedAt ?? null,
        approvalRequestedById: progress.approvalRequestedById ?? null,
        approvalRequestedLeaderId: progress.approvalRequestedLeaderId ?? null,
      },
    });

    progressRecords[progress.code] = record.id;
  }

  const tf6bProgressId = progressRecords["TF-6b"];
  if (tf6bProgressId) {
    const logSubtask = subtasks.find((task) => task?.code === "TF-6b-log");
    if (logSubtask) {
      await prisma.requirementSubtaskProgress.upsert({
        where: {
          rankProgressId_subtaskId: {
            rankProgressId: tf6bProgressId,
            subtaskId: logSubtask.id,
          },
        },
        update: {
          completedAt: new Date("2024-04-30"),
          notes: "Logged activities for 28 of 30 days; final two in progress.",
        },
        create: {
          rankProgressId: tf6bProgressId,
          subtaskId: logSubtask.id,
          completedAt: new Date("2024-04-30"),
          notes: "Logged activities for 28 of 30 days; final two in progress.",
        },
      });
    }
  }

  if (progressRecords["TF-3a"]) {
    await prisma.rankProgressNote.create({
      data: {
        rankProgressId: progressRecords["TF-3a"],
        authorId: leaderUser.id,
        body: "Revisit square knot and practice under time before next meeting.",
      },
    });
  }

  if (progressRecords["TF-6b"]) {
    await prisma.rankProgressNote.create({
      data: {
        rankProgressId: progressRecords["TF-6b"],
        authorId: scoutUser.id,
        body: "Completed week 3 cardio workouts; need to add stretching log.",
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
