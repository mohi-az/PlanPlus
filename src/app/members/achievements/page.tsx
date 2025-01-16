'use client'
import React from 'react'
import Badge from "../../../lib/components/Badge"
import { AchievementsProvider } from '@/contexts/AchievementsContext'
import Rank from './Rank'
import UserAchievements from './UserAchievements'
export default function Achievements() {

  return (
    <div className='flex flex-col w-full p-5 h-remain overflow-y-hidden gap-2'>
      <AchievementsProvider>
        <div className='flex flex-row gap-2 h-1/5 bg-base-300 p-5'>
          <div className='w-1/3'><Badge /></div>
          <div className='w-2/3'>
            <Rank />
          </div>
        </div>
        <div className='rounded-md p-3 bg-base-300 h-4/5 overflow-y-scroll'><UserAchievements /></div>
      </AchievementsProvider>
    </div>
  )
}
