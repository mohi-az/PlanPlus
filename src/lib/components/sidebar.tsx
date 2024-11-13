import Link from 'next/link'
import React from 'react'
import { FaTasks } from 'react-icons/fa'
import { GrAchievement } from 'react-icons/gr'
import { MdCategory, MdDashboard } from 'react-icons/md'
import { PiNoteFill } from 'react-icons/pi'
import { RiMenuFold4Fill } from 'react-icons/ri'

export default function Sidebar() {
    return (
        <div className="drawer lg:drawer-open h-remain  flex">
            <input id="PlanPluseSlider" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">

                <label htmlFor="PlanPluseSlider" className="btn btn-ghost drawer-button text-xl sm:text-3xl  lg:hidden text-white" >
                    <RiMenuFold4Fill />
                </label>
            </div>

            <div className="drawer-side h-remain ">
                <label htmlFor="PlanPluseSlider" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200  text-base-content min-h-full w-80 p-4 text-sm md:text-base lg:text-lg">

                    <li><Link href={"/members"}><MdDashboard />Dashboard</Link></li>
                    <li><Link href={"/members/tasks"}><FaTasks />My Tasks</Link></li>
                    <li><Link href={"/members/achievements"}><GrAchievement />Achievements</Link></li>
                    <li><Link href={"/members/notes"}><PiNoteFill/> My Notes</Link></li>
                    <li><Link href={"/members/categories"}><MdCategory/> Categories</Link></li>

                </ul>
            </div>
        </div>
    )
}
