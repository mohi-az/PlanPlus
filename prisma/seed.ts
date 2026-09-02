import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const badges = [
  ["Initiate", 0, "Initiate.json"],
  ["Rookie", 100, "Rookie.json"],
  ["Contributor", 200, "Contributor.json"],
  ["Go Getter", 300, "GoGetter.json"],
  ["Striver", 400, "Striver.json"],
  ["Pro", 500, "Pro.json"],
  ["Veteran", 650, "Veteran.json"],
  ["Champion", 800, "Champion.json"],
  ["Maven", 1_000, "Maven.json"],
  ["Virtuoso", 1_250, "Virtuoso.json"],
] as const;

const achievements = [
  ["Daily Finisher", "Complete a task.", 5, true],
  ["Task Starter", "Complete your first task.", 10, false],
  ["Five Tasks", "Complete five tasks.", 20, false],
  ["Daily Dedication", "Create a task on seven consecutive days.", 40, false],
  ["Weekend Warrior", "Complete tasks on both days of a weekend.", 30, false],
  ["Consistent Contributor", "Complete fifty tasks.", 100, false],
  ["Task Master", "Complete one hundred tasks.", 200, false],
  ["Streak Keeper", "Complete a task on ten consecutive days.", 80, false],
  ["Goal Setter", "Complete ten tasks with due dates.", 40, false],
  ["Night Owl", "Complete five tasks between 8 PM and 11 PM.", 30, false],
  ["Productivity Guru", "Earn five hundred achievement points.", 100, false],
  ["Early Bird", "Complete five tasks between 5 AM and 8 AM.", 30, false],
  [
    "Quick Finisher",
    "Complete a task within one hour of creating it.",
    20,
    false,
  ],
  ["Perfect Streak", "Complete a task on thirty consecutive days.", 250, false],
  ["Weekend Finisher", "Complete ten tasks on weekends.", 60, false],
  [
    "Long-Term Planner",
    "Complete a task at least thirty days after creating it.",
    50,
    false,
  ],
  [
    "Deadline Crusher",
    "Complete twenty tasks before their deadlines.",
    100,
    false,
  ],
  ["Milestone Maker", "Earn one thousand achievement points.", 200, false],
] as const;

async function main() {
  for (const [badgeTitle, pointsRequired, badgeIconURL] of badges) {
    await prisma.badges.upsert({
      where: { badgeTitle },
      update: { pointsRequired, badgeIconURL },
      create: { badgeTitle, pointsRequired, badgeIconURL },
    });
  }

  for (const [name, description, points, isRepeatable] of achievements) {
    await prisma.achievements.upsert({
      where: { name },
      update: { description, points, isRepeatable, badgeImageUrl: "" },
      create: { name, description, points, isRepeatable, badgeImageUrl: "" },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
