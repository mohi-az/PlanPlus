'use client'
import { TasksContext } from '@/contexts/tasksContext'
import ModalForm from '@/lib/components/modalForm'
import { Tasks } from '@prisma/client';
import React, { useActionState, useContext } from 'react'

export default function CompleteTask({ taskId, visible, changeVisibility }: { taskId: string, visible: boolean, changeVisibility: () => void, }) {
    const { doneTask } = useContext(TasksContext);
    const [state, changeStatus, isPending] = useActionState(
        async (prevState: any, formData: FormData): Promise<ActionResult<Tasks>> => {
            const note = formData.get("note")?.toString();
            const response = await doneTask(taskId, note && note);
            if (response.status = "success") {
                changeVisibility();
                return response
            }
            else return { status: "error", error: "Something went wrong!" }
        }, null
    )
    return (
        <div>
            <ModalForm title='Mark as Done' isVisible={visible}>
                <form className='w-full' action={changeStatus} >
                    <div >
                        <div className="label">
                            <span className="label-text font-bold">Note</span>
                        </div>
                        <textarea name='note' className="textarea   textarea-bordered w-full textarea-sm md:textarea-md"
                            aria-label="Task Note" />
                        <div className='pt-5 w-full flex flex-row gap-4'>
                            <button type='submit' className="btn btn-success  w-1/2 flex flex-row" disabled={isPending}>
                                {isPending && <span className={"loading loading-spinner"}></span>}
                                Complete</button>
                            <button type='reset' className=' btn btn-neutral w-1/2' onClick={() => changeVisibility()}>Close</button>
                        </div>
                        <div className='text-sm md:text-base  flex flex-col pt-5'>
                            { state && status.toString()}
                        </div>
                    </div>
                </form>
            </ModalForm>
        </div>
    )
}
