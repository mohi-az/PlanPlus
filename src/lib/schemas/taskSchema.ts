import { z } from "zod";


export const TaskSchema = z.object({
    title: z.string().min(5, { message: "please enter a complete title" }),
    description: z.string().min(5, { message: "please enter a longer description." }),
    dueDate: z.union([z.string({ message: "Please choose a valid due date!" }).date(), z.null()]),
    reminderDateTime: z.union([z.string({ message: "Please choose a valid date and time!" }).datetime(), z.null()]),
    categoryId: z.union([z.string(), z.null()])
})

export type TaskSchemaType = z.infer<typeof TaskSchema>


export const CategorySchema = z.object({
    name: z.string().min(3, { message: "please enter valid name" }),
    description: z.string().min(5, { message: "please enter a longer description." }),
    icon: z.union([z.string(), z.null()]),
    showInMenu: z.boolean()
})

