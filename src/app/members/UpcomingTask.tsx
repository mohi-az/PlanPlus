'use client'
import clsx from 'clsx';
import Lottie from '@/lib/components/Lottie';
import React, { useContext, useEffect, useState } from 'react'
import confettie from '@/assets/lotties/confetti.json'
import { GetUserTask } from '../actions/userActions';
import moment from 'moment';
import { taskStatus } from '@/types/enums';
import { TasksContext } from '@/contexts/TasksContext';
import Loading from '@/lib/components/Loading';
import { toast } from 'react-toastify';
export default function UpcomingTask() {
    const { isPending } = useContext(TasksContext)
    const [upcommingTasks, setUpcomingTasks] = useState<userTasks[]>();

    const GetUpcomingTasks = async () => {
        const response = await GetUserTask();
        if (response.status === "error") {
            toast.error("Something went wrong!");
            return
        }
        const userUpcomingTasks = response.data.filter(t => t.status === taskStatus.ToDo
            &&
            moment(t.dueDate).diff(Date.now(), 'days') > 0 && moment(t.dueDate).diff(Date.now(), 'days') < 5)
        setUpcomingTasks(userUpcomingTasks)
    }
    useEffect(() => {
        GetUpcomingTasks();
    }, [])
    return (
        <div className='w-full align-top h-full' data-testid='Container'>
            {isPending ? <div className='flex justify-center h-full items-center'> <Loading /></div>
                :
                upcommingTasks && upcommingTasks.length > 0 ?
                    (
                        <table className="table table-zebra w-ful mt-auto" data-testid='UpcommingTasksTable'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className='lg:font-semibold text-sm lg:text-lg'>Title</th>
                                    <th className='lg:font-semibold text-sm lg:text-lg'>Description</th>
                                    <th className='lg:font-semibold text-sm lg:text-lg'>Due date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    upcommingTasks.map((task, index) =>
                                        <tr key={task.id} className='w-full hover h-6 overflow-y-scroll'>
                                            <td>{index + 1}</td>
                                            <td className={clsx(task.status != "Done" && 'font-bold', 'flex flex-row gap-2 items-center')}>
                                                {task.title}
                                            </td>
                                            <td className={clsx(task.status != "Done" && 'font-bold')}> {task.description}</td>
                                            <td> {task.dueDate ? new Date(task.dueDate).toDateString() : ''}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    )
                    : <div className='flex flex-col items-center h-1/2 gap-1 md:gap-5 justify-center'>
                        <div>
                            <Lottie animationData={confettie} loop={false} className='w-32' />
                        </div>
                        <div className='pb-1' data-testid="EmptyTask">No upcoming tasks—enjoy your day!</div>
                    </div>
            }</div>
    )
}
