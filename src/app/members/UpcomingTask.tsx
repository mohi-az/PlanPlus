"use client";

import confetti from "@/assets/lotties/confetti.json";
import { TasksContext } from "@/contexts/TasksContext";
import Loading from "@/lib/components/Loading";
import Lottie from "@/lib/components/Lottie";
import { TaskStatus } from "@/types/enums";
import clsx from "clsx";
import React, { useContext, useMemo } from "react";

export default function UpcomingTask() {
  const { tasks, isPending } = useContext(TasksContext);
  const upcomingTasks = useMemo(() => {
    const now = Date.now();
    const upcomingEnd = now + 5 * 24 * 60 * 60 * 1000;
    return tasks.filter((task) => {
      const dueTime = task.dueDate ? new Date(task.dueDate).getTime() : 0;
      return (
        task.status === TaskStatus.Todo &&
        dueTime > now &&
        dueTime <= upcomingEnd
      );
    });
  }, [tasks]);

  return (
    <div className="w-full align-top h-full" data-testid="Container">
      {isPending ? (
        <div className="flex justify-center h-full items-center">
          <Loading />
        </div>
      ) : upcomingTasks.length > 0 ? (
        <table
          className="table table-zebra w-full mt-auto"
          data-testid="UpcomingTasksTable"
        >
          <thead>
            <tr>
              <th></th>
              <th className="lg:font-semibold text-sm lg:text-lg">Title</th>
              <th className="lg:font-semibold text-sm lg:text-lg">
                Description
              </th>
              <th className="lg:font-semibold text-sm lg:text-lg">Due date</th>
            </tr>
          </thead>
          <tbody>
            {upcomingTasks.map((task, index) => (
              <tr key={task.id} className="w-full hover h-6 overflow-y-scroll">
                <td>{index + 1}</td>
                <td
                  className={clsx(
                    task.status !== TaskStatus.Done && "font-bold",
                    "flex flex-row gap-2 items-center",
                  )}
                >
                  {task.title}
                </td>
                <td
                  className={clsx(
                    task.status !== TaskStatus.Done && "font-bold",
                  )}
                >
                  {task.description}
                </td>
                <td>
                  {task.dueDate ? new Date(task.dueDate).toDateString() : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center h-1/2 gap-1 md:gap-5 justify-center">
          <Lottie animationData={confetti} loop={false} className="w-32" />
          <div className="pb-1" data-testid="EmptyTask">
            No upcoming tasks—enjoy your day!
          </div>
        </div>
      )}
    </div>
  );
}
