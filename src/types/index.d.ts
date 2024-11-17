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
