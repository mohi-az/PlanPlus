import { z } from "zod";


export const TaskSchema = z.object({
    title: z.string().min(5, { message: "please enter complete title" }),
    description: z.string().min(5, { message: "please enter longer description" }),
    dueDate: z.date(),
    
})

export type TaskSchemaType = z.infer<typeof TaskSchema>
//  & {
//     status: "ToDo"| "Done"| "Cancel"
// }
