
import { auth } from '@/auth';
import { TasksProvider } from '@/contexts/tasksContext';
import Navbar from '@/lib/components/navbar'
import Sidebar from '@/lib/components/sidebar'
import React from 'react'

export default async function layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    return (
        <div className='flex flex-col overflow-y-hidden  w-full h-screen '>
            <div className='bg-red-300 '>
                {session && <Navbar session={session} />}
            </div>
            <div className='flex flex-row' >
                <div className=''>
                    <Sidebar />
                </div>
                <div className='w-full'>
                    <TasksProvider>
                        
                        {children}
                    </TasksProvider>
                </div>
            </div>
        </div>
    )
}
