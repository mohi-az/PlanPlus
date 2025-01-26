"use server"
import { AddUserNotifications, GetUserAchievements } from "@/app/actions/systemAction";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Achievements, Badges } from "@prisma/client";

export async function calculateAchievements(): Promise<calculateAchievementsResponse | void> {
    const Session = await auth();
    if (!Session?.user?.id) return;
    const currentUser = await prisma.user.findUnique({ where: { id: Session.user.id } })
    if (!currentUser) return
    const newachievement: Achievements[] = [];
    let newBalge: Badges | null = null;
    const completedTasks = await prisma.tasks.findMany({
        where: {
            userId: currentUser.id,
            status: "Done",
            completeAt: { not: null },
        },
    });
    const userAchievement = await prisma.userAchievements.findMany({ where: { userId: currentUser.id } });
    const completedTaskCount = completedTasks.length;
    const achievementsToCheck = [
        {
            key: "Task Starter",
            condition: () => completedTaskCount === 1
        },
        {
            key: "Daily Dedication",
            condition: async () => await calculateStreak(currentUser.id, 7, true),
        },
        {
            key: "Weekend Warrior",
            condition: async () => await checkWeekendStreak(currentUser.id)
        },
        {
            key: "Consistent Contributor",
            condition: () => completedTaskCount === 50,
        },
        {
            key: "Task Master",
            condition: () => completedTaskCount === 100,
        },
        {
            key: "Streak Keeper",
            condition: async () => await calculateStreak(currentUser.id, 10)
        },
        {
            key: "Goal Setter",
            condition: () => completedTasks.filter(t => t.dueDate).length >= 10,
        },
        {
            key: "Night Owl",
            condition: () =>
                completedTasks.filter(t => t.completeAt && isWithinTimeRange(t.completeAt, 20, 23)).length >= 5
        },
        {
            key: "Productivity Guru",
            condition: async () => await calculateUserPoints(currentUser.id) >= 500
        },
        {
            key: "Early Bird",
            condition: () =>
                completedTasks.filter(
                    t => t.completeAt && isWithinTimeRange(t.completeAt, 5, 8)
                ).length >= 5
        },
        {
            key: "Quick Finisher",
            condition: () =>
                completedTasks.some(t => t.completeAt &&
                    t.createdAt && (new Date(t.completeAt).getTime() - new Date(t.createdAt).getTime()) / 3600000 <= 1
                )
        },
        {
            key: "Perfect Streak",
            condition: async () =>
                userAchievement.filter(t => t.achievementId === "12").length === 0 && await calculateStreak(currentUser.id, 30)
        },
        {
            key: "Weekend Finisher",
            condition: () =>
                completedTasks.filter(t => t.completeAt && isWeekend(new Date(t.completeAt))).length >= 10
        },
        {
            key: "Long-Term Planner",
            condition: () => completedTasks.filter(t => t.status === "Done" &&
                ((t.completeAt != null && t.createdAt) && ((t.completeAt.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24)) >= 30)).length === 1,
        },
        {
            key: "Five Tasks",
            condition: () => completedTaskCount === 5
        },
        {
            key: "Deadline Crusher",
            condition: () => completedTasks.filter(t => (t.completeAt && t.dueDate) && (t.completeAt < t.dueDate)).length >= 20,
        },
        {
            key: "Milestone Maker",
            condition: async () => await calculateUserPoints(currentUser.id) >= 1000
        },
        {
            key: "Creative Problem Solver",
            condition: () => completedTasks.filter(t => t.priority === 'High' && t.status === "Done").length === 5,
        },
        {
            key: "Daily Finisher",
            condition: () => true // Get a point for every tasks
        }

    ];

    // Check and award achievements
    for (const achievement of achievementsToCheck) {
        const selectedAchievement = await prisma.achievements.findFirst({ where: { name: achievement.key } })
        if (!selectedAchievement) return
        const existing = await prisma.userAchievements.findFirst({
            where: { userId: currentUser.id, achievementId: selectedAchievement.id },
        });
        if (!existing || selectedAchievement.isRepeatable) {
            if (await achievement.condition()) {
                newachievement.push(selectedAchievement); // Provide Data for result
                await prisma.userAchievements.create({
                    data: {
                        userId: currentUser.id,
                        achievementId: selectedAchievement?.id,
                        completeAt: new Date(),
                    },
                });
                if (!existing)
                    await AddUserNotifications(`Congratulations! You unlocked the '${selectedAchievement.name}' achievement! You've earned '${selectedAchievement.points}' points. Keep going to upgrade your badge!`,
                        "Achievement Unlocked!",
                        "achievement"
                    )
            }

        }
    }
    //Update user badge
    const badges = await prisma.badges.findMany();
    const response = await GetUserAchievements();
    if (response.status === "success") {
        const totalPoints = response.data
            .filter(items => items.completeAt != null)
            .map(items => items.achievements.points)
            .reduce((prevVal: number, nextVal: number) => prevVal + nextVal, 0)
        const newBadge = badges.findLast(badge => totalPoints >= badge.pointsRequired);
        if (currentUser.BadgeId != newBadge?.id) {
            await prisma.user.update({
                where: {
                    id: Session.user.id
                },
                data: {
                    BadgeId: newBadge?.id
                }
            }
            )
            newBalge = newBadge ? newBadge : null;
            await AddUserNotifications(`Amazing! You’ve earned the '${newBadge?.badgeTitle}' achievement for earning ${newBadge?.pointsRequired} points!`,
                `Badge Earned:${newBadge?.badgeTitle}`,
                "badge"
            )
        }
    }
    return { Achievement: newachievement, badge: newBalge }
}

async function checkWeekendStreak(userId: string): Promise<boolean> {
    const today = new Date();
    const lastWeekend = getPreviousWeekend(today);

    const saturdayTasks = await prisma.tasks.findMany({
        where: {
            userId,
            isAchieved: false,
            completeAt: {
                gte: lastWeekend.saturday,
                lt: lastWeekend.sunday,
            },
        },
    });
    const sundayEnd = new Date(lastWeekend.sunday);
    sundayEnd.setDate(sundayEnd.getDate() + 1); // Correctly advances to the next day
    sundayEnd.setHours(0, 0, 0, 0); // Reset time to the start of the next day

    const sundayTasks = await prisma.tasks.findMany({
        where: {
            userId,
            isAchieved: false,
            completeAt: {
                gte: lastWeekend.sunday,
                lt: sundayEnd, // Proper Date object instead of a timestamp
            },
        },
    });

    const result = saturdayTasks.length > 0 && sundayTasks.length > 0;
    // if(result)
    //     SelectedTasks = [...saturdayTasks,...saturdayTasks];
    return result

}
async function calculateStreak(userId: string, days: number, CheckforCreateTask: boolean = false): Promise<boolean> {
    const today = new Date();
    let streakCount = 0;

    for (let i = 0; i < days; i++) {
        const dayToCheck = new Date();
        dayToCheck.setDate(today.getDate() - i);

        const tasksCompleted = await prisma.tasks.findMany({
            where:
            {
                userId,
                isAchieved: false,
                OR:
                    CheckforCreateTask ?
                        [
                            {
                                status: "Todo",
                                createdAt: {
                                    gte: new Date(dayToCheck.setHours(0, 0, 0, 0)),
                                    lt: new Date(dayToCheck.setHours(23, 59, 59, 999)),
                                }
                            }]
                        : [
                            {
                                status: "Done",
                                completeAt: {
                                    gte: new Date(dayToCheck.setHours(0, 0, 0, 0)),
                                    lt: new Date(dayToCheck.setHours(23, 59, 59, 999)),
                                }
                            },
                            {
                                status: "Todo",
                                createdAt: {
                                    gte: new Date(dayToCheck.setHours(0, 0, 0, 0)),
                                    lt: new Date(dayToCheck.setHours(23, 59, 59, 999)),
                                }
                            }
                        ]
            }
        })

        if (tasksCompleted.length > 0) {
            // SelectedTasks =tasksCompleted;
            streakCount++
        }
        else break;
    }

    return streakCount >= days;
}

async function calculateUserPoints(userId: string): Promise<number> {
    const userAchievements = await prisma.userAchievements.findMany({
        where: { userId },
        include: { achievement: true }, // Include related achievement data
    });

    return userAchievements.reduce((total, ua) => total + ua.achievement.points, 0);
}

function isWithinTimeRange(date: Date, startHour: number, endHour: number): boolean {
    const hour = date.getHours();
    return hour >= startHour && hour < endHour;
}
function getPreviousWeekend(today: Date) {
    const saturday = new Date(today);
    const sunday = new Date(today);

    saturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));
    sunday.setDate(saturday.getDate() + 1);

    return { saturday, sunday };
}

function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 6 || day === 0;
}