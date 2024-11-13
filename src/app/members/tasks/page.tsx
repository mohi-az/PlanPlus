"use client"
import React, { useContext} from 'react'
import AddNewTask from './addTask';
import UserTasksList from '@/app/members/tasks/tasksList';
import TableSkeleton from '@/lib/skeletons/table';
import { TasksContext } from '@/contexts/tasksContext';

export default function UserTasks() {
    const { tasks,isPending } = useContext(TasksContext);

    return (
        <div className='w-full p-5 h-remain overflow-y-scroll'>
            <AddNewTask />
            <div className="divider"></div>
            <div className=" rounded-md p-3 bg-base-300  min-h-Adivider "  >
                {isPending ? <TableSkeleton />
                    : 
                    <UserTasksList userTask={tasks} />}
            </div>
        </div>
    )
}
