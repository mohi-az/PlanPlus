"use client"
import { GetUserAchievements, GetAllBadge, GetUserBadge } from "@/app/actions/systemAction";
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
    updateAchievements: () => void
}
const InitialValue: AchievementsType = { userBadge: null, currentRank: 0, nextRank: 0, userAchievements: [], isPending: false, updateAchievements: () => { } }
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
    const Achievements =async () => {
            try {
                setIsPending(true);
                const response = await GetUserAchievements();
                if (response.status === "success") {
                    setUserAchievements(response.data)
                    setCurrentRank(response.data
                        .filter(items => items.completeAt != null)
                        .map(items => items.achievement.points)
                        .reduce((prevVal: number, nextVal: number) => prevVal + nextVal, 0));
                }
                setIsPending(false);

            } catch (error) {
                setIsPending(false);
                console.error("Failed to fetch user achievements:", error);
            }
       
    }
    const updateAchievements = () => {
        Badge();
        Achievements();
    }
    useEffect(() => { updateAchievements(); }, [])
    return (
        <AchievementsContext.Provider value={{ userBadge, userAchievements, currentRank, nextRank, isPending, updateAchievements }}>
            {children}
        </AchievementsContext.Provider>
    )
}