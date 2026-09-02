"use client";

import {
  getAllBadges,
  getUserAchievements,
  getUserBadge,
} from "@/app/actions/systemAction";
import { calculateAchievements } from "@/lib/achievements";
import type { BadgeDetails, UserAchievement } from "@/types/domain";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

type BadgeProgress = {
  current: BadgeDetails;
  next: BadgeDetails;
  last: BadgeDetails;
};

type AchievementsContextType = {
  userAchievements: UserAchievement[];
  userBadge: BadgeProgress | null;
  currentRank: number;
  nextRank: number;
  isPending: boolean;
  updateAchievements: () => Promise<void>;
};

const initialValue: AchievementsContextType = {
  userBadge: null,
  currentRank: 0,
  nextRank: 0,
  userAchievements: [],
  isPending: false,
  updateAchievements: async () => undefined,
};

export const AchievementsContext =
  createContext<AchievementsContextType>(initialValue);

export const AchievementsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userBadge, setUserBadge] = useState<BadgeProgress | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    [],
  );
  const [isPending, setIsPending] = useState(false);

  const refreshAchievements = useCallback(async () => {
    setIsPending(true);
    try {
      const [achievementsResult, userBadgeResult, badgesResult] =
        await Promise.all([
          getUserAchievements(),
          getUserBadge(),
          getAllBadges(),
        ]);

      if (achievementsResult.status === "success") {
        setUserAchievements(achievementsResult.data);
      }

      if (
        userBadgeResult.status === "success" &&
        badgesResult.status === "success"
      ) {
        const badges = badgesResult.data;
        const currentIndex = badges.findIndex(
          (badge) => badge.id === userBadgeResult.data.id,
        );
        const lastBadge = badges.at(-1) ?? userBadgeResult.data;
        const nextBadge =
          currentIndex >= 0
            ? (badges[currentIndex + 1] ?? lastBadge)
            : (badges.find(
                (badge) =>
                  badge.pointsRequired > userBadgeResult.data.pointsRequired,
              ) ?? lastBadge);

        setUserBadge({
          current: userBadgeResult.data,
          next: nextBadge,
          last: lastBadge,
        });
      }
    } catch (error) {
      console.error("Failed to fetch achievement data:", error);
    } finally {
      setIsPending(false);
    }
  }, []);

  const updateAchievements = useCallback(async () => {
    try {
      const result = await calculateAchievements();
      if (result && (result.badge || result.achievements.length > 0)) {
        await refreshAchievements();
      }
    } catch (error) {
      console.error("Failed to update achievements:", error);
      toast.error("Something went wrong!");
    }
  }, [refreshAchievements]);

  useEffect(() => {
    void refreshAchievements();
  }, [refreshAchievements]);

  const currentRank = useMemo(
    () =>
      userAchievements.reduce(
        (total, item) => total + item.achievements.points * item.count,
        0,
      ),
    [userAchievements],
  );
  const nextRank = userBadge?.next.pointsRequired ?? 0;

  return (
    <AchievementsContext.Provider
      value={{
        userBadge,
        userAchievements,
        currentRank,
        nextRank,
        isPending,
        updateAchievements,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
};
