'use client'
import { TasksContext } from '@/contexts/tasksContext'
import { Dialog } from '@/lib/components/Dialog';
import { Tasks } from '@prisma/client';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useContext, useState, useTransition } from 'react'

export default function UserTasksList({ userTask }: { userTask: Tasks[] }) {

    let RowNo = 1;
    const [dialogVisible, SetDialogVisible] = useState(false);
    const [deletebtnActive, setDeletebtnActive] = useState<string | null>(null)
    const [selectedTask, setSelectedTask] = useState<string | null>();
    const [isPending, startTransition] = useTransition();
    const context = useContext(TasksContext)
    const { deleteTask } = context;
    const DeleteHandler = () => {
        if (selectedTask)
            startTransition(async () => {
                const response = await deleteTask(selectedTask);
                setSelectedTask(null)
                return
            }
            )
    }
    const changeVisibility = () => {
        SetDialogVisible(prev => !prev)
    }
    return (
        <div className="overflow-x-auto ">
            {userTask.length > 0 &&
                <table className="table ">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Task title</th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Description</th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Due date</th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userTask.map(task =>
                                <tr key={task.id} className='w-full hover h-6 overflow-y-scroll'>
                                    <td>{RowNo++}</td>
                                    <td>{task.title}</td>
                                    <td> {task.description}</td>
                                    <td> {task.dueDate ? new Date(task.dueDate).toDateString() : ''}</td>
                                    <td>
                                        <img className={clsx('w-7 md:w-14 m-auto', task.status === "Cancel" && 'w-5 md:w-10')}
                                            src={task.status === "Done" ?
                                                '/images/done.gif' : task.status === "Todo" ?
                                                    '/images/todo.gif' : '/images/cancel2.gif'}
                                        /></td>
                                    <th>
                                        <button className="btn btn-ghost btn-sm md:btn-md">View more</button>
                                    </th>
                                    <th>{
                                        (selectedTask === task.id && isPending) ?
                                            <span className="loading loading-spinner text-secondary"></span>
                                            :
                                            <button onMouseOver={() => setDeletebtnActive(task.id)}
                                                onMouseLeave={() => setDeletebtnActive(null)}
                                                onClick={() => {
                                                    SetDialogVisible(true);
                                                    setSelectedTask(task.id)
                                                }
                                                }
                                                className="btn btn-square btn-ghost ">

                                                <Image key={task.id + "DELETE"}
                                                    src={deletebtnActive === task.id ? '/images/delete.gif' : '/images/delete.png'}
                                                    width={40} height={45} alt='Delete IMG' />
                                            </button>
                                    }

                                    </th>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            }
            <Dialog confirmAction={() => DeleteHandler()} Visibility={dialogVisible} changeVisibility={changeVisibility} />
        </div>
    )
}
