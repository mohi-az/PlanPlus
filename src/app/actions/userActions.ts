"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Tasks } from "@prisma/client";
import moment from "moment";
import { ERROR_MESSAGES, TASK_STATUS } from "@/lib/constants";
import { logger } from "@/lib/logger";

export const AddTask = async ({ title, description, dueDate, reminderDateTime, categoryId }: { title: string, description: string, dueDate: string | null, reminderDateTime: string | null, categoryId: string | null }): Promise<ActionResult<Tasks>> => {
    try {
        logger.debug("Adding new task");
        const Session = await auth();
        
        if (!Session?.user?.id) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const reminder = reminderDateTime ? { create: { remindAt: new Date(reminderDateTime), isSent: false } } : {}

        const response = await prisma.tasks.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                status: TASK_STATUS.TODO,
                createdAt: new Date(Date.now()),
                userId: Session.user.id,
                categoryId,
                reminder
            }
        })

        logger.info("Task created successfully", { taskId: response.id });
        return { status: "success", data: response }
    }
    catch (error) {
        logger.error("Error adding task", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const UpdateTask = async ({ taskId, title, description, dueDate, reminderDateTime, categoryId }: { taskId: string, title: string, description: string, dueDate: string | null, reminderDateTime: string | null, categoryId: string | null }): Promise<ActionResult<Tasks>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user?.id) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const existingReminder = await prisma.reminders.findUnique({ where: { taskId: taskId } })
        const reminderUpdate = (existingReminder && reminderDateTime) ? { update: { remindAt: new Date(reminderDateTime), isSent: false } } : {}

        const response = await prisma.tasks.update({
            where: {
                id: taskId,
            },
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                status: TASK_STATUS.TODO,
                createdAt: new Date(Date.now()),
                userId: Session.user.id,
                categoryId,
                reminder: reminderUpdate
            }
        })
        
        if (reminderDateTime && existingReminder === null) {
            await prisma.reminders.create({
                data: {
                    remindAt: new Date(reminderDateTime),
                    isSent: false,
                    taskId: response.id
                }
            })
        }
        else if (reminderDateTime === null && existingReminder) {
            await prisma.reminders.delete({ where: { taskId: taskId } });
        }

        logger.info("Task updated successfully", { taskId });
        return { status: "success", data: response }
    }
    catch (error) {
        logger.error("Error updating task", { error, taskId });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}

export const GetUserTask = async (): Promise<ActionResult<userTasks[]>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const userTasks = await prisma.tasks.findMany({
            where: {
                userId: Session.user.id
            }
            , orderBy: {
                id: "desc"
            }
            , select: {
                id: true,
                createdAt: true,
                description: true,
                title: true,
                dueDate: true,
                status: true, 
                userId: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                reminder: {
                    select: {
                        remindAt: true,
                        id: true
                    }
                }
            }
        })
        
        if (userTasks) {
            return { status: "success", data: userTasks }
        }
        
        return { status: "error", error: "There are no tasks to show" }
    }
    catch (error) {
        logger.error("Error fetching user tasks", { error });
        throw new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG)
    }
}
export const DeleteTask = async (taskId: string): Promise<ActionResult<null>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        await prisma.tasks.delete({
            where: {
                id: taskId,
            }
        })
        
        logger.info("Task deleted successfully", { taskId });
        return { status: "success", data: null }
    }
    catch (error) {
        logger.error("Error deleting task", { error, taskId });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const ChangeTaskStatus = async (taskId: string, status: string, note?: string): Promise<ActionResult<Tasks>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const createNote = note ? { create: { note: note } } : {}
        const response = await prisma.tasks.update({
            where: { id: taskId },
            data: {
                status: status,
                completeAt: status === TASK_STATUS.DONE ? new Date(Date.now()) : null,
                note: createNote
            }
        })
        
        logger.info("Task status changed", { taskId, status });
        return { status: "success", data: response }
    }
    catch (error) {
        logger.error("Error changing task status", { error, taskId });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}


export const GetUserNotes = async (): Promise<ActionResult<noteType[]>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const response = await prisma.taskNote.findMany({
            where: {
                task: {
                    userId: Session.user.id
                }
            },
            select: {
                note: true,
                id: true,
                isFavourite: true,
                task: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        completeAt: true
                    }
                }
            }
        })

        if (response.length > 0) {
            return { status: "success", data: response }
        }
        
        return { status: "error", error: "No notes found" }
    } catch (error) {
        logger.error("Error fetching user notes", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}

export const ChangeFavNote = async (noteId: string): Promise<ActionResult<boolean>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const currentTaskNote = await prisma.taskNote.findUnique({ 
            where: { id: noteId }, 
            select: { isFavourite: true } 
        })
        
        await prisma.taskNote.update({
            where: {
                id: noteId
            },
            data: {
                isFavourite: {
                    set: !currentTaskNote?.isFavourite
                }
            }
        })
        
        logger.info("Note favorite status changed", { noteId });
        return { status: "success", data: true }
    } catch (error) {
        logger.error("Error changing note favorite status", { error, noteId });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}

export const GetMetrics = async (): Promise<ActionResult<tasksMetric>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user?.id) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const response = await prisma.tasks.findMany({
            where: { userId: Session.user.id },
            select: {
                id: true,
                dueDate: true,
                status: true,
                completeAt: true,
            }
        });

        return {
            status: "success",
            data: {
                completedTasks: response.filter(t => t.status === TASK_STATUS.DONE).length,
                completedTasksThisWeek: response.filter(t => 
                    t.status === TASK_STATUS.DONE &&
                    t.completeAt && 
                    moment(t.completeAt).isSame(Date.now(), 'isoWeek')
                ).length,
                pendingTasks: response.filter(t => t.status === TASK_STATUS.TODO).length,
                totalTasks: response.length,
                upcomingTasks: response.filter(t => 
                    t.status === TASK_STATUS.TODO && 
                    t.dueDate &&
                    moment(t.dueDate).diff(Date.now(), 'days') > 0 && 
                    moment(t.dueDate).diff(Date.now(), 'days') < 5
                ).length
            }
        }
    }
    catch (error) {
        logger.error("Error fetching metrics", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const MonthlyReport = async (): Promise<ActionResult<monthlyReport>> => {
    try {
        const Session = await auth();
        const user = Session?.user?.id;
        
        if (!user) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const tasks = await prisma.$queryRaw`
            WITH months AS (
                SELECT
                    TO_CHAR(generate_series(
                        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
                        DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month',
                        '1 month'
                    ), 'yyyy-mm') AS month
            )
            SELECT
                m.month,
                CAST( COALESCE(SUM(CASE WHEN t.status = 'Done' THEN 1 ELSE 0 END), 0) AS INTEGER) AS done_count,
                CAST( COALESCE(SUM(CASE WHEN t.status = 'Todo' THEN 1 ELSE 0 END), 0) AS INTEGER) AS todo_count
            FROM
                months m
            LEFT JOIN
                "Tasks" t
            ON
                TO_CHAR(t."createdAt", 'yyyy-mm') = m.month
                and t."userId" = ${user}
            GROUP BY
                m.month
            ORDER BY
                m.month ASC LIMIT 100
        ` as monthlyReport;
        
        return { status: "success", data: tasks }
    } catch (error) {
        logger.error("Error fetching monthly report", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}

export const GetTaskCategories = async (): Promise<ActionResult<category[]>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user) {
            return { status: "error", error: ERROR_MESSAGES.UNAUTHORIZED }
        }

        const response = await prisma.categories.findMany({
            where: {
                userId: Session.user.id
            },
            select: {
                id: true, 
                name: true, 
                description: true, 
                icon: true, 
                showInMenu: true
            }
        })
        
        return { status: "success", data: response }
    } catch (error) {
        logger.error("Error fetching categories", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const AddCategory = async (category: category): Promise<ActionResult<category>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user?.id) {
            return { status: "error", error: ERROR_MESSAGES.NO_PERMISSION_CATEGORY }
        }

        const response = await prisma.categories.create({
            data: {
                name: category.name,
                description: category.description,
                icon: category.icon,
                showInMenu: category.showInMenu,
                createdAt: new Date(Date.now()),
                userId: Session.user.id
            }, 
            select: {
                id: true, 
                name: true, 
                description: true, 
                icon: true, 
                showInMenu: true
            }
        })
        
        logger.info("Category added successfully", { categoryId: response.id });
        return { status: "success", data: response }
    } catch (error) {
        logger.error("Error adding category", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const UpdateCategory = async (category: category): Promise<ActionResult<category>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user?.id) {
            return { status: "error", error: ERROR_MESSAGES.NO_PERMISSION_CATEGORY }
        }

        const response = await prisma.categories.update({
            where: { id: category.id },
            data: {
                name: category.name,
                description: category.description,
                icon: category.icon,
                showInMenu: category.showInMenu,
            },
            select: {
                id: true, 
                name: true, 
                description: true, 
                icon: true, 
                showInMenu: true
            }
        })
        
        logger.info("Category updated successfully", { categoryId: response.id });
        return { status: "success", data: response }
    } catch (error) {
        logger.error("Error updating category", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const DeleteCategory = async (category: category): Promise<ActionResult<boolean>> => {
    try {
        const Session = await auth();
        
        if (!Session?.user?.id) {
            return { status: "error", error: ERROR_MESSAGES.NO_PERMISSION_CATEGORY }
        }

        const TaskCount = await prisma.tasks.findMany({
            where: {
                categoryId: category.id
            }
        })
        
        if (TaskCount.length > 0) {
            return { status: "error", error: ERROR_MESSAGES.CATEGORY_IN_USE(TaskCount.length) }
        }

        await prisma.categories.delete({ where: { id: category.id } })
        
        logger.info("Category deleted successfully", { categoryId: category.id });
        return { status: "success", data: true }
    } catch (error) {
        logger.error("Error deleting category", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}