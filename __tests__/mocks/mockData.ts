import type { UserTask } from "@/types/domain";

export const mockUserTasks: UserTask[] = [
  {
    id: "task-001",
    title: "Finish presentation slides",
    description: "Prepare final deck for Monday meeting",
    status: "Todo",
    category: {
      name: "Work",
      id: "cat-001",
    },
    dueDate: new Date("2025-06-24T10:00:00Z"),
    createdAt: new Date("2025-06-20T08:30:00Z"),
    userId: "user-001",
    reminder: {
      remindAt: new Date("2025-06-24T08:00:00Z"),
    },
  },
  {
    id: "task-002",
    title: "Buy groceries",
    description: null,
    status: "Done",
    category: null,
    dueDate: new Date("2025-06-22T18:00:00Z"),
    createdAt: new Date("2025-06-21T17:00:00Z"),
    userId: "user-001",
    reminder: null,
  },
  {
    id: "task-003",
    title: "Read new tech article",
    description: "Catch up on the latest React 19 features",
    status: "Todo",
    category: {
      name: "Learning",
      id: "cat-005",
    },
    dueDate: null,
    createdAt: new Date("2025-06-18T14:20:00Z"),
    userId: "user-001",
    reminder: {
      remindAt: new Date("2025-06-19T07:00:00Z"),
    },
  },
];
