import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(8, { message: "The name Must be 8 or more characters long" })
      .max(100),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "The E-mail address is required" })
      .max(254),
    password: z
      .string()
      .min(8, { message: "The password Must be 8 or more characters long" })
      .max(128),
    confirmPassword: z.string({
      message: "The Confirm password address is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

export type registerSchemaType = z.infer<typeof registerSchema>;
