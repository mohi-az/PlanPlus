"use client"
import { AddTask, ChangeTaskStatus, DeleteTask, GetUserTask, UpdateTask } from "@/app/actions/userActions";
import { TaskSchemaType } from "@/lib/schemas/taskSchema";
import { Tasks } from "@prisma/client";
import React, { createContext, useEffect, useState, useTransition } from "react";
import { ZodIssue } from "zod";

type TasksContextType = {
    tasks: userTasks[],
    isPending: boolean
    addTask: (task: TaskSchemaType) => Promise<ActionResult<Tasks>>,
    deleteTask: (taskId: string) => Promise<string | ZodIssue[]>,
    doneTask: (taskId: string, note?: string) => Promise<ActionResult<Tasks>>
    updateTask: (task: TaskSchemaType, taskId: string) => Promise<ActionResult<Tasks>>
}

const defaultContext: TasksContextType = {
    tasks: [], isPending: false,
    deleteTask: async () => (''),
    addTask: async () => ({ status: "error", error: '' }),
    doneTask: async () => ({ status: "error", error: '' }),
    updateTask: async () => ({ status: "error", error: '' })
}
export const TasksContext = createContext<TasksContextType>(defaultContext);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {

    const [tasks, setTasks] = useState<userTasks[]>([]);
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
    const updateTask = async (task: TaskSchemaType, taskId: string): Promise<ActionResult<Tasks>> => {
        const response = await UpdateTask({ ...task, taskId });
        if(response.status==="success"){
            GetTasks();
        }
        return response
    }
    const doneTask = async (taskId: string, note?: string): Promise<ActionResult<Tasks>> => {
        const response = await ChangeTaskStatus(taskId, "Done", note)
        if (response.status === "success") GetTasks();
        return response
    }
    return (
        <TasksContext.Provider value={{ tasks, isPending, deleteTask, addTask, doneTask, updateTask }}>
            {children}
        </TasksContext.Provider>

    );
};

