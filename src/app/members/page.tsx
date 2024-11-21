import Stat from '@/lib/components/stat'
import React, { Suspense } from 'react'
import { GetMetrics, GetUserTask, MonthlyReport } from '../actions/userActions';
import clsx from 'clsx';
import { taskStatus } from '@/types/enums';
import PieChart from '@/lib/components/pieChart';
export default async function Page() {
    const metrics = await GetMetrics();
    const response = await GetUserTask();
    const ChartData = await MonthlyReport();
    const userTask = response.status === "success" ? response.data.filter(t => t.status === taskStatus.ToDo) : [];
    let RowNo = 1;
    return (
        <div className='flex flex-col  h-full'>

<div className='contain-content  h-remain overflow-y-scroll'>

            <div className=" rounded-md bg-base-200 m-4 p-5 flex flex-col"  >
                <div className='pb-5 text-lg text-white'>Tasks  Summary</div>
                {metrics.status === "success" ? <div className='stats stats-vertical   lg:stats-horizontal shadow'>
                    <div className='hero bg-base-300 w-full stat '>
                        <Stat title='Total Tasks' value={metrics.data.totalTasks.toString()} desc='All tasks in your list.'
                            gif={"AllTasks.gif"} />
                    </div>
                    <div className='hero bg-base-300  w-full stat '>
                        <Stat title='Completed Tasks' value={metrics.data.completedTasks.toString()}
                            desc={`You've completed ${metrics.data.completedTasksThisWeek.toString()} tasks this week.`}
                            gif={"idea.gif"} />
                    </div>
                    <div className='hero bg-base-300  w-full stat '>
                        <Stat title='Pending Tasks'
                            value={metrics.data.pendingTasks.toString()}
                            desc={`${metrics.data.upcomingTasks.toString()} tasks due soon.`} gif={'Pending.gif'} />
                    </div>
                </div> : ''}
            </div>
            <div className=" rounded-md bg-base-200 mx-4 grid grid-rows-2  grid-cols-1  p-5 gap-5
            lg:grid-rows-1  lg:grid-cols-3 ">
                <div className='hero bg-base-300 row-start-1 content-start  min-h-130
                lg:row-start-1  lg:col-start-1 sm:col-span-2'>
                    {userTask && (
                        <table className="table table-zebra">
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
                                    userTask.map(task =>
                                        <tr key={task.id} className='w-full hover h-6 overflow-y-scroll'>
                                            <td>{RowNo++}</td>
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
                    }
                </div>

                <div className='hero bg-base-300 row-start-2 
                lg:row-start-1 lg:col-start-3'>
                    <Suspense fallback={"Loading.........."}>

                        {ChartData.status === "success" &&
                            <PieChart data={ChartData.data} />
                        }
                    </Suspense>
                </div>
            </div>
        </div>
        </div>
    )
}
