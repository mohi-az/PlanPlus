"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { TaskStatus } from "@/types/enums";
import type {
  AchievementDetails,
  CalculateAchievementsResult,
} from "@/types/domain";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export async function calculateAchievements(): Promise<CalculateAchievementsResult | void> {
  const session = await auth();
  if (!session?.user?.id) return;

  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, BadgeId: true },
    });
    if (!user) return;

    const streakStart = startOfDay(new Date(Date.now() - 30 * DAY_IN_MS));
    const [completedTasks, recentTasks, achievements, existingAwards, badges] =
      await Promise.all([
        transaction.tasks.findMany({
          where: {
            userId: user.id,
            status: TaskStatus.Done,
            completeAt: { not: null },
          },
          orderBy: { completeAt: "asc" },
        }),
        transaction.tasks.findMany({
          where: {
            userId: user.id,
            OR: [
              { createdAt: { gte: streakStart } },
              { completeAt: { gte: streakStart } },
            ],
          },
          select: { id: true, createdAt: true, completeAt: true },
        }),
        transaction.achievements.findMany(),
        transaction.userAchievements.findMany({ where: { userId: user.id } }),
        transaction.badges.findMany({ orderBy: { pointsRequired: "asc" } }),
      ]);

    const achievementByName = new Map(
      achievements.map((achievement) => [achievement.name, achievement]),
    );
    const awardCountByAchievement = new Map<string, number>();
    for (const award of existingAwards) {
      awardCountByAchievement.set(
        award.achievementId,
        (awardCountByAchievement.get(award.achievementId) ?? 0) + 1,
      );
    }

    let totalPoints = existingAwards.reduce(
      (total, award) =>
        total +
        (achievements.find((item) => item.id === award.achievementId)?.points ??
          0),
      0,
    );
    const newlyAwarded: AchievementDetails[] = [];

    const award = async (
      name: string,
      condition: boolean,
      repeatableTaskIds?: string[],
    ) => {
      const achievement = achievementByName.get(name);
      if (!achievement || !condition) return;

      const existingCount = awardCountByAchievement.get(achievement.id) ?? 0;
      const awardKeys = achievement.isRepeatable
        ? (repeatableTaskIds ?? [])
            .slice(existingCount)
            .map((taskId) => `${user.id}:${achievement.id}:${taskId}`)
        : existingCount === 0
          ? [`${user.id}:${achievement.id}`]
          : [];
      if (awardKeys.length === 0) return;

      const result = await transaction.userAchievements.createMany({
        data: awardKeys.map((awardKey) => ({
          userId: user.id,
          achievementId: achievement.id,
          awardKey,
          completeAt: new Date(),
        })),
        skipDuplicates: true,
      });
      if (result.count === 0) return;

      awardCountByAchievement.set(achievement.id, existingCount + result.count);
      totalPoints += achievement.points * result.count;
      newlyAwarded.push(achievement);

      if (existingCount === 0) {
        await transaction.notifications.create({
          data: {
            userId: user.id,
            title: "Achievement unlocked!",
            description: `Congratulations! You unlocked '${achievement.name}' and earned ${achievement.points} points.`,
            type: "achievement",
          },
        });
      }
    };

    const completedTaskIds = completedTasks.map((task) => task.id);
    await award(
      "Daily Finisher",
      completedTaskIds.length > 0,
      completedTaskIds,
    );
    await award("Task Starter", completedTasks.length >= 1);
    await award("Five Tasks", completedTasks.length >= 5);
    await award("Consistent Contributor", completedTasks.length >= 50);
    await award("Task Master", completedTasks.length >= 100);
    await award(
      "Daily Dedication",
      hasConsecutiveActivity(recentTasks, 7, "createdAt"),
    );
    await award(
      "Streak Keeper",
      hasConsecutiveActivity(recentTasks, 10, "completeAt"),
    );
    await award(
      "Perfect Streak",
      hasConsecutiveActivity(recentTasks, 30, "completeAt"),
    );
    await award("Weekend Warrior", completedOnPreviousWeekend(completedTasks));
    await award(
      "Weekend Finisher",
      completedTasks.filter(
        (task) => task.completeAt && isWeekend(task.completeAt),
      ).length >= 10,
    );
    await award(
      "Goal Setter",
      completedTasks.filter((task) => task.dueDate).length >= 10,
    );
    await award(
      "Night Owl",
      completedTasks.filter(
        (task) => task.completeAt && isWithinTimeRange(task.completeAt, 20, 23),
      ).length >= 5,
    );
    await award(
      "Early Bird",
      completedTasks.filter(
        (task) => task.completeAt && isWithinTimeRange(task.completeAt, 5, 8),
      ).length >= 5,
    );
    await award(
      "Quick Finisher",
      completedTasks.some((task) => {
        if (!task.completeAt) return false;
        const durationHours =
          (task.completeAt.getTime() - task.createdAt.getTime()) / 3_600_000;
        return durationHours >= 0 && durationHours <= 1;
      }),
    );
    await award(
      "Long-Term Planner",
      completedTasks.some(
        (task) =>
          task.completeAt !== null &&
          (task.completeAt.getTime() - task.createdAt.getTime()) / DAY_IN_MS >=
            30,
      ),
    );
    await award(
      "Deadline Crusher",
      completedTasks.filter(
        (task) =>
          task.completeAt && task.dueDate && task.completeAt <= task.dueDate,
      ).length >= 20,
    );
    await award("Productivity Guru", totalPoints >= 500);
    await award("Milestone Maker", totalPoints >= 1000);

    const newBadge =
      badges.findLast((badge) => totalPoints >= badge.pointsRequired) ?? null;
    let earnedBadge = null;
    if (newBadge && newBadge.id !== user.BadgeId) {
      await transaction.user.update({
        where: { id: user.id },
        data: { BadgeId: newBadge.id },
      });
      await transaction.notifications.create({
        data: {
          userId: user.id,
          title: `Badge earned: ${newBadge.badgeTitle}`,
          description: `You earned the '${newBadge.badgeTitle}' badge after reaching ${newBadge.pointsRequired} points.`,
          type: "badge",
        },
      });
      earnedBadge = newBadge;
    }

    return { achievements: newlyAwarded, badge: earnedBadge };
  });
}

function hasConsecutiveActivity(
  tasks: Array<{ createdAt: Date; completeAt: Date | null }>,
  days: number,
  field: "createdAt" | "completeAt",
): boolean {
  const activeDays = new Set(
    tasks.flatMap((task) => {
      const date = task[field];
      return date ? [dateKey(date)] : [];
    }),
  );

  const today = startOfDay(new Date());
  for (let offset = 0; offset < days; offset += 1) {
    if (
      !activeDays.has(dateKey(new Date(today.getTime() - offset * DAY_IN_MS)))
    )
      return false;
  }
  return true;
}

function completedOnPreviousWeekend(
  tasks: Array<{ completeAt: Date | null }>,
): boolean {
  const { saturday, monday } = previousWeekendRange(new Date());
  let completedOnSaturday = false;
  let completedOnSunday = false;

  for (const task of tasks) {
    if (
      !task.completeAt ||
      task.completeAt < saturday ||
      task.completeAt >= monday
    )
      continue;
    if (task.completeAt.getDay() === 6) completedOnSaturday = true;
    if (task.completeAt.getDay() === 0) completedOnSunday = true;
  }
  return completedOnSaturday && completedOnSunday;
}

function previousWeekendRange(today: Date) {
  const saturday = startOfDay(today);
  saturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));
  const monday = new Date(saturday);
  monday.setDate(saturday.getDate() + 2);
  return { saturday, monday };
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isWithinTimeRange(
  date: Date,
  startHour: number,
  endHour: number,
): boolean {
  const hour = date.getHours();
  return hour >= startHour && hour < endHour;
}

function isWeekend(date: Date): boolean {
  return date.getDay() === 6 || date.getDay() === 0;
}
