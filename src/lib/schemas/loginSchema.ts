import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Please enter valid E-mail address!" }),
    password: z.string().min(4,{message:"Please enter your password correctly."})
})

export type LoginSchemaType = z.infer<typeof LoginSchema>