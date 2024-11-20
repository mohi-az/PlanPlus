import React, { useActionState, useContext } from 'react'
import ModalForm from '@/lib/components/modalForm'
import { TaskSchema } from '@/lib/schemas/taskSchema';
import { TasksContext } from '@/contexts/tasksContext';
export default function TaskForm({ task, ChangeFormVisibility, showingModal }:
    { task: userTasks | null, ChangeFormVisibility: () => void, showingModal: boolean }) {
    const { addTask, updateTask } = useContext(TasksContext);
    const [status, addNewTask, isPending] = useActionState(
        async (__preState: any, formData: FormData) => {
            const dueDate = formData.get('dueDate')?.toString();
            const reminderDate = formData.get('reminderDate');
            const reminderTime = formData.get('reminderTime');
            var reminder = null;
            if (reminderDate && reminderTime)
                reminder = new Date(reminderDate?.toString() + 'T' + reminderTime?.toString());
            const validatedData = TaskSchema.safeParse({
                title: formData.get('title'),
                description: formData.get('description'),
                dueDate: dueDate ? new Date(dueDate) : null,
                reminderDateTime: reminder ? new Date(reminder).toISOString() : null
            });

            if (!validatedData.success)
                return validatedData.error.issues;
            if (task != null) {
                await updateTask(validatedData.data, task.id);
                ChangeFormVisibility();
            }
            else {
                const response = await addTask(validatedData.data);
                ChangeFormVisibility();

                if (response && response.status === "error")
                    return response.error
            }

        }, null
    )
    return (
        <div>   <ModalForm title='Add New Task' isVisible={showingModal}>
            <form className='w-full' action={addNewTask}>
                <div >
                    <div className="label">
                        <span className="label-text font-bold">Title</span>
                    </div>
                    <input type="text" name='title' className="input input-bordered w-full input-sm md:input-md"
                        aria-label="Task title" defaultValue={task ? task.title : undefined} />

                    <div className="label">
                        <span className="label-text">Description</span>
                    </div>
                    <input type="text" name='description' className="input input-bordered w-full input-sm md:input-md"
                        aria-label="Task description" defaultValue={task?.description ? task.description : undefined} />

                    <div className="label">
                        <span className="label-text">Due date</span>
                    </div>
                    <input type="date" name='dueDate' className="input input-bordered w-full input-sm md:input-md"
                        aria-label="Task due date" defaultValue={task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined} />
                    <div className="bg-violet-200  collapse mt-3">
                        <input type="checkbox" className="peer" />
                        <div
                            className="collapse-title bg-accent text-primary-content peer-checked:bg-primary peer-checked:text-secondary-content">
                            Set a reminder
                        </div>
                        <div
                            className="collapse-content bg-pink-300 text-primary-content peer-checked:bg-primary 
                    peer-checked:text-secondary-content
                    flex flex-row justify-items-end">
                            <div className='w-2/3 flex flex-row gap-1 justify-center items-end'>

                                <input type='date' name='reminderDate' className="input text-white input-bordered w-full input-sm md:input-md"
                                    aria-label="Task due date" defaultValue={(task?.reminder) ? new Date(task.reminder?.remindAt).toISOString().split('T')[0] : undefined} />
                                <input type='time' name='reminderTime' className="input text-white input-bordered w-full input-sm md:input-md"
                                    aria-label="Task due date"
                                    defaultValue={(task?.reminder) ? new Date(task.reminder?.remindAt).toLocaleTimeString([], {
                                        hour: "2-digit", minute: "2-digit",
                                        hour12: false
                                    }) : "08:00"} />
                            </div>
                            <div className='w-1/3 justify-items-center align-top'>

                                <img src={"/images/reminder.gif"} width={150} height={80} alt='Reminder' />
                            </div>
                        </div>
                    </div>
                    <div className='pt-5 w-full flex flex-row gap-4'>
                        <button type='submit' className="btn btn-success  w-1/2 flex flex-row" disabled={isPending}>
                            {isPending && <span className={"loading loading-spinner"}></span>}
                            {task ? 'Update' : 'Add Task'}</button>
                        <button type='reset' className=' btn btn-neutral w-1/2' onClick={() => ChangeFormVisibility()}>Close</button>
                    </div>
                    <div className='text-sm md:text-base  flex flex-col pt-5'>

                        {typeof (status) === "string" ? status.toString()
                            : status && status.map(issue => <span key={issue.message} className='text-orange-300 text-left'>- {issue.message}</span>)}
                    </div>
                </div>
            </form>
        </ModalForm></div>
    )
}
