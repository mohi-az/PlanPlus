"use server"
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { Badges, Notifications } from "@prisma/client"

export const AddLog = async ({ detail, type, url }: { detail: string, type: string, url: string }) => {

    const response = await prisma.logs.create({
        data: {
            detail,
            type,
            url
        }
    })
    return response
}
export const GetBadge = async (id: number): Promise<ActionResult<Badges>> => {
    const response = await prisma.badges.findFirst({ where: { id } })
    if (response) return { status: "success", data: response }
    else return { status: "error", error: "Something went wrong!" }
}
export const GetAllBadge = async (): Promise<ActionResult<Badges[]>> => {
    const Session = await auth();

    if (Session?.user) {
        const response = await prisma.badges.findMany()
        if (response) return { status: "success", data: response }
        else return { status: "error", error: "Something went wrong!" }
    }
    else
        return { status: "error", error: "Something went wrong!" }
}
export const GetUserBadge = async (): Promise<ActionResult<Badges>> => {
    const Session = await auth();
    if (Session?.user) {
        const currentUser = await prisma.user.findUnique({ where: { id: Session.user.id } })
        const response = await prisma.badges.findFirst({ where: { id: currentUser?.BadgeId } })
        if (response) return { status: "success", data: response }
        else return { status: "error", error: "Something went wrong!" }
    }
    else
        return { status: "error", error: "Something went wrong!" }
}
export const GetUserAchievements = async (): Promise<ActionResult<UserAchievementsType[]>> => {
    const Session = await auth();
    if (Session?.user) {
        const response = await prisma.userAchievements.findMany(
            {
                where: { userId: Session.user.id },
                select: {
                    id: true,
                    completeAt: true,
                    achievement: true
                }
            }
        )
        if (response) {
            const allAchievements = await prisma.achievements.findMany();
            const mergedAchievements = allAchievements.map((achievement) => {
                const userAchievement = response.filter((res) => res.achievement.id === achievement.id);
                return {
                    id: userAchievement.length > 0 ? userAchievement[0].id : '',
                    completeAt: userAchievement.length > 0 ? userAchievement[userAchievement.length - 1].completeAt : null,
                    count: userAchievement.length,
                    achievements: {
                        id: achievement.id,
                        name: achievement.name,
                        description: achievement.description,
                        points: achievement.points,
                        badgeImageUrl: achievement.badgeImageUrl,
                        isRepeatable: achievement.isRepeatable
                    }
                };
            });
            return { status: "success", data: mergedAchievements.sort((a, b) => a.achievements.points - b.achievements.points) }

        }
        else return { status: "error", error: "Something went wrong!" }

    }
    else
        return { status: "error", error: "Something went wrong!" }
}

export const GetUserNotifications = async (): Promise<ActionResult<Notifications[]>> => {

    const Session = await auth();
    if (Session?.user?.id) {
        const response = await prisma.notifications.findMany({
            where: {
                userId: Session.user.id
            }
        })
        return { status: "success", data: response }
    }
    else
        return { status: "error", error: "Something went wrong!" }

}
export const AddUserNotifications = async (description: string, title: string, type: string): Promise<ActionResult<Notifications>> => {

    const Session = await auth();
    if (Session?.user?.id) {
        const response = await prisma.notifications.create({
            data: {
                description,
                title,
                createdAt: new Date(Date.now()),
                isRead: false,
                userId: Session.user.id,
                type
            }
        })
        return { status: "success", data: response }
    }
    else
        return { status: "error", error: "Something went wrong!" }

}
export const ChangeUserNotificationStatus = async () => {

    const Session = await auth();
    if (Session?.user?.id) {
         await prisma.notifications.updateMany({
            where:{userId:Session.user.id},
            data: {
                isRead: true,
            }
        })
        return { status: "success" }
    }
    else
        return { status: "error", error: "Something went wrong!" }

}