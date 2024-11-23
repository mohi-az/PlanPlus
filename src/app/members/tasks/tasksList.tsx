'use client'
import { TasksContext } from '@/contexts/tasksContext'
import { Dialog } from '@/lib/components/Dialog';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useContext, useState, useTransition } from 'react'
import CompleteTask from './completeTask';
import TaskForm from './taskForm';

export default function UserTasksList({ userTask }: { userTask: userTasks[] }) {
    let RowNo = 1;
    const [showingModal, setShowingModal] = useState(false);
    const [dialogVisible, SetDialogVisible] = useState(false);
    const [doneFormVisible, setDoneFormVisible] = useState(false);
    const [deletebtnActive, setDeletebtnActive] = useState<string | null>(null);
    const [donebtnActive, setDonebtnActive] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<userTasks | null>(null);
    const [isPending, startTransition] = useTransition();
    const { deleteTask } = useContext(TasksContext);
    const ChangeFormVisibility = () => setShowingModal(prev => !prev)
    const DeleteHandler = useCallback(() => {
        if (selectedTask)
            startTransition(async () => {
                await deleteTask(selectedTask.id);
                setSelectedTask(null)
                return
            }
            )
    }, [selectedTask])
    const changeVisibility = () => SetDialogVisible(prev => !prev)
    const changeFormVisibility = () => setDoneFormVisible(prev => !prev)

    return (
        <div className="overflow-x-hidden">
            {userTask.length > 0 && (
                <table className="table-xs md:table-sm lg:table-md w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Title</th>
                            <th className='lg:font-semibold text-sm lg:text-lg hidden lg:table-cell'>Description</th>
                            <th className='lg:font-semibold text-sm lg:text-lg hidden lg:table-cell'>Due date</th>
                            <th className='hidden lg:table-cell' ></th>
                            <th className='lg:font-semibold text-sm lg:text-lg text-center'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userTask.map(task =>
                                <tr key={task.id} className='w-full hover h-6'>
                                    <td>{RowNo++}</td>
                                    <td className={clsx(task.status != "Done" && 'font-bold','flex flex-row gap-2 items-center')}>
                                        {<div className='cursor-pointer'  onClick={() => {
                                                setSelectedTask(task);
                                                setShowingModal(true);
                                            }}>{task.title } {<span className='lg:hidden text-xs text-gray-400'>{task.dueDate ? ` - Due date: ${new Date(task.dueDate).toDateString()}` : ''}</span>}</div>}
                                        {

                                            task.reminder && 
                                            <div className='tooltip tooltip-top hidden lg:table-cell' data-tip={'Remind at : ' +task.reminder.remindAt.toLocaleString()}>

                                                <Image src={'/images/reminderIcon.gif'} width={30} height={30} alt='reminder Icon'/>
                                            </div>
                                        }
                                    </td>
                                    <td className={clsx(task.status != "Done" && 'font-bold','hidden lg:table-cell')}> {task.description}</td>
                                    <td className='text-smX2 hidden lg:table-cell'> {task.dueDate ? new Date(task.dueDate).toDateString() : ''}</td>
                            
                                    <td className='hidden lg:table-cell'>
                                        <button className="btn btn-ghost btn-sm md:btn-md"
                                            onClick={() => {setSelectedTask(task);setShowingModal(true);}}>View / Edit</button>
                                    </td>
                                    <td >
                                        <Image className={clsx('w-7 md:w-12 m-auto', task.status === "Cancel" && 'w-5 md:w-10')}
                                        width={45} height={45} alt='stat'
                                            src={task.status === "Done" ?
                                                '/images/done.gif' : task.status === "Todo" ?
                                                    '/images/todo.gif' : '/images/cancel.gif'}
                                        /></td>
                                    <td className='flex flex-row align-middle gap-3'>{
                                        (selectedTask?.id === task.id && isPending) ?
                                            <span className="loading loading-spinner text-secondary"></span>
                                            :
                                            <div className="lg:tooltip" data-tip="Delete">
                                                <button onMouseOver={() => setDeletebtnActive(task.id)}
                                                    onMouseLeave={() => setDeletebtnActive(null)}
                                                    onClick={() => {
                                                        SetDialogVisible(true);
                                                        setSelectedTask(task)
                                                    }
                                                    }
                                                    className="btn btn-square btn-ghost ">

                                                    <Image className='w-6 md:w-9'
                                                        key={task.id + "DELETE"}
                                                        src={deletebtnActive === task.id ? '/images/delete.gif' : '/images/delete.png'}
                                                        width={35} height={45} alt='Delete IMG' />
                                                </button>
                                            </div>
                                    }
                                        {task.status === "Todo" ?
                                            (selectedTask?.id === task.id && isPending) ?
                                                <span className="loading loading-spinner text-secondary"></span>
                                                :
                                                <div className="lg:tooltip" data-tip="Mark as Done">
                                                    <button onMouseOver={() => setDonebtnActive(task.id)}
                                                        onMouseLeave={() => setDonebtnActive(null)}
                                                        onClick={() => {
                                                            setDoneFormVisible(true);
                                                            setSelectedTask(task)
                                                        }
                                                        }
                                                        className="btn btn-square btn-ghost " >

                                                        <Image className='w-9 md:w-14' key={task.id + "Done"}
                                                            src={donebtnActive === task.id ? '/images/donebtn.gif' : '/images/donebtn.png'}
                                                            width={55} height={45} alt='Done IMG' />
                                                    </button>
                                                </div>
                                            : ''
                                        }
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            )
            }
            <TaskForm task={selectedTask} ChangeFormVisibility={ChangeFormVisibility} showingModal={showingModal} />

            <CompleteTask taskId={selectedTask?.id as string} visible={doneFormVisible} changeVisibility={changeFormVisibility} />
            <Dialog confirmAction={DeleteHandler} Visibility={dialogVisible} changeVisibility={changeVisibility} ActionTitle='Delete' />
        </div>
    )
}
