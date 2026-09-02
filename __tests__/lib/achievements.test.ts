import { auth } from "@/auth";
import { calculateAchievements } from "@/lib/achievements";
import { prisma } from "@/prisma";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/prisma", () => ({ prisma: { $transaction: jest.fn() } }));

const mockedAuth = auth as jest.Mock;
const mockedTransaction = prisma.$transaction as jest.Mock;

describe("calculateAchievements", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.mockResolvedValue({ user: { id: "user-1" } });
  });

  it("awards task achievements once and updates the badge atomically", async () => {
    const now = new Date();
    const completedTask = {
      id: "task-1",
      title: "Completed task",
      description: null,
      status: "Done",
      dueDate: null,
      createdAt: now,
      updatedAt: now,
      completeAt: now,
      userId: "user-1",
      priority: null,
      categoryId: null,
      isAchieved: false,
    };
    const dailyFinisher = {
      id: "achievement-daily",
      name: "Daily Finisher",
      description: "Complete a task.",
      points: 5,
      badgeImageUrl: "",
      isRepeatable: true,
    };
    const taskStarter = {
      ...dailyFinisher,
      id: "achievement-starter",
      name: "Task Starter",
      points: 10,
      isRepeatable: false,
    };
    const transaction = {
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: "user-1", BadgeId: 1 }),
        update: jest.fn().mockResolvedValue({}),
      },
      tasks: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([completedTask])
          .mockResolvedValueOnce([
            { id: "task-1", createdAt: now, completeAt: now },
          ]),
      },
      achievements: {
        findMany: jest.fn().mockResolvedValue([dailyFinisher, taskStarter]),
      },
      userAchievements: {
        findMany: jest.fn().mockResolvedValue([]),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      badges: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            badgeTitle: "Initiate",
            pointsRequired: 0,
            badgeIconURL: "Initiate.json",
          },
          {
            id: 2,
            badgeTitle: "Rookie",
            pointsRequired: 10,
            badgeIconURL: "Rookie.json",
          },
        ]),
      },
      notifications: { create: jest.fn().mockResolvedValue({}) },
    };
    mockedTransaction.mockImplementation(
      async (callback: (client: typeof transaction) => unknown) =>
        callback(transaction),
    );

    const result = await calculateAchievements();

    expect(result).toEqual(
      expect.objectContaining({
        achievements: expect.arrayContaining([dailyFinisher, taskStarter]),
        badge: expect.objectContaining({ id: 2 }),
      }),
    );
    expect(transaction.userAchievements.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            awardKey: "user-1:achievement-daily:task-1",
          }),
        ],
        skipDuplicates: true,
      }),
    );
    expect(transaction.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { BadgeId: 2 },
    });
  });
});
