import Link from 'next/link'
import React from 'react'
import { FaTasks } from 'react-icons/fa'
import { GrAchievement } from 'react-icons/gr'
import { MdCategory, MdDashboard } from 'react-icons/md'
import { PiNoteFill } from 'react-icons/pi'
import { RiMenuFold4Fill } from 'react-icons/ri'

export default function Sidebar() {
    return (
        <div className="drawer lg:drawer-open h-dvh md:h-remain  flex">
            <input id="PlanPlusSlider" type="checkbox" className="drawer-toggle" />
            <div className='fixed top-0' >
                <label htmlFor="PlanPlusSlider" className="btn btn-ghost drawer-button text-xl pt-5 sm:pt-4 sm:text-3xl  lg:hidden text-white" >
                    <RiMenuFold4Fill />
                </label>
            </div>

            <div className="drawer-side h-dvh md:h-remain ">
                <label htmlFor="PlanPlusSlider" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200  text-base-content min-h-full w-80 p-4 text-sm md:text-base lg:text-lg">

                    <li><Link href={"/members"}><MdDashboard />Dashboard</Link></li>
                    <li><Link href={"/members/tasks"}><FaTasks />My Tasks</Link></li>
                    <li><Link href={"/members/achievements"}><GrAchievement />Achievements</Link></li>
                    <li><Link href={"/members/notes"}><PiNoteFill /> My Notes</Link></li>
                    <li><Link href={"/members/categories"}><MdCategory /> Categories</Link></li>

                </ul>
            </div>
        </div>
    )
}
