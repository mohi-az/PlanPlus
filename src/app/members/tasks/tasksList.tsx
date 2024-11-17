'use client'
import { TasksContext } from '@/contexts/tasksContext'
import { Dialog } from '@/lib/components/Dialog';
import { Tasks } from '@prisma/client';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useContext, useState, useTransition } from 'react'
import CompleteTask from './completeTask';

export default function UserTasksList({ userTask }: { userTask: Tasks[] }) {

    let RowNo = 1;
    const [dialogVisible, SetDialogVisible] = useState(false);
    const [doneFormVisible, setDoneFormVisible] = useState(false);
    const [deletebtnActive, setDeletebtnActive] = useState<string | null>(null);
    const [donebtnActive, setDonebtnActive] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<string>('');
    const [isPending, startTransition] = useTransition();
    const { deleteTask } = useContext(TasksContext)
    const DeleteHandler = useCallback(() => {
        if (selectedTask)
            startTransition(async () => {
                await deleteTask(selectedTask);
                setSelectedTask('')
                return
            }
            )
    }, [selectedTask])
    const changeVisibility = () => SetDialogVisible(prev => !prev)
    const changeFormVisibility = () => setDoneFormVisible(prev => !prev)

    return (
        <div className="overflow-x-auto ">
            {userTask.length > 0 && (
                <table className="table ">
                    <thead>
                        <tr>
                            <th></th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Task title</th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Description</th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Due date</th>
                            <th className='lg:font-semibold text-sm lg:text-lg text-center'>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userTask.map(task =>
                                <tr key={task.id} className='w-full hover h-6 overflow-y-scroll'>
                                    <td>{RowNo++}</td>
                                    <td className={clsx(task.status != "Done" && 'font-bold')}>{task.title}</td>
                                    <td className={clsx(task.status != "Done" && 'font-bold')}> {task.description}</td>
                                    <td> {task.dueDate ? new Date(task.dueDate).toDateString() : ''}</td>
                                    <td >
                                        <img className={clsx('w-7 md:w-14 m-auto', task.status === "Cancel" && 'w-5 md:w-10')}
                                            src={task.status === "Done" ?
                                                '/images/done.gif' : task.status === "Todo" ?
                                                    '/images/todo.gif' : '/images/cancel.gif'}
                                        /></td>
                                    <th>
                                        <button className="btn btn-ghost btn-sm md:btn-md">View more</button>
                                    </th>
                                    <th className='flex flex-row align-middle gap-3'>{
                                        (selectedTask === task.id && isPending) ?
                                            <span className="loading loading-spinner text-secondary"></span>
                                            :
                                            <div className="lg:tooltip" data-tip="Delete">
                                                <button onMouseOver={() => setDeletebtnActive(task.id)}
                                                    onMouseLeave={() => setDeletebtnActive(null)}
                                                    onClick={() => {
                                                        SetDialogVisible(true);
                                                        setSelectedTask(task.id)
                                                    }
                                                    }
                                                    className="btn btn-square btn-ghost ">

                                                    <Image unoptimized={true}
                                                        key={task.id + "DELETE"}
                                                        src={deletebtnActive === task.id ? '/images/delete.gif' : '/images/delete.png'}
                                                        width={35} height={45} alt='Delete IMG' />
                                                </button>
                                            </div>
                                    }
                                        {task.status === "Todo" ?
                                            (selectedTask === task.id && isPending) ?
                                                <span className="loading loading-spinner text-secondary"></span>
                                                :
                                                <div className="lg:tooltip" data-tip="Mark as Done">
                                                    <button onMouseOver={() => setDonebtnActive(task.id)}
                                                        onMouseLeave={() => setDonebtnActive(null)}
                                                        onClick={() => {
                                                            setDoneFormVisible(true);
                                                            setSelectedTask(task.id)
                                                        }
                                                        }
                                                        className="btn btn-square btn-ghost " >

                                                        <Image unoptimized={true} key={task.id + "Done"}
                                                            src={donebtnActive === task.id ? '/images/donebtn.gif' : '/images/donebtn.png'}
                                                            width={55} height={45} alt='Done IMG' />
                                                    </button>
                                                </div>
                                            : ''
                                        }
                                    </th>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            )
            }
            <CompleteTask taskId={selectedTask} visible={doneFormVisible} changeVisibility={changeFormVisibility} />
            <Dialog confirmAction={DeleteHandler} Visibility={dialogVisible} changeVisibility={changeVisibility} ActionTitle='Delete' />
        </div>
    )
}
