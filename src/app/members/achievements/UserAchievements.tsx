'use client'
import { AchievementsContext } from '@/contexts/AchievementsContext'
import clsx from 'clsx';
import React, { useContext } from 'react'

export default function UserAchievements() {
  const { userAchievements, isPending } = useContext(AchievementsContext);
  let RowNo=1;
  return (
    <div >{
      !isPending ?
        <div className="overflow-x-auto ">
          <table className="table table-md">
            <thead>
              <tr className='bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-lg'>
                <th></th>
                <th>Name</th>
                <th>Description</th>
                <th>Point</th>
                <th>Eraned at</th>
              </tr>
            </thead>
            <tbody>
              {
                userAchievements.map(Achivement => 
                  <tr key={Achivement.achievement.id}
                   className={clsx(Achivement.completeAt ?
                    'bg-gradient-to-r from-amber-200 to-yellow-500 text-black'
                     : 'bg-gradient-to-r from-neutral-300 to-stone-400 text-black')} >
                    <th>{RowNo++}</th>
                    <td>{Achivement.achievement.name}</td>
                    <td>{Achivement.achievement.description}</td>
                    <td>{Achivement.achievement.points}</td>
                    <td>{ Achivement.completeAt ? new Date(Achivement.completeAt).toLocaleDateString() : "-"}</td>
                  </tr>
                )

              }
            </tbody>
          </table>
        </div> : ''}
    </div>)
}
