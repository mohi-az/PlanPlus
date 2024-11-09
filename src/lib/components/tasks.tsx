'use client'
import { GetUserTask } from '@/app/actions/userActions';
import { Tasks } from '@prisma/client';
import clsx from 'clsx';
import React, { Suspense, useEffect, useState, useTransition } from 'react'
import TableSkeleton from '../skeletons/table';

export default function UserTasksList({ tasks }: { tasks: Tasks[] }) {
    let RowNo = 1;
    return (
        <div className="overflow-x-auto ">
            {tasks.length > 0 &&
                <table className="table ">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Task title</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tasks.map(task =>
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
                                        <button className="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            }
        </div>
    )
}
