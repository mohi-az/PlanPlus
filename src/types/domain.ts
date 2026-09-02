import type { ZodIssue } from "zod";

export type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };

export type TaskNote = {
  id: string;
  note: string;
  isFavourite: boolean;
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    completeAt: Date | null;
  };
};

export type UserTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: { id: string; name: string } | null;
  dueDate: Date | null;
  createdAt: Date;
  userId: string;
  reminder: { remindAt: Date } | null;
};

export type TaskMetrics = {
  totalTasks: number;
  completedTasks: number;
  completedTasksThisWeek: number;
  pendingTasks: number;
  upcomingTasks: number;
};

export type MonthlyReportRow = {
  month: string;
  doneCount: number;
  todoCount: number;
};

export type TaskCategory = {
  id?: string;
  name: string;
  description: string | null;
  icon: string | null;
  showInMenu: boolean;
};

export type BadgeDetails = {
  id: number;
  badgeTitle: string;
  pointsRequired: number;
  badgeIconURL: string;
};

export type AchievementDetails = {
  id: string;
  name: string;
  description: string;
  points: number;
  badgeImageUrl: string;
  isRepeatable: boolean;
};

export type UserAchievement = {
  id: string;
  completeAt: Date | null;
  count: number;
  achievements: AchievementDetails;
};

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
  type: string;
};

export type CalculateAchievementsResult = {
  badge: BadgeDetails | null;
  achievements: AchievementDetails[];
};
