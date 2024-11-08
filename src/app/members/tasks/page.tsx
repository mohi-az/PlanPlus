"use client"
import { AddTask } from '@/app/actions/userActions';
import ModalForm from '@/lib/components/modalForm'
import { TaskSchema } from '@/lib/schemas/taskSchema';
import clsx from 'clsx';
import React, { useActionState, useState } from 'react'

export default function Tasks() {
    const [modalShow, setModalShow] = useState(false);
    const [status, addNewTask, isPending] = useActionState(
        async (preState: any, formData: FormData) => {
            const dueDate = formData.get('dueDate')?.toString();
            const validatedData = TaskSchema.safeParse({
                title: formData.get('title'), description: formData.get('description'),
                dueDate: dueDate ? new Date(dueDate) : null
            });
            if (validatedData.success) {
                const response = await AddTask(validatedData.data);
                if (response.status === "success") {
                    setModalShow(false);
                    return null
                }
                else {
                    setModalShow(false);
                    return response.error
                }
            }
            return validatedData.error.issues

        }, null
    )
    return (
        <div className='w-full p-5'>
            <button className=' btn btn-primary w-1/12' onClick={() => setModalShow(true)}>Add new task</button>
            <ModalForm title='Add New Task' isVisible={modalShow}>
                <form method="dialog" className='w-full' action={addNewTask}>
                    <div >
                        <div className="label">
                            <span className="label-text">Title</span>
                        </div>
                        <input type="text" name='title' className="input input-bordered w-full input-sm md:input-md" />

                        <div className="label">
                            <span className="label-text">Description</span>
                        </div>
                        <input type="text" name='description' className="input input-bordered w-full input-sm md:input-md" />

                        <div className="label">
                            <span className="label-text">Due Date</span>
                        </div>
                        <input type="date" name='dueDate' className="input input-bordered w-full input-sm md:input-md" />

                        <div className='pt-5 w-full flex flex-row gap-4'>
                            <button type='submit' className="btn btn-primary  w-1/2 flex flex-row" disabled={isPending}>
                                {isPending && <span className={clsx("loading loading-spinner", { "invisible": !isPending })}>  </span>}
                                Add Task</button>
                            <button className=' btn btn-secondary w-1/2' onClick={() => setModalShow(false)}>Close</button>
                        </div>
                        <div className='text-sm md:text-base  flex flex-col pt-5'>

                            {/* {error && error.map(issue => <span className='text-orange-300 text-left'>- {issue.message}</span>)} */}
                        </div>
                    </div>
                </form>
            </ModalForm>
        </div>
    )
}
