"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Tasks } from "@prisma/client";

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

export const GetUserTask = async (): Promise<ActionResult<Tasks[]>> => {

    const Session = await auth();
    if (Session?.user) {
        const userTasks = await prisma.tasks.findMany({
            where: {
                userId: Session.user.id
            }
            , orderBy: {
                id: "desc"
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
            const response = await prisma.tasks.delete({
                where: {
                    id: taskId,
                }
            })
            return { status: "success", data: null }
        }
        else {
            return { status: "error", error: "You aren't allow to delete this task !" }
        }
    }
    catch (error) {
        return { status: "error", error: "Something wents wrong!" }
    }
}