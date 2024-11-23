
import { auth } from '@/auth';
import { TasksProvider } from '@/contexts/tasksContext';
import Navbar from '@/lib/components/navbar'
import Sidebar from '@/lib/components/sidebar'
import React from 'react'

export default async function layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <div className='flex flex-col  w-full h-dvh overflow-hidden '>
            <div className='bg-red-300 '>
                {session && <Navbar session={session} />}
            </div>
            <div className='flex flex-row' >
                <div className='z-10'>
                    <Sidebar />
                </div>
                <div className='w-full '>
                    <TasksProvider>
                        
                        {children}
                    </TasksProvider>
                </div>
            </div>
        </div>
    )
}
