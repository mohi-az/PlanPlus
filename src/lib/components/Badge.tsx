"use client";

import { AchievementsContext } from "@/contexts/AchievementsContext";
import { useContext, useEffect, useState } from "react";
import BadgeSkeleton from "../skeletons/BadgeSkeleton";
import LottieAnimation from "./Lottie";
export default function Badge() {
  const { userBadge, isPending } = useContext(AchievementsContext);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadAnimation = async () => {
      try {
        if (userBadge?.current.badgeIconURL) {
          const response = await fetch(
            `/images/badges/${userBadge.current.badgeIconURL}`,
          );
          if (!response.ok)
            throw new Error(
              `Failed to load badge animation (${response.status})`,
            );
          const animation = await response.json();
          if (!cancelled) setAnimationData(animation);
        }
      } catch (error) {
        console.error("Failed to load badge animation:", error);
      }
    };
    void loadAnimation();
    return () => {
      cancelled = true;
    };
  }, [userBadge]);
  return (
    <div>
      {!isPending && userBadge ? (
        <div className="card card-compact w-full flex flex-row justify-start">
          <div className="h-full flex items-center justify-center">
            {animationData && (
              <LottieAnimation
                delayLoop={true}
                animationData={animationData}
                loop={false}
                className="h-40"
              />
            )}
          </div>
          <div className="card-body flex flex-col">
            <span className="text-sm">Your Badge:</span>
            <h2 className="card-title font-mono">{`${userBadge.current.badgeTitle}`}</h2>
            <span className="text-sm">Next Badge:</span>
            <h2 className="card-title font-mono">{`${userBadge.next.badgeTitle}`}</h2>
          </div>
        </div>
      ) : (
        <BadgeSkeleton />
      )}
    </div>
  );
}
