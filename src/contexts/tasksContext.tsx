"use client"
import { AddTask, DeleteTask, GetUserTask } from "@/app/actions/userActions";
import { TaskSchemaType } from "@/lib/schemas/taskSchema";
import { Tasks } from "@prisma/client";
import React, { createContext, useEffect, useState, useTransition } from "react";
import { ZodIssue } from "zod";

type TasksContextType = {
    tasks: Tasks[],
    isPending: boolean
    addTask: (task: TaskSchemaType) => Promise<ActionResult<Tasks>> | void,
    deleteTask: (taskId: string) => Promise<string | ZodIssue[]> | void
}

const defaultContext: TasksContextType = { tasks: [], isPending: false, deleteTask: () => { }, addTask: () => { } };
export const TasksContext = createContext<TasksContextType>(defaultContext);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {

    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [isPending, startTransition] = useTransition();
    const GetTasks = () => {
        startTransition(async () => {
            const response = await GetUserTask();
            if (response.status === "success") {
                setTasks(response.data)
            }
        })
    }
    useEffect(() => {
        GetTasks()
    }, [])
    const deleteTask = async (taskId: string): Promise<string | ZodIssue[]> => {
        const response = await DeleteTask(taskId);
        if (response.status === "success") {
            GetTasks();
            return response.status
        }
        else
            return response.error

    }
    const addTask = async (task: TaskSchemaType): Promise<ActionResult<Tasks>> => {

        const response = await AddTask(task)
        if (response.status === "success") {
            GetTasks();
        }
        return response
    }
    return (
        <TasksContext.Provider value={{ tasks, isPending, deleteTask, addTask }}>
            {children}
        </TasksContext.Provider>

    );
};

