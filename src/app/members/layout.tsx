

import { auth } from '@/auth';
import Navbar from '@/lib/components/navbar'
import Sidebar from '@/lib/components/sidebar'
import React from 'react'

export default async function layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <div className='flex flex-col  w-full'>
            <div className='bg-red-300 '>
                {session && <Navbar session={session} />}
            </div>
            <div className='flex flex-row h-remain' >
                <div className=' w-1/6  '>
                    <Sidebar />
                </div>
                <div className=' w-5/6 '>
                    {children}
                </div>
            </div>
        </div>
    )
}
