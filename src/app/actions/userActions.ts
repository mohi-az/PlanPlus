"use server";
import { auth } from "@/auth";
import { CategorySchema, TaskSchema } from "@/lib/schemas/taskSchema";
import { prisma } from "@/prisma";
import type {
  ActionResult,
  MonthlyReportRow,
  TaskCategory,
  TaskMetrics,
  TaskNote,
  UserTask,
} from "@/types/domain";
import { TaskStatus } from "@/types/enums";
import { Tasks } from "@prisma/client";

const permissionError = "You are not allowed to change this resource!";

const categoryBelongsToUser = async (
  categoryId: string | null,
  userId: string,
) => {
  if (!categoryId) return true;
  return Boolean(
    await prisma.categories.findFirst({
      where: { id: categoryId, userId },
      select: { id: true },
    }),
  );
};

export const addTask = async ({
  title,
  description,
  dueDate,
  reminderDateTime,
  categoryId,
}: {
  title: string;
  description: string;
  dueDate: string | null;
  reminderDateTime: string | null;
  categoryId: string | null;
}): Promise<ActionResult<Tasks>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      const validated = TaskSchema.safeParse({
        title,
        description,
        dueDate,
        reminderDateTime,
        categoryId,
      });
      if (!validated.success)
        return { status: "error", error: validated.error.issues };
      if (
        !(await categoryBelongsToUser(
          validated.data.categoryId,
          Session.user.id,
        ))
      ) {
        return { status: "error", error: permissionError };
      }
      const reminder = validated.data.reminderDateTime
        ? {
            create: {
              remindAt: new Date(validated.data.reminderDateTime),
              isSent: false,
            },
          }
        : undefined;
      const response = await prisma.tasks.create({
        data: {
          title: validated.data.title,
          description: validated.data.description,
          dueDate: validated.data.dueDate
            ? new Date(validated.data.dueDate)
            : null,
          status: TaskStatus.Todo,
          userId: Session.user.id,
          categoryId: validated.data.categoryId,
          reminder,
        },
      });

      return { status: "success", data: response };
    } else
      return {
        status: "error",
        error: "Something went wrong. Please try again.",
      };
  } catch {
    return { status: "error", error: "Something went wrong." };
  }
};
export const updateTask = async ({
  taskId,
  title,
  description,
  dueDate,
  reminderDateTime,
  categoryId,
}: {
  taskId: string;
  title: string;
  description: string;
  dueDate: string | null;
  reminderDateTime: string | null;
  categoryId: string | null;
}): Promise<ActionResult<Tasks>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      const userId = Session.user.id;
      if (!taskId) return { status: "error", error: "Invalid task." };
      const validated = TaskSchema.safeParse({
        title,
        description,
        dueDate,
        reminderDateTime,
        categoryId,
      });
      if (!validated.success)
        return { status: "error", error: validated.error.issues };
      if (!(await categoryBelongsToUser(validated.data.categoryId, userId))) {
        return { status: "error", error: permissionError };
      }
      const response = await prisma.$transaction(async (transaction) => {
        const existingTask = await transaction.tasks.findFirst({
          where: { id: taskId, userId },
          select: { id: true, reminder: { select: { id: true } } },
        });
        if (!existingTask) return null;

        return transaction.tasks.update({
          where: { id: existingTask.id },
          data: {
            title: validated.data.title,
            description: validated.data.description,
            dueDate: validated.data.dueDate
              ? new Date(validated.data.dueDate)
              : null,
            updatedAt: new Date(),
            categoryId: validated.data.categoryId,
            reminder: validated.data.reminderDateTime
              ? {
                  upsert: {
                    create: {
                      remindAt: new Date(validated.data.reminderDateTime),
                      isSent: false,
                    },
                    update: {
                      remindAt: new Date(validated.data.reminderDateTime),
                      isSent: false,
                    },
                  },
                }
              : existingTask.reminder
                ? { delete: true }
                : undefined,
          },
        });
      });
      if (!response) return { status: "error", error: permissionError };
      return { status: "success", data: response };
    } else
      return {
        status: "error",
        error: "Something went wrong. Please try again.",
      };
  } catch {
    return { status: "error", error: "Something went wrong!" };
  }
};

export const getUserTasks = async (): Promise<ActionResult<UserTask[]>> => {
  try {
    const Session = await auth();
    if (Session?.user) {
      const tasks = await prisma.tasks.findMany({
        where: {
          userId: Session.user.id,
        },
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          description: true,
          title: true,
          dueDate: true,
          status: true,
          userId: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          reminder: {
            select: {
              remindAt: true,
              id: true,
            },
          },
        },
      });
      return { status: "success", data: tasks };
    }
    return { status: "error", error: "Authentication required." };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { status: "error", error: "Something went wrong." };
  }
};
export const deleteTask = async (
  taskId: string,
): Promise<ActionResult<null>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      const response = await prisma.tasks.deleteMany({
        where: { id: taskId, userId: Session.user.id },
      });
      if (response.count === 0)
        return { status: "error", error: permissionError };
      return { status: "success", data: null };
    } else {
      return {
        status: "error",
        error: "You are not allowed to change this task!",
      };
    }
  } catch {
    return { status: "error", error: "Something went wrong!" };
  }
};
export const changeTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  note?: string,
): Promise<ActionResult<Tasks>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      const userId = Session.user.id;
      if (!taskId || !Object.values(TaskStatus).includes(status)) {
        return { status: "error", error: "Invalid task status." };
      }
      const normalizedNote = note?.trim();
      if (normalizedNote && normalizedNote.length > 5000) {
        return { status: "error", error: "The note is too long." };
      }
      const response = await prisma.$transaction(async (transaction) => {
        const existingTask = await transaction.tasks.findFirst({
          where: { id: taskId, userId },
          select: { id: true, status: true, completeAt: true },
        });
        if (!existingTask) return null;

        return transaction.tasks.update({
          where: { id: existingTask.id },
          data: {
            status,
            completeAt:
              status === TaskStatus.Done
                ? (existingTask.completeAt ?? new Date())
                : null,
            updatedAt: new Date(),
            note: normalizedNote
              ? {
                  upsert: {
                    create: { note: normalizedNote },
                    update: { note: normalizedNote },
                  },
                }
              : undefined,
          },
        });
      });
      if (!response) return { status: "error", error: permissionError };
      return { status: "success", data: response };
    } else {
      return {
        status: "error",
        error: "You are not allowed to change this task!",
      };
    }
  } catch {
    return { status: "error", error: "Something went wrong" };
  }
};

export const getUserNotes = async (): Promise<ActionResult<TaskNote[]>> => {
  const Session = await auth();
  if (Session?.user) {
    const response = await prisma.taskNote.findMany({
      where: {
        task: {
          userId: Session.user.id,
        },
      },
      select: {
        note: true,
        id: true,
        isFavourite: true,
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            completeAt: true,
          },
        },
      },
    });

    return { status: "success", data: response };
  } else
    return { status: "error", error: "You are not allowed to see this note!" };
};

export const changeFavouriteNote = async (
  noteId: string,
): Promise<ActionResult<boolean>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      const currentTaskNote = await prisma.taskNote.findFirst({
        where: { id: noteId, task: { userId: Session.user.id } },
        select: { id: true, isFavourite: true },
      });
      if (!currentTaskNote) return { status: "error", error: permissionError };
      await prisma.taskNote.update({
        where: { id: currentTaskNote.id },
        data: { isFavourite: !currentTaskNote.isFavourite },
      });
      return { status: "success", data: true };
    }
    return { status: "error", error: "You are not allowed to see this note!" };
  } catch {
    return { status: "error", error: "Something went wrong!" };
  }
};

export const getMetrics = async (): Promise<ActionResult<TaskMetrics>> => {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return { status: "error", error: "Authentication required." };

    const now = new Date();
    const startOfWeek = new Date(now);
    const daysSinceMonday = (startOfWeek.getDay() + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    const upcomingEnd = new Date(now);
    upcomingEnd.setDate(upcomingEnd.getDate() + 5);
    const userId = session.user.id;

    const [
      totalTasks,
      completedTasks,
      completedTasksThisWeek,
      pendingTasks,
      upcomingTasks,
    ] = await prisma.$transaction([
      prisma.tasks.count({ where: { userId } }),
      prisma.tasks.count({ where: { userId, status: TaskStatus.Done } }),
      prisma.tasks.count({
        where: {
          userId,
          status: TaskStatus.Done,
          completeAt: { gte: startOfWeek, lte: now },
        },
      }),
      prisma.tasks.count({ where: { userId, status: TaskStatus.Todo } }),
      prisma.tasks.count({
        where: {
          userId,
          status: TaskStatus.Todo,
          dueDate: { gt: now, lte: upcomingEnd },
        },
      }),
    ]);

    return {
      status: "success",
      data: {
        totalTasks,
        completedTasks,
        completedTasksThisWeek,
        pendingTasks,
        upcomingTasks,
      },
    };
  } catch (error) {
    console.error("Failed to fetch task metrics:", error);
    return { status: "error", error: "Something went wrong." };
  }
};
export const getMonthlyReport = async (): Promise<
  ActionResult<MonthlyReportRow[]>
> => {
  try {
    const Session = await auth();
    const user = Session?.user?.id;
    if (user) {
      const tasks = (await prisma.$queryRaw`
                                    WITH months AS (
                                        SELECT
                                            TO_CHAR(generate_series(
                                                DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months',
                                                DATE_TRUNC('month', CURRENT_DATE),
                                                '1 month'
                                            ), 'yyyy-mm') AS month
                                    )
                                    SELECT
                                        m.month,
                                        CAST(COALESCE(SUM(CASE WHEN t.status = 'Done' THEN 1 ELSE 0 END), 0) AS INTEGER) AS "doneCount",
                                        CAST(COALESCE(SUM(CASE WHEN t.status = 'Todo' THEN 1 ELSE 0 END), 0) AS INTEGER) AS "todoCount"
                                    FROM
                                        months m
                                    LEFT JOIN
                                        "Tasks" t
                                    ON
                                        TO_CHAR(t."createdAt", 'yyyy-mm') = m.month
                                        and t."userId" = ${user}
                                    GROUP BY
                                        m.month
                                    ORDER BY
                                        m.month ASC LIMIT 6

                    `) as MonthlyReportRow[];
      return { status: "success", data: tasks };
    }
    return { status: "error", error: "Something went wrong!" };
  } catch {
    return { status: "error", error: "Something went wrong!" };
  }
};

export const getTaskCategories = async (): Promise<
  ActionResult<TaskCategory[]>
> => {
  try {
    const Session = await auth();
    if (Session?.user) {
      const response = await prisma.categories.findMany({
        where: {
          userId: Session.user.id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          showInMenu: true,
        },
      });
      return { status: "success", data: response };
    } else
      return {
        status: "error",
        error: "You don't have permission to see categories",
      };
  } catch {
    return { status: "error", error: "Something went wrong" };
  }
};
export const addCategory = async (
  category: TaskCategory,
): Promise<ActionResult<TaskCategory>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      const validated = CategorySchema.safeParse(category);
      if (!validated.success)
        return { status: "error", error: validated.error.issues };
      const response = await prisma.categories.create({
        data: {
          name: validated.data.name,
          description: validated.data.description,
          icon: validated.data.icon,
          showInMenu: validated.data.showInMenu,
          userId: Session.user.id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          showInMenu: true,
        },
      });
      return { status: "success", data: response };
    } else
      return {
        status: "error",
        error: "You don't have permission to add a category",
      };
  } catch {
    return { status: "error", error: "Something went wrong" };
  }
};
export const updateCategory = async (
  category: TaskCategory,
): Promise<ActionResult<TaskCategory>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      if (!category.id) return { status: "error", error: "Invalid category." };
      const validated = CategorySchema.safeParse(category);
      if (!validated.success)
        return { status: "error", error: validated.error.issues };
      const existingCategory = await prisma.categories.findFirst({
        where: { id: category.id, userId: Session.user.id },
        select: { id: true },
      });
      if (!existingCategory) return { status: "error", error: permissionError };
      const response = await prisma.categories.update({
        where: { id: existingCategory.id },
        data: {
          name: validated.data.name,
          description: validated.data.description,
          icon: validated.data.icon,
          showInMenu: validated.data.showInMenu,
        },
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          showInMenu: true,
        },
      });
      return { status: "success", data: response };
    } else
      return {
        status: "error",
        error: "You don't have permission to edit the category",
      };
  } catch {
    return { status: "error", error: "Something went wrong" };
  }
};
export const deleteCategory = async (
  category: TaskCategory,
): Promise<ActionResult<boolean>> => {
  try {
    const Session = await auth();
    if (Session?.user?.id) {
      if (!category.id) return { status: "error", error: "Invalid category." };
      const existingCategory = await prisma.categories.findFirst({
        where: { id: category.id, userId: Session.user.id },
        select: { id: true },
      });
      if (!existingCategory) return { status: "error", error: permissionError };
      const taskCount = await prisma.tasks.count({
        where: {
          categoryId: existingCategory.id,
          userId: Session.user.id,
        },
      });
      if (taskCount > 0)
        return {
          status: "error",
          error: `You are not allowed to delete this category because it is used by ${taskCount} tasks.`,
        };
      await prisma.categories.delete({ where: { id: existingCategory.id } });
      return { status: "success", data: true };
    } else
      return {
        status: "error",
        error: "You don't have permission to delete the category",
      };
  } catch {
    return { status: "error", error: "Something went wrong" };
  }
};
