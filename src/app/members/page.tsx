"use server"
import Stat from '@/lib/components/stat'
import React, { Suspense } from 'react'
import { GetMetrics, GetUserTask, MonthlyReport } from '../actions/userActions';
import { taskStatus } from '@/types/enums';
import PieChart from '@/lib/components/pieChart';
import moment from 'moment';
import UpcomingTask from './upcomingTask';
import pending from '@/assets/lotties/Pending.json'
import Done from '@/assets/lotties/Done.json'
import AllTasks from '@/assets/lotties/AllTasks.json'

export default async function Page() {
    const metrics = await GetMetrics();
    const response = await GetUserTask();
    const ChartData = await MonthlyReport();
    const userUpcomingTasks = response.status === "success" ? response.data.filter(t => t.status === taskStatus.ToDo &&
        moment(t.dueDate).diff(Date.now(), 'days') > 0 && moment(t.dueDate).diff(Date.now(), 'days') < 5) : [];
    return (
        <div className=' h-remain overflow-y-scroll overflow-x-hidden md:overflow-hidden flex flex-col -mb-10'>
        
                <div className=" rounded-md bg-base-200 mx-4 mb-4 p-5 flex flex-col md:flex-grow-0 "  >
                    {metrics.status === "success" ? 
                    <div className='stats stats-vertical   md:stats-horizontal shadow overflow-hidden'>
                        <div className='hero bg-base-300 w-full stat '>
                            <Stat title='Total Tasks' value={metrics.data.totalTasks.toString()} desc='All tasks in your list.'
                              icon={AllTasks} />
                        </div>
                        <div className='hero bg-base-300  w-full stat '>
                            <Stat title='Completed Tasks' value={metrics.data.completedTasks.toString()}
                                desc={`You've completed ${metrics.data.completedTasksThisWeek.toString()} tasks this week.`}
                                icon={Done} />
                        </div>
                        <div className='hero bg-base-300  w-full stat '>
                            <Stat title='Pending Tasks'
                                value={metrics.data.pendingTasks.toString()}
                                desc={`${metrics.data.upcomingTasks.toString()} tasks due soon.`} icon={pending} />
                        </div>
                    </div> : ''}
                </div>

                <div className=" rounded-md bg-base-200 mx-4 flex flex-col  md:flex-row md:flex-grow">
                    <div className=' content-start flex flex-col h-full w-full  md:w-2/3 p-4'>
                        <div className='  text-white pb-2 md:pb-5 text-base md:text-lg'>Tasks Near Deadline</div>
                        <div className='hero bg-base-300 w-full h-full'>
                            <Suspense fallback={<span className="loading loading-bars loading-lg"></span>}>
                                <UpcomingTask userUpcomingTasks={userUpcomingTasks} />
                            </Suspense>
                        </div>
                    </div>
                    <div className='content-start flex flex-col h-full w-full md:w-1/3 p-4 '>
                        <div className='  text-white pb-2 md:pb-5 text-base md:text-lg'> chart</div>
                        <div className='hero bg-base-300 h-full '>
                            <Suspense fallback={<span className="loading loading-bars loading-lg"></span>}>
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
