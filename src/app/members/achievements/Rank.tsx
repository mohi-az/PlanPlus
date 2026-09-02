"use client";
import { AchievementsContext } from "@/contexts/AchievementsContext";
import RankSkeleton from "@/lib/skeletons/RankSkeleton";
import LottieAnimation from "@/lib/components/Lottie";
import React, { useContext, useEffect, useState } from "react";

export default function Rank() {
  const { currentRank, nextRank, isPending, userBadge } =
    useContext(AchievementsContext);
  const [animationData, setAnimationData] = useState<object | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loadAnimation = async () => {
      try {
        const response = await fetch(
          `/images/badges/${userBadge?.next.badgeIconURL}`,
        );
        if (!response.ok)
          throw new Error(
            `Failed to load badge animation (${response.status})`,
          );
        const animation = await response.json();
        if (!cancelled) setAnimationData(animation);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    if (userBadge) void loadAnimation();
    return () => {
      cancelled = true;
    };
  }, [userBadge]);
  return (
    <div>
      {!isPending && userBadge ? (
        <div className="flex flex-col gap-2">
          <div>{userBadge?.current.badgeTitle}</div>
          <div className=" flex flex-row flex-nowrap gap-7">
            <progress
              className="progress progress-accent w-full h-5"
              value={currentRank}
              max={nextRank}
            ></progress>
            {`${currentRank}/${nextRank}`}
          </div>
          <div className="flex justify-end">
            {animationData && (
              <LottieAnimation
                animationData={animationData}
                loop={false}
                className="w-16"
              />
            )}
          </div>
        </div>
      ) : (
        <RankSkeleton />
      )}
    </div>
  );
}
