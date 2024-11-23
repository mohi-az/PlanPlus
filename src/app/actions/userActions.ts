"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { taskStatus } from "@/types/enums";
import { Tasks } from "@prisma/client";
import moment from "moment";

export const AddTask = async ({ title, description, dueDate, reminderDateTime }: { title: string, description: string, dueDate: Date, reminderDateTime: string | null }): Promise<ActionResult<Tasks>> => {
    try {
        console.log("Adding the Task....")
        const Session = await auth();
        const reminder = reminderDateTime ? { create: { remindAt: new Date(reminderDateTime), isSent: false } } : {}

        if (Session?.user?.id) {
            const response = await prisma.tasks.create({
                data: {
                    title: title,
                    description: description,
                    dueDate: dueDate ? dueDate : null,
                    status: "Todo",
                    createdAt: new Date(Date.now()),
                    userId: Session.user.id,
                    reminder
                }
            })

            return { status: "success", data: response }
        }
        else
            return { status: "error", error: "Somthing went wrong! Please try again." }

    }
    catch (error) {
        console.log(error);
        return { status: "error", error: "Somthing went wrongffff!" }
    }

}
export const UpdateTask = async ({ taskId, title, description, dueDate, reminderDateTime }: { taskId: string, title: string, description: string, dueDate: Date, reminderDateTime: string | null }): Promise<ActionResult<Tasks>> => {
    try {
        const Session = await auth();
        const reminer = await prisma.reminders.findUnique({ where: { taskId: taskId } })
        const reminder = (reminer && reminderDateTime) ? { update: { remindAt: new Date(reminderDateTime), isSent: false } } : {}

        if (Session?.user?.id) {
            const response = await prisma.tasks.update({
                where: {
                    id: taskId,
                },
                data: {
                    title: title,
                    description: description,
                    dueDate: dueDate ? dueDate : null,
                    status: "Todo",
                    createdAt: new Date(Date.now()),
                    userId: Session.user.id,
                    reminder
                }
            })
            if (reminderDateTime && reminer === null) {
                await prisma.reminders.create({
                    data: {
                        remindAt: new Date(reminderDateTime),
                        isSent: false,
                        taskId: response.id
                    }

                })
            }
            else if (reminderDateTime === null && reminer) await prisma.reminders.delete({ where: { taskId: taskId } });


            return { status: "success", data: response }
        }
        else
            return { status: "error", error: "Somthing went wrong! Please try again." }

    }
    catch (error) {
        console.log(error);
        return { status: "error", error: "Somthing went wrongffff!" }
    }

}

export const GetUserTask = async (): Promise<ActionResult<userTasks[]>> => {

    const Session = await auth();
    if (Session?.user) {
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
                status: true, userId: true,
                reminder: {
                    select:
                    {
                        remindAt: true,
                        id: true
                    }
                }
            }
        })
        if (userTasks)
            return { status: "success", data: userTasks }
        else return { status: "error", error: "There isn't any row to show" }
    }
    return { status: "error", error: "Somthing went wrong in read the tasks" }
}
export const DeleteTask = async (taskId: string): Promise<ActionResult<null>> => {
    try {

        const Session = await auth();
        if (Session?.user) {
            await prisma.tasks.delete({
                where: {
                    id: taskId,
                }
            })
            return { status: "success", data: null }
        }
        else {
            return { status: "error", error: "You are not allowed to change this task!" }
        }
    }
    catch (error) {
        return { status: "error", error: "Something went wrong!" }
    }
}
export const ChangeTaskStatus = async (taskId: string, status: string, note?: string): Promise<ActionResult<Tasks>> => {
    try {


        const Session = await auth();
        if (Session?.user) {
            const createNote = note ? { create: { note: note } } : {}
            const response = await prisma.tasks.update({

                where: { id: taskId },
                data:
                {
                    status: status,
                    completeAt: status === "Done" ? new Date(Date.now()) : null,
                    note: createNote
                }
            })
            return { status: "success", data: response }

        }
        else {
            return { status: "error", error: "You are not allowed to change this task!" }
        }
    }
    catch (error) {
        console.log(error)
        return { status: "error", error: "Something went wrong" }
    }

}


export const GetUserNotes = async (): Promise<ActionResult<noteType[]>> => {

    const Session = await auth();
    if (Session?.user) {
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

        if (response.length > 0)
            return { status: "success", data: response }
        else return { status: "error", error: "Something went wrong!" }
    }
    else
        return { status: "error", error: "You are not allowed to see this note!" }

}

export const ChangeFavNote = async (noteId: string): Promise<ActionResult<boolean>> => {

    const Session = await auth();
    if (Session?.user) {
        const currentTaskNote = await prisma.taskNote.findUnique({ where: { id: noteId }, select: { isFavourite: true } })
        await prisma.taskNote.update({
            where: {
                id: noteId
            },
            data: {
                isFavourite: {
                    set: !currentTaskNote?.isFavourite
                }
            }
        }
        )
        return { status: "success", data: true }
    }
    else {
        return { status: "error", error: "You are not allowed to see this note!" }
    }

}

export const GetMetrics = async (): Promise<ActionResult<tasksMetric>> => {
    try {
        const Session = await auth();
        if (Session?.user?.id) {
            const response = await prisma.tasks.findMany({
                where: { userId: Session?.user?.id },
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
                    completedTasks: response.filter(t => t.status === taskStatus.Done).length,
                    completedTasksThisWeek: response.filter(t => t.status === taskStatus.Done &&
                        (t.completeAt && moment(t.completeAt).weekYear === moment(Date.now()).weekYear)).length,
                    pendingTasks: response.filter(t => t.status === taskStatus.ToDo).length,
                    totalTasks: response.length,
                    upcomingTasks: response.filter(t => t.status === taskStatus.ToDo && t.dueDate &&
                        moment(t.dueDate).diff(Date.now(), 'days') > 0 && moment(t.dueDate).diff(Date.now(), 'days') < 5).length

                }
            }

        }
        else return { status: "error", error: "Something went wrong!" }
    }
    catch (error) {
        return { status: "error", error: "something went wrong!" }
    }

}
export const MonthlyReport = async (): Promise<ActionResult<monthlyReport>> => {

    const Session = await auth();
    const user = Session?.user?.id;
    if (user) {
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
    }
    else return { status: "error", error: "Something went wrong!" }
}