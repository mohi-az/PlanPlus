
import { signOut } from '@/auth'
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react'

export default async function Navbar({ session }: { session: Session }) {

    const handleLogOut = async () => {
        'use server'
        await signOut({ redirectTo: '/auth/login', redirect: true });
    }
    return (
        <>
            <div className="navbar bg-neutral">
                <div className="flex-1 text-2xl pl-14 lg:pl-10 text-orange-400">
                    Plan Plus <span className=' pb-3 text-sm'>+</span><span className=' pb-2 text-base'>+</span>
                </div>
                <div className="flex-none gap-2 ">


                    {session?.user ?
                        <>
                            <div className="form-control">
                                <input type="text" placeholder="Search tasks" className="input input-bordered w-32 input-sm md:w-auto" />
                            </div>
                            <button className="btn btn-ghost btn-circle">
                                <div className="indicator">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="badge badge-xs badge-primary indicator-item"></span>
                                </div>
                            </button>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img alt="Tailwind CSS Navbar component"
                                            src={session?.user.image ?? 'images/avatar.png'} />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    
                                    <li><Link href={"members/profile"} > Settings</Link></li>
                                    <li><form id="logout" action={handleLogOut} className='flex text-left'>
                                   
                                       <button type='submit' className=' w-full text-left' >Logout</button>
                                    </form>
                                    </li>
                                </ul>
                            </div>
                        </>
                        :

                        <ul className="menu menu-horizontal px-1">
                            <li><Link href={"/auth/register"}>Sign Up</Link></li>
                            <li><Link href={"/auth/login"}>Sign In</Link></li>

                        </ul>
                    }
                </div>
            </div>
        </>


    )
}
