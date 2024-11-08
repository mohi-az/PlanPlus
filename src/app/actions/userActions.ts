"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Tasks } from "@prisma/client";

export const AddTask = async ({title,description,dueDate}:{title: string,description: string,dueDate: Date}): Promise<ActionResult<Tasks>> => {
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