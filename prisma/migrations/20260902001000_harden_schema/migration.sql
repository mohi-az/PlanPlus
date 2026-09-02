-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Todo', 'Done', 'Cancel');

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_userId_fkey";

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievements" DROP CONSTRAINT "UserAchievements_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievements" DROP CONSTRAINT "UserAchievements_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropIndex
DROP INDEX "Categories_id_key";

-- Preserve existing status values while moving the column to a database enum.
ALTER TABLE "Tasks"
ALTER COLUMN "status" TYPE "TaskStatus" USING ("status"::"TaskStatus"),
ALTER COLUMN "status" SET DEFAULT 'Todo';

-- Older rows may not have an update timestamp.
UPDATE "Tasks" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
ALTER TABLE "Tasks" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reminders" ALTER COLUMN "isSent" SET DEFAULT false;

-- AlterTable
ALTER TABLE "UserAchievements" ADD COLUMN     "awardKey" TEXT;

-- CreateIndex
CREATE INDEX "Tasks_userId_status_idx" ON "Tasks"("userId", "status");

-- CreateIndex
CREATE INDEX "Tasks_userId_dueDate_idx" ON "Tasks"("userId", "dueDate");

-- CreateIndex
CREATE INDEX "Tasks_categoryId_idx" ON "Tasks"("categoryId");

-- CreateIndex
CREATE INDEX "Categories_userId_idx" ON "Categories"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_name_key" ON "Achievements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievements_awardKey_key" ON "UserAchievements"("awardKey");

-- CreateIndex
CREATE INDEX "UserAchievements_userId_achievementId_idx" ON "UserAchievements"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "Badges_badgeTitle_key" ON "Badges"("badgeTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Badges_pointsRequired_key" ON "Badges"("pointsRequired");

-- CreateIndex
CREATE INDEX "Notifications_userId_isRead_idx" ON "Notifications"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievements" ADD CONSTRAINT "UserAchievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievements" ADD CONSTRAINT "UserAchievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
