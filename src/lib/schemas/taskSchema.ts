import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "please enter a complete title" })
    .max(200, { message: "title is too long" }),
  description: z
    .string()
    .trim()
    .min(5, { message: "please enter a longer description." })
    .max(5000, { message: "description is too long" }),
  dueDate: z.union([
    z.string({ message: "Please choose a valid due date!" }).date(),
    z.null(),
  ]),
  reminderDateTime: z.union([
    z.string({ message: "Please choose a valid date and time!" }).datetime(),
    z.null(),
  ]),
  categoryId: z.union([z.string().min(1), z.null()]),
});

export type TaskSchemaType = z.infer<typeof TaskSchema>;

export const CategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "please enter valid name" })
    .max(100, { message: "name is too long" }),
  description: z
    .string()
    .trim()
    .min(5, { message: "please enter a longer description." })
    .max(1000, { message: "description is too long" }),
  icon: z.union([z.string().max(100), z.null()]),
  showInMenu: z.boolean(),
});
