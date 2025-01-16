"use client"
import Stat from '@/lib/components/Stat'
import React, { useEffect, useState } from 'react'
import { GetMetrics, MonthlyReport } from '../actions/userActions';
import PieChart from '@/lib/components/PieChart';
import pending from '@/assets/lotties/Pending.json'
import Done from '@/assets/lotties/Done.json'
import AllTasks from '@/assets/lotties/AllTasks.json'
import UpcomingTask from './UpcomingTask';



export default function Page() {
    const [chartData, setChartData] = useState<monthlyReport | null>(null);
    const [metricsData, setMetricsData] = useState<tasksMetric | null>(null);
    const GetMetricsData = async () => {
        const response = await GetMetrics();
        if (response.status === "success") setMetricsData(response.data)
    }
    const GetChartData = async () => {
        const response = await MonthlyReport();
        if (response.status === "success")
            setChartData(response.data)
    }
    useEffect(() => {
        GetChartData();
        GetMetricsData();
    }, [])
    return (
        <div className='overflow-y-scroll overflow-x-hidden md:overflow-hidden flex flex-col h-full'>
            <div className=" rounded-md bg-base-200 mx-4 mb-3 p-2 flex flex-col md:flex-grow-0 md:h-1/6 "  >
                {metricsData ?
                    <div className='stats stats-vertical md:stats-horizontal shadow overflow-hidden'>
                        <div className='hero bg-base-300 w-full stat p-2 '>
                            <Stat title='Total Tasks' key="TotalTasks" value={metricsData.totalTasks.toString()} desc='All tasks in your list.'
                                icon={AllTasks} />
                        </div>
                        <div className='hero bg-base-300  w-full stat  p-2 '>
                            <Stat title='Completed Tasks' value={metricsData.completedTasks.toString()} key="CompletedTasks"
                                desc={`You've completed ${metricsData.completedTasksThisWeek.toString()} tasks this week.`}
                                icon={Done} />
                        </div>
                        <div className='hero bg-base-300  w-full stat  p-2 '>
                            <Stat title='Pending Tasks' key="PendingTasks"
                                value={metricsData.pendingTasks.toString()}
                                desc={`${metricsData.upcomingTasks.toString()} tasks due soon.`} icon={pending} />
                        </div>
                    </div> : ''}
            </div>
            <div className=" rounded-md bg-base-200 mx-4 flex flex-col  md:flex-row md:flex-grow h-5/6"  >
                <div className=' content-start flex flex-col h-full w-full  md:w-2/3 p-4'>
                    <div className='  text-white pb-2 md:pb-5 text-base md:text-lg'>Tasks Near Deadline</div>
                    <div className='hero bg-base-300 w-full h-full'>
                        <UpcomingTask />
                    </div>
                </div>
                <div className='content-start flex flex-col h-full w-full md:w-1/3 p-4 '>
                    <div className='  text-white pb-2 md:pb-5 text-base md:text-lg'> chart</div>
                    <div className='hero bg-base-300 h-full '>
                        {chartData &&
                            <PieChart data={chartData} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
