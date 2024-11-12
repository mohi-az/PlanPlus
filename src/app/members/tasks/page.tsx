"use client"
import React, { Suspense, useEffect, useState, useTransition } from 'react'
import AddNewTask from './addTask';
import UserTasksList from '@/lib/components/tasks';
import { Tasks } from '@prisma/client';
import { GetUserTask } from '@/app/actions/userActions';
import TableSkeleton from '@/lib/skeletons/table';
import clsx from 'clsx';

export default function UserTasks() {

    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [isPending, startTransition] = useTransition();
    const GetTaskData = async () => {
        const response = await GetUserTask();
        if (response.status === "success")
            setTasks(response.data);
    }
    useEffect(() => {
        startTransition(() => {
            GetTaskData();
        })
    }, [])
    const addTaskToList = (newTask: Tasks) => {
        if (newTask)
            setTasks((prevTasks) => [newTask, ...(prevTasks || [])]);

    };
    return (
        <div className='w-full p-5 h-remain overflow-y-scroll'>
            <AddNewTask onTaskAdded={addTaskToList} />
            <div className="divider"></div>

            <div className=" rounded-md p-3 bg-base-300 h-Adivider min-h-Adivider "  >
                {isPending ? <TableSkeleton />
                    : <UserTasksList tasks={tasks}  />}
            </div>
        </div>
    )
}
