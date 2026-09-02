"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type { ActionResult, UserAchievement } from "@/types/domain";
import type { Badges, Logs, Notifications } from "@prisma/client";

const genericError = "Something went wrong. Please try again.";

export const addLog = async ({
  detail,
  type,
  url,
}: {
  detail: string;
  type: string;
  url: string;
}): Promise<ActionResult<Logs>> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };
    if (
      !detail.trim() ||
      detail.length > 5000 ||
      type.length > 100 ||
      url.length > 2000
    ) {
      return { status: "error", error: "Invalid log entry." };
    }

    const log = await prisma.logs.create({
      data: { detail: detail.trim(), type: type.trim(), url: url.trim() },
    });
    return { status: "success", data: log };
  } catch (error) {
    console.error("Failed to create log entry:", error);
    return { status: "error", error: genericError };
  }
};

export const getBadge = async (id: number): Promise<ActionResult<Badges>> => {
  try {
    const badge = await prisma.badges.findUnique({ where: { id } });
    return badge
      ? { status: "success", data: badge }
      : { status: "error", error: "Badge not found." };
  } catch (error) {
    console.error("Failed to fetch badge:", error);
    return { status: "error", error: genericError };
  }
};

export const getAllBadges = async (): Promise<ActionResult<Badges[]>> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };

    const badges = await prisma.badges.findMany({
      orderBy: { pointsRequired: "asc" },
    });
    return { status: "success", data: badges };
  } catch (error) {
    console.error("Failed to fetch badges:", error);
    return { status: "error", error: genericError };
  }
};

export const getUserBadge = async (): Promise<ActionResult<Badges>> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { BadgeId: true },
    });
    if (!user) return { status: "error", error: "User not found." };

    const badge = await prisma.badges.findUnique({
      where: { id: user.BadgeId },
    });
    return badge
      ? { status: "success", data: badge }
      : { status: "error", error: "Badge not found." };
  } catch (error) {
    console.error("Failed to fetch user badge:", error);
    return { status: "error", error: genericError };
  }
};

export const getUserAchievements = async (): Promise<
  ActionResult<UserAchievement[]>
> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };

    const [achievements, completed] = await Promise.all([
      prisma.achievements.findMany({ orderBy: { points: "asc" } }),
      prisma.userAchievements.findMany({
        where: { userId: session.user.id },
        orderBy: { completeAt: "asc" },
        select: { id: true, achievementId: true, completeAt: true },
      }),
    ]);

    const completionByAchievement = new Map<
      string,
      { id: string; completeAt: Date; count: number }
    >();
    for (const item of completed) {
      const existing = completionByAchievement.get(item.achievementId);
      completionByAchievement.set(item.achievementId, {
        id: existing?.id ?? item.id,
        completeAt: item.completeAt,
        count: (existing?.count ?? 0) + 1,
      });
    }

    const data = achievements.map((achievement) => {
      const completion = completionByAchievement.get(achievement.id);
      return {
        id: completion?.id ?? "",
        completeAt: completion?.completeAt ?? null,
        count: completion?.count ?? 0,
        achievements: achievement,
      };
    });

    return { status: "success", data };
  } catch (error) {
    console.error("Failed to fetch user achievements:", error);
    return { status: "error", error: genericError };
  }
};

export const getUserNotifications = async (): Promise<
  ActionResult<Notifications[]>
> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };

    const notifications = await prisma.notifications.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return { status: "success", data: notifications };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { status: "error", error: genericError };
  }
};

export const addUserNotification = async (
  description: string,
  title: string,
  type: string,
): Promise<ActionResult<Notifications>> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedType = type.trim();
    if (!normalizedTitle || !normalizedDescription || !normalizedType) {
      return { status: "error", error: "Invalid notification." };
    }

    const notification = await prisma.notifications.create({
      data: {
        description: normalizedDescription,
        title: normalizedTitle,
        userId: session.user.id,
        type: normalizedType,
      },
    });
    return { status: "success", data: notification };
  } catch (error) {
    console.error("Failed to create notification:", error);
    return { status: "error", error: genericError };
  }
};

export const markUserNotificationsAsRead = async (): Promise<
  ActionResult<number>
> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };

    const result = await prisma.notifications.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    return { status: "success", data: result.count };
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return { status: "error", error: genericError };
  }
};
