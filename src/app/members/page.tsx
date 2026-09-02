import AllTasks from "@/assets/lotties/AllTasks.json";
import Done from "@/assets/lotties/Done.json";
import pending from "@/assets/lotties/Pending.json";
import MonthlyTasksChart from "@/lib/components/MonthlyTasksChart";
import Stat from "@/lib/components/Stat";
import { getMetrics, getMonthlyReport } from "../actions/userActions";
import UpcomingTask from "./UpcomingTask";

export default async function DashboardPage() {
  const [metricsResult, reportResult] = await Promise.all([
    getMetrics(),
    getMonthlyReport(),
  ]);
  const metrics =
    metricsResult.status === "success" ? metricsResult.data : null;
  const chartData =
    reportResult.status === "success" ? reportResult.data : null;

  return (
    <div className="overflow-y-scroll overflow-x-hidden md:overflow-hidden flex flex-col h-full">
      <div className="rounded-md bg-base-200 mx-4 mb-3 p-2 flex flex-col md:flex-grow-0 md:h-1/6">
        {metrics && (
          <div className="stats stats-vertical md:stats-horizontal shadow overflow-hidden">
            <div className="hero bg-base-300 w-full stat p-2">
              <Stat
                title="Total Tasks"
                value={metrics.totalTasks.toString()}
                desc="All tasks in your list."
                icon={AllTasks}
              />
            </div>
            <div className="hero bg-base-300 w-full stat p-2">
              <Stat
                title="Completed Tasks"
                value={metrics.completedTasks.toString()}
                desc={`You've completed ${metrics.completedTasksThisWeek} tasks this week.`}
                icon={Done}
              />
            </div>
            <div className="hero bg-base-300 w-full stat p-2">
              <Stat
                title="Pending Tasks"
                value={metrics.pendingTasks.toString()}
                desc={`${metrics.upcomingTasks} tasks due soon.`}
                icon={pending}
              />
            </div>
          </div>
        )}
      </div>
      <div className="rounded-md bg-base-200 mx-4 flex flex-col md:flex-row md:flex-grow h-5/6">
        <div className="content-start flex flex-col h-full w-full md:w-2/3 p-4">
          <div className="text-white pb-2 md:pb-5 text-base md:text-lg">
            Tasks Near Deadline
          </div>
          <div className="hero bg-base-300 w-full h-full">
            <UpcomingTask />
          </div>
        </div>
        <div className="content-start flex flex-col h-full w-full md:w-1/3 p-4">
          <div className="text-white pb-2 md:pb-5 text-base md:text-lg">
            Monthly activity
          </div>
          <div className="hero bg-base-300 h-full">
            {chartData && <MonthlyTasksChart data={chartData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
