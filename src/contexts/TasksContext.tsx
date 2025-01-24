"use client"
import { AddTask, ChangeTaskStatus, DeleteTask, GetUserTask, UpdateTask } from "@/app/actions/userActions";
import { TaskSchemaType } from "@/lib/schemas/taskSchema";
import { Tasks } from "@prisma/client";
import React, { createContext, useEffect, useState } from "react";
import { ZodIssue } from "zod";

type TasksContextType = {
    tasks: userTasks[],
    filteredTasks: userTasks[] | null,
    isPending: boolean
    addTask: (task: TaskSchemaType) => Promise<ActionResult<Tasks>>,
    deleteTask: (taskId: string) => Promise<string | ZodIssue[]>,
    doneTask: (taskId: string, note?: string) => Promise<ActionResult<Tasks>>,
    updateTask: (task: TaskSchemaType, taskId: string) => Promise<ActionResult<Tasks>>,
    filterTasks: (text: string) => void
    filterTasksByCategory: (text: string) => void
    resetFilters: () => void
}

const defaultContext: TasksContextType = {
    tasks: [],
    filteredTasks: null,
    isPending: false,
    deleteTask: async () => (''),
    addTask: async () => ({ status: "error", error: '' }),
    doneTask: async () => ({ status: "error", error: '' }),
    updateTask: async () => ({ status: "error", error: '' }),
    filterTasks: async () => [],
    filterTasksByCategory: async () => [],
    resetFilters: async () => [],
}
export const TasksContext = createContext<TasksContextType>(defaultContext);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {

    const [tasks, setTasks] = useState<userTasks[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<userTasks[] | null>(null);
    const GetTasks = async () => {
        setIsPending(true);
        const response = await GetUserTask();
        if (response.status === "success") {
            setTasks(response.data)
        }
        setIsPending(false)

    }
    useEffect(() => { GetTasks() }, [])
    const filterTasks = (text: string) => {
        if (text.length === 0) resetFilters()
        const filteredT = tasks.filter(t => t.title.includes(text) || t.description?.includes(text));
        setFilteredTasks(filteredT);
    }
    const filterTasksByCategory = (catId: string) => {
        const filteredT = tasks.filter(t => t.category?.id === catId);
        setFilteredTasks(filteredT);
    }
    const resetFilters = () => {
        setFilteredTasks(null);
    }
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
        if (response.status === "success") {
            GetTasks();
        }
        return response
    }
    const doneTask = async (taskId: string, note?: string): Promise<ActionResult<Tasks>> => {
        const response = await ChangeTaskStatus(taskId, "Done", note)
        if (response.status === "success") {
            GetTasks();
        }
        return response
    }
    return (
        <TasksContext.Provider value={{ tasks, filteredTasks, isPending, deleteTask, addTask, doneTask, updateTask, filterTasks, resetFilters, filterTasksByCategory, }}>
            {children}
        </TasksContext.Provider>

    );
};

