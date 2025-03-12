'use client'
import { TasksContext } from '@/contexts/TasksContext'
import { Dialog } from '@/lib/components/Dialog';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useState, useTransition } from 'react'
import CompleteTask from './CompleteTask';
import TaskForm from './TaskForm';
import statDone from '@/assets/lotties/stat-done.json'
import statTodo from '@/assets/lotties/stat-todo.json'
import statCancel from '@/assets/lotties/stat-cancel.json'
import LottieAnimation from '@/lib/components/Lottie';

export default function UserTasksList({ userTask, filteredTasks }: { userTask: userTasks[], filteredTasks: userTasks[] | null }) {
    const [tasksList, setTasksList] = useState<userTasks[]>(userTask);
    const [showingModal, setShowingModal] = useState(false);
    const [dialogVisible, SetDialogVisible] = useState(false);
    const [doneFormVisible, setDoneFormVisible] = useState(false);
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
    const changeVisibility = useCallback(() => SetDialogVisible(prev => !prev), [])
    const changeFormVisibility = useCallback(() => setDoneFormVisible(prev => !prev), [])
    useEffect(() => {
        if (filteredTasks === null) setTasksList(userTask)
        else
            setTasksList(filteredTasks)
    }, [filteredTasks, userTask])
    return (
        <div className="overflow-x-hidden">
            {tasksList.length > 0 ?
                <div>
                    <table className="table-xs md:table-sm lg:table-md w-full">
                        <thead>
                            <tr className='bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-lg'>
                                <th></th>
                                <th className='lg:font-semibold text-sm lg:text-lg'>Title</th>
                                <th className='lg:font-semibold text-sm lg:text-lg hidden lg:table-cell'>Description</th>
                                <th className='lg:font-semibold text-sm lg:text-lg hidden lg:table-cell'>Category</th>
                                <th className='lg:font-semibold text-sm lg:text-lg hidden lg:table-cell'>Due date</th>
                                <th className='hidden lg:table-cell'></th>
                                <th className='lg:font-semibold text-sm lg:text-lg text-center'>Status</th>
                                <th></th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasksList.map((task, index) =>
                                    <tr key={task.id} className='w-full hover h-6'>
                                        <td>{index + 1}</td>
                                        <td className={clsx(task.status != "Done" && 'font-bold', 'flex flex-row gap-2 items-center')}>
                                            {<div className='cursor-pointer' onClick={() => {
                                                setSelectedTask(task);
                                                setShowingModal(true);
                                            }}>{task.title} {<span className='lg:hidden text-xs text-gray-400'>{task.dueDate ? ` - Due date: ${new Date(task.dueDate).toDateString()}` : ''}</span>}</div>}
                                            {

                                                task.reminder &&
                                                <div className='tooltip tooltip-top hidden lg:table-cell' data-tip={'Remind at : ' + task.reminder.remindAt.toLocaleString()}>
                                                    <Image src={'/images/reminderIcon.gif'} width={30} height={30} alt='reminder Icon' />
                                                </div>
                                            }
                                        </td>
                                        <td className={clsx(task.status != "Done" && 'font-bold', 'hidden lg:table-cell')}> {task.description}</td>
                                        <td className={clsx(task.status != "Done" && 'font-bold', 'hidden lg:table-cell')}>{task.category?.name}</td>
                                        <td className='text-smX2 hidden lg:table-cell'> {task.dueDate ? new Date(task.dueDate).toDateString() : ''}</td>

                                        <td className='hidden lg:table-cell'>
                                            <button className="btn btn-ghost btn-sm md:btn-md"
                                                onClick={() => { setSelectedTask(task); setShowingModal(true); }}>View / Edit</button>
                                        </td>
                                        <td >
                                            <LottieAnimation loop={false} delayLoop={true} className={clsx('w-7 md:w-12 m-auto', task.status === "Cancel" && 'w-11 md:w-18')}
                                                animationData={task.status === "Done" ?
                                                    statDone : task.status === "Todo" ?
                                                        statTodo : statCancel}
                                            /></td>
                                        <td className='flex flex-row align-middle gap-3'>{
                                            (selectedTask?.id === task.id && isPending) ?
                                                <span className="loading loading-spinner text-secondary"></span>
                                                :
                                                <div className="lg:tooltip" data-tip="Delete">
                                                    <button
                                                        onClick={() => {
                                                            SetDialogVisible(true);
                                                            setSelectedTask(task)
                                                        }
                                                        }
                                                        className="btn btn-square btn-ghost cursor-pointer ">
                                                        <Image className='w-6 md:w-9' key={task.id + "DELETE"} src={'/images/delete.png'} width={35} height={45} alt='Delete IMG' />
                                                    </button>
                                                </div>
                                        }
                                            {task.status === "Todo" ?
                                                (selectedTask?.id === task.id && isPending) ?
                                                    <span className="loading loading-spinner text-secondary"></span>
                                                    :
                                                    <div className="lg:tooltip" data-tip="Mark as Done">
                                                        <button onClick={() => {
                                                            setDoneFormVisible(true);
                                                            setSelectedTask(task)
                                                        }
                                                        }
                                                            className="btn btn-square btn-ghost " >

                                                            <Image className='w-9 md:w-14' key={task.id + "Done"} src={'/images/donebtn.png'}
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
                    <div className="join">
                        <button className="join-item btn">1</button>
                        <button className="join-item btn">2</button>
                        <button className="join-item btn btn-disabled">...</button>
                        <button className="join-item btn">99</button>
                        <button className="join-item btn">100</button>
                    </div></div>
                : <div className='w-full text-center pt-10'>
                    There are no tasks to display.
                </div>

            }
            <TaskForm task={selectedTask} ChangeFormVisibility={ChangeFormVisibility} showingModal={showingModal} />
            <CompleteTask taskId={selectedTask?.id as string} visible={doneFormVisible} changeVisibility={changeFormVisibility} />
            <Dialog confirmAction={DeleteHandler} Visibility={dialogVisible} changeVisibility={changeVisibility} ActionTitle='Delete' />
        </div>
    )
}
