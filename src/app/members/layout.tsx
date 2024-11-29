
import { auth } from '@/auth';
import { CategoryProvider } from '@/contexts/categoryContext';
import { TasksProvider } from '@/contexts/tasksContext';
import Navbar from '@/lib/components/navbar'
import Sidebar from '@/lib/components/sidebar'
import { redirect } from 'next/navigation';
import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) redirect('/auth/login')
    return (
        <div className='flex flex-col  w-full h-dvh overflow-hidden '>
            <ToastContainer position='bottom-right' theme='dark' />

            <div className='bg-red-300 '>
                {session && <Navbar session={session} />}
            </div>
            <div className='flex flex-row' >
                <TasksProvider>
                    <CategoryProvider>
                        <div className='z-10'>
                            <Sidebar />
                        </div>
                        <div className='w-full '>
                            {children}
                        </div>
                    </CategoryProvider>
                </TasksProvider>
            </div>
        </div >
    )
}
