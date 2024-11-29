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
    category: {
        name:string,
        id:string
    }| null;
    dueDate: Date | null;
    createdAt: Date;
    userId: string;
    reminder: {
        remindAt: Date;
    } | null;
}
type tasksMetric = {
    totalTasks: number,
    completedTasks: number,
    completedTasksThisWeek: number,
    pendingTasks: number,
    upcomingTasks: number
}

type monthlyReport = {
    month: string,
    done_count: number,
    todo_count: number
}
type category = {
    name: string;
    id?: string;
    description: string | null;
    icon: string | null;
    showInMenu: boolean;
}