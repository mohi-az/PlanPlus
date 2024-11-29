"use client"
import React, { useContext, useEffect } from 'react'
import AddNewTask from './addTask';
import UserTasksList from '@/app/members/tasks/tasksList';
import TableSkeleton from '@/lib/skeletons/table';
import { TasksContext } from '@/contexts/tasksContext';
import { useSearchParams } from 'next/navigation';

export default function UserTasks() {
    const { tasks, filterTasks, filteredTasks, isPending, filterTasksByCategory, resetFilters } = useContext(TasksContext);
    const Filter = (id: string) => { filterTasksByCategory(id); }
    const params = useSearchParams();
    const categoryName = params.get('ca');
    useEffect(() => {
        if (categoryName)
            Filter(categoryName)
        else resetFilters();
    },[categoryName])
    return (
        <div className='w-full p-5 h-remain overflow-y-scroll'>

            <div className=" flex flex-row gap-5 w-full">
                <AddNewTask />
                <input type="text" placeholder="Search tasks" className="input input-bordered input-sm  md:w-60"
                    onChange={(e) => filterTasks(e.target.value)} />
            </div>
            <div className="divider"></div>
            <div className=" rounded-md p-3 bg-base-300  min-h-Adivider "  >
                {isPending ? <TableSkeleton />
                    :
                    <UserTasksList userTask={tasks} filteredTasks={filteredTasks} />}
            </div>
        </div>
    )
}
