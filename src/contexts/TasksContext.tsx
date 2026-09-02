"use client";
import {
  addTask as addTaskAction,
  changeTaskStatus,
  deleteTask as deleteTaskAction,
  getUserTasks,
  updateTask as updateTaskAction,
} from "@/app/actions/userActions";
import { TaskSchemaType } from "@/lib/schemas/taskSchema";
import type { ActionResult, UserTask } from "@/types/domain";
import { TaskStatus } from "@/types/enums";
import { Tasks } from "@prisma/client";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type TasksContextType = {
  tasks: UserTask[];
  filteredTasks: UserTask[] | null;
  isPending: boolean;
  addTask: (task: TaskSchemaType) => Promise<ActionResult<Tasks>>;
  deleteTask: (taskId: string) => Promise<ActionResult<null>>;
  doneTask: (taskId: string, note?: string) => Promise<ActionResult<Tasks>>;
  updateTask: (
    task: TaskSchemaType,
    taskId: string,
  ) => Promise<ActionResult<Tasks>>;
  filterTasks: (text: string) => void;
  filterTasksByCategory: (text: string) => void;
  resetFilters: () => void;
};

const defaultContext: TasksContextType = {
  tasks: [],
  filteredTasks: null,
  isPending: false,
  deleteTask: async () => ({
    status: "error",
    error: "TasksProvider is missing.",
  }),
  addTask: async () => ({ status: "error", error: "" }),
  doneTask: async () => ({ status: "error", error: "" }),
  updateTask: async () => ({ status: "error", error: "" }),
  filterTasks: () => undefined,
  filterTasksByCategory: () => undefined,
  resetFilters: () => undefined,
};
export const TasksContext = createContext<TasksContextType>(defaultContext);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<UserTask[] | null>(null);
  const refreshTasks = useCallback(async () => {
    setIsPending(true);
    try {
      const response = await getUserTasks();
      if (response.status === "success") setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsPending(false);
    }
  }, []);
  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);
  const resetFilters = useCallback(() => {
    setFilteredTasks(null);
  }, []);
  const filterTasks = useCallback(
    (text: string) => {
      if (text.length === 0) {
        resetFilters();
        return;
      }
      const normalizedText = text.toLocaleLowerCase();
      const filteredT = tasks.filter(
        (t) =>
          t.title.toLocaleLowerCase().includes(normalizedText) ||
          t.description?.toLocaleLowerCase().includes(normalizedText),
      );
      setFilteredTasks(filteredT);
    },
    [resetFilters, tasks],
  );
  const filterTasksByCategory = useCallback(
    (catId: string) => {
      const filteredT = tasks.filter((t) => t.category?.id === catId);
      setFilteredTasks(filteredT);
    },
    [tasks],
  );
  const deleteTask = useCallback(
    async (taskId: string): Promise<ActionResult<null>> => {
      const response = await deleteTaskAction(taskId);
      if (response.status === "success") {
        setTasks((current) => current.filter((task) => task.id !== taskId));
        setFilteredTasks(
          (current) => current?.filter((task) => task.id !== taskId) ?? null,
        );
      }
      return response;
    },
    [],
  );
  const addTask = useCallback(
    async (task: TaskSchemaType): Promise<ActionResult<Tasks>> => {
      const response = await addTaskAction(task);
      if (response.status === "success") {
        await refreshTasks();
      }
      return response;
    },
    [refreshTasks],
  );
  const updateTask = useCallback(
    async (
      task: TaskSchemaType,
      taskId: string,
    ): Promise<ActionResult<Tasks>> => {
      const response = await updateTaskAction({ ...task, taskId });
      if (response.status === "success") {
        await refreshTasks();
      }
      return response;
    },
    [refreshTasks],
  );
  const doneTask = useCallback(
    async (taskId: string, note?: string): Promise<ActionResult<Tasks>> => {
      const response = await changeTaskStatus(taskId, TaskStatus.Done, note);
      if (response.status === "success") {
        await refreshTasks();
      }
      return response;
    },
    [refreshTasks],
  );
  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      isPending,
      deleteTask,
      addTask,
      doneTask,
      updateTask,
      filterTasks,
      resetFilters,
      filterTasksByCategory,
    }),
    [
      tasks,
      filteredTasks,
      isPending,
      deleteTask,
      addTask,
      doneTask,
      updateTask,
      filterTasks,
      resetFilters,
      filterTasksByCategory,
    ],
  );
  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};
