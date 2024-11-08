import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(8, { message: "The name Must be 8 or more characters long" }),
    email: z.string().email({ message: "The E-mail address is required" }),
    password: z.string().min(8, { message: "The password Must be 8 or more characters long" }),
    confirmPassword: z.string({ message: "The Confirm password address is required" })
}).refine((data) => data.password === data.confirmPassword, { message: "Passwords don't match" })

export type registerSchemaType = z.infer<typeof registerSchema>
