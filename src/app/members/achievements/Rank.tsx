"use client"
import { AchievementsContext } from '@/contexts/AchievementsContext'
import RankSkeleton from '@/lib/skeletons/RankSkeleton';
import LottieAnimation from "@/lib/components/Lottie";
import React, { useContext, useEffect, useState } from 'react'

export default function Rank() {
    const { currentRank, nextRank, isPending, userBadge } = useContext(AchievementsContext)
    const [animationData, setAnimationData] = useState(null);
    useEffect(() => {

        const LoadAnimation = async () => {

            const response = await fetch(`/images/badges/${userBadge?.next.badgeIconURL}`);
            const animation = await response.json();
            setAnimationData(animation);

        }
        if (userBadge)
            LoadAnimation();

    }, [userBadge])
    return (
        <div>{(currentRank && !isPending) ?
            <div className='flex flex-col gap-2'>
                <div>{userBadge?.current.badgeTitle}</div>
                <div className=' flex flex-row flex-nowrap gap-7'>
                    <progress className="progress progress-accent w-full h-5" value={currentRank} max={nextRank}></progress>
                    {`${currentRank}/${nextRank}`}
                </div>
                <div className='flex justify-end'>
                    {animationData &&
                        <LottieAnimation animationData={animationData} loop={false} className='w-16' />
                    }
                </div>
            </div> : <RankSkeleton />
        }</div>
    )
}
