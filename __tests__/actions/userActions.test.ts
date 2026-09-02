import { auth } from "@/auth";
import { prisma } from "@/prisma";
import {
  changeFavouriteNote,
  deleteTask,
  getMetrics,
  updateTask,
} from "@/app/actions/userActions";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    categories: { findFirst: jest.fn() },
    taskNote: { findFirst: jest.fn(), update: jest.fn() },
    tasks: { count: jest.fn(), deleteMany: jest.fn(), findMany: jest.fn() },
  },
}));

const mockedAuth = auth as jest.Mock;
const mockedPrisma = prisma as unknown as {
  $transaction: jest.Mock;
  categories: { findFirst: jest.Mock };
  taskNote: { findFirst: jest.Mock; update: jest.Mock };
  tasks: { count: jest.Mock; deleteMany: jest.Mock; findMany: jest.Mock };
};

describe("user server actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPrisma.$transaction.mockReset();
    mockedAuth.mockResolvedValue({ user: { id: "user-1" } });
  });

  it("scopes task deletion to the authenticated user", async () => {
    mockedPrisma.tasks.deleteMany.mockResolvedValue({ count: 0 });

    const result = await deleteTask("another-users-task");

    expect(result.status).toBe("error");
    expect(mockedPrisma.tasks.deleteMany).toHaveBeenCalledWith({
      where: { id: "another-users-task", userId: "user-1" },
    });
  });

  it("does not reset status, owner, or creation time while editing a task", async () => {
    const transaction = {
      tasks: {
        findFirst: jest
          .fn()
          .mockResolvedValue({ id: "task-1", reminder: null }),
        update: jest.fn().mockResolvedValue({ id: "task-1" }),
      },
    };
    mockedPrisma.$transaction.mockImplementation(
      async (callback: (tx: typeof transaction) => unknown) =>
        callback(transaction),
    );

    const result = await updateTask({
      taskId: "task-1",
      title: "Updated task",
      description: "Updated description",
      dueDate: null,
      reminderDateTime: null,
      categoryId: null,
    });

    expect(result.status).toBe("success");
    expect(transaction.tasks.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "task-1", userId: "user-1" },
      }),
    );
    const updateData = transaction.tasks.update.mock.calls[0][0].data;
    expect(updateData).not.toHaveProperty("status");
    expect(updateData).not.toHaveProperty("createdAt");
    expect(updateData).not.toHaveProperty("userId");
  });

  it("does not allow toggling another user's note", async () => {
    mockedPrisma.taskNote.findFirst.mockResolvedValue(null);

    const result = await changeFavouriteNote("note-1");

    expect(result.status).toBe("error");
    expect(mockedPrisma.taskNote.update).not.toHaveBeenCalled();
    expect(mockedPrisma.taskNote.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "note-1", task: { userId: "user-1" } },
      }),
    );
  });

  it("counts only completions from the current week", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-09-02T12:00:00.000Z"));
    mockedPrisma.$transaction.mockResolvedValue([2, 2, 1, 0, 0]);

    const result = await getMetrics();

    expect(result).toEqual(
      expect.objectContaining({
        status: "success",
        data: expect.objectContaining({
          completedTasks: 2,
          completedTasksThisWeek: 1,
        }),
      }),
    );
    expect(mockedPrisma.tasks.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "Done",
          completeAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      }),
    );
    jest.useRealTimers();
  });
});
