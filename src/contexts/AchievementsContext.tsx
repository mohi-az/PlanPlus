"use client"
import { GetUserAchievements, GetAllBadge, GetUserBadge } from "@/app/actions/systemAction";
import { calculateAchievements } from "@/lib/achievements";
import { Badges } from "@prisma/client";
import { createContext, useEffect, useState } from "react"
type AchievementsType = {
    userAchievements: UserAchievementsType[],
    userBadge: {
        current: Badges,
        next: Badges,
        last: Badges,
    } | null,
    currentRank: number,
    nextRank: number,
    isPending: boolean,
    updateAchievements: () => Promise<void>,
}
const InitialValue: AchievementsType = { userBadge: null, currentRank: 0, nextRank: 0, userAchievements: [], isPending: false, updateAchievements: async () => { } }
export const AchievementsContext = createContext(InitialValue);
export const AchievementsProvider = ({ children }: { children: React.ReactNode }) => {
    const [userBadge, setUserBadge] = useState<{ current: Badges; next: Badges; last: Badges; } | null>(null);
    const [userAchievements, setUserAchievements] = useState<UserAchievementsType[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [currentRank, setCurrentRank] = useState<number>(0);
    const [nextRank, setNextRank] = useState<number>(0);
    const Badge = async () => {
        const userBadge = await GetUserBadge();
        const AllBadge = await GetAllBadge();
        if (AllBadge.status === "success" && userBadge.status === "success") {
            const nextBadge = AllBadge.data.find(badge => badge.id === userBadge.data.id + 1) || { id: 0, badgeTitle: '', pointsRequired: 0, badgeIconURL: '' };
            const lastBadge = AllBadge.data.pop() || { id: 0, badgeTitle: '', pointsRequired: 0, badgeIconURL: '' };
            setUserBadge({ current: userBadge.data, next: nextBadge, last: lastBadge })
            setNextRank(nextBadge.pointsRequired);
        }
    }
    const Achievements = async () => {
        try {
            setIsPending(true);
            const response = await GetUserAchievements();
            if (response.status === "success") {
                setUserAchievements(response.data)
                debugger
                setCurrentRank(response.data
                    .filter(items => items.completeAt != null)
                    .map(items => items.achievements.points * items.count)
                    .reduce((prevVal: number, nextVal: number) => prevVal + nextVal, 0));
            }
            setIsPending(false);

        } catch (error) {
            setIsPending(false);
            console.error("Failed to fetch user achievements:", error);
        }

    }
    const updateAchievements = async () => {
        try {
            const response = await calculateAchievements();
            if (response && (response.badge || response.Achievement)) {
                Badge();
                Achievements();
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        Badge();
        Achievements();
    }, [])
    return (
        <AchievementsContext.Provider value={{ userBadge, userAchievements, currentRank, nextRank, isPending, updateAchievements }}>
            {children}
        </AchievementsContext.Provider>
    )
}