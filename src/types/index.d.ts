type ActionResult<T> = { status: 'success', data: T } | { status: 'error', error: string | ZodIssue[] }

type noteType = {
    id: string;
    note: string;
    isFavourite: boolean
    task: {
        title: string;
        description: string | null;
        id: string;
        status: string;
        completeAt: Date | null;
    };
}
type userTasks = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    dueDate: Date | null;
    createdAt: Date;
    userId: string;
    reminder: {
        remindAt: Date;
    } | null;
}
type tasksMetric = {
    totalTasks: Number,
    completedTasks: Number,
    completedTasksThisWeek: Number,
    pendingTasks: Number,
    upcomingTasks: Number
}

type monthlyReport = {
    month: String,
    done_count: Number,
    todo_count: Number
}