import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter valid E-mail address!" })
    .max(254),
  password: z
    .string()
    .min(4, { message: "Please enter your password correctly." })
    .max(128),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
