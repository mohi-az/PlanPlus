"use server"
import { auth } from "@/auth";
import { TaskSchemaType } from "@/lib/schemas/taskSchema";
import { prisma } from "@/prisma";
import { Tasks } from "@prisma/client";

export const AddTask = async ({ title, description, dueDate }: { title: string, description: string, dueDate: Date }): Promise<ActionResult<Tasks>> => {
    try {
        console.log("Adding the Task....")
        const Session = await auth();
        console.log(Session?.user)
        if (Session?.user?.id) {
            const response = await prisma.tasks.create({
                data: {
                    title: title,
                    description: description,
                    dueDate: dueDate ? dueDate : null,
                    status: "Todo",
                    createdAt: new Date(Date.now()),
                    userId: Session.user.id
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