"use client"
import { CategoryContext } from '@/contexts/CategoryContext'
import Link from 'next/link'
import React, { useContext } from 'react'
import { FaTasks } from 'react-icons/fa'
import { GrAchievement } from 'react-icons/gr'
import { MdCategory, MdDashboard } from 'react-icons/md'
import { PiNoteFill } from 'react-icons/pi'
import { RiMenuFold4Fill } from 'react-icons/ri'
import IconLoader from './IconLoader'
import { usePathname, useSearchParams } from 'next/navigation'
import clsx from 'clsx'

export default function Sidebar() {
    const { categories, isPending } = useContext(CategoryContext)
    const Path = usePathname();
    const params = useSearchParams();

    const MenuItems = [
        { link: '/members', title: 'Dashboard', icon: () => <MdDashboard /> },
        { link: '/members/tasks', title: 'My Tasks', icon: () => <FaTasks /> },
        { link: '/members/achievements', title: 'Achievements', icon: () => <GrAchievement /> },
        { link: '/members/notes', title: 'My Notes', icon: () => <PiNoteFill /> },
        { link: '/members/categories', title: 'Categories', icon: () => <MdCategory /> },
    ]
    return (
        <div className="drawer lg:drawer-open h-full flex">
            <input id="PlanPlusSlider" type="checkbox" className="drawer-toggle" />
            <div className='fixed top-0' >
                <label htmlFor="PlanPlusSlider" className="btn btn-ghost drawer-button text-xl pt-5 sm:pt-4 sm:text-3xl  lg:hidden text-white" >
                    <RiMenuFold4Fill />
                </label>
            </div>
            <div className="drawer-side h-full ">
                <label htmlFor="PlanPlusSlider" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200  text-base-content min-h-full w-80 p-4 text-sm md:text-base lg:text-lg">
                    {MenuItems.map(menu => <li key={menu.link} className={clsx(Path === menu.link && 'bg-base-300 font-bold')}>
                        <Link href={menu.link}><menu.icon /> {menu.title}</Link></li>)
                    }
                    <div className='divider-primary divider'>My Categories</div>
                    {
                        !isPending ? categories.filter(ca=>ca.showInMenu===true).map(ca => <li key={ca.id} className={clsx(params.get('ca')===ca.id && 'bg-base-300 font-bold')} >
                            <Link href={"/members/tasks/?ca=" + ca.id}><IconLoader name={ca.icon ? ca.icon : 'FcWorkflow'} />{ca.name}</Link></li>)
                            : <div className='w-full text-center pt-10'>
                                <div className='loading loading-spinner '></div>
                            </div>
                    }
                </ul>
            </div>
        </div>
    )
}
