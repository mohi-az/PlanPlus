import { z } from "zod";


export const TaskSchema = z.object({
    title: z.string().min(5, { message: "please enter complete title" }),
    description: z.string().min(5, { message: "please enter longer description" }),
    dueDate: z.union([z.string({ message: "Please choose valid due date!" }).date(), z.null()]),
    reminderDateTime:z.union([z.string({ message: "Please choose valid date and time to reminder!" }).datetime(), z.null()])
})

export type TaskSchemaType = z.infer<typeof TaskSchema>