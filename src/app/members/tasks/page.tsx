"use client";
import React, { useContext, useEffect } from "react";
import AddNewTask from "./AddTask";
import UserTasksList from "@/app/members/tasks/TasksList";
import { TasksContext } from "@/contexts/TasksContext";
import { useSearchParams } from "next/navigation";
import Loading from "@/lib/components/Loading";

export default function UserTasks() {
  const {
    tasks,
    filterTasks,
    filteredTasks,
    isPending,
    filterTasksByCategory,
    resetFilters,
  } = useContext(TasksContext);
  const params = useSearchParams();
  const categoryName = params.get("ca");
  useEffect(() => {
    if (categoryName) filterTasksByCategory(categoryName);
    else resetFilters();
  }, [categoryName, filterTasksByCategory, resetFilters]);
  return (
    <div className="w-full p-5 h-full ">
      <div className=" flex flex-row gap-2 w-full">
        <AddNewTask />
        <input
          type="text"
          placeholder="Search tasks"
          className="input input-bordered input-sm  md:w-60"
          onChange={(e) => filterTasks(e.target.value)}
        />
      </div>
      <div className="divider m-1"></div>
      <div className=" rounded-md  bg-base-300 h-[90%]">
        {isPending ? (
          <div className="flex justify-center h-full items-center">
            {" "}
            <Loading />
          </div>
        ) : (
          <UserTasksList userTask={tasks} filteredTasks={filteredTasks} />
        )}
      </div>
    </div>
  );
}
