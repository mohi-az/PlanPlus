"use client"

import React, { useState } from 'react'
import TaskForm from './TaskForm';

export default function AddNewTask() {
    const [showingModal, setShowingModal] = useState(false);
    const ChangeFormVisibility = () => {
        setShowingModal(prev => !prev)
    }
    return (
        <div className='w-full '>
            <button className=' btn btn-primary ' onClick={() => setShowingModal(true)} data-testid="AddTaskButton">Add new task</button>
            <TaskForm task={null} ChangeFormVisibility={ChangeFormVisibility} showingModal={showingModal} data-testid="TaskForm" />
        </div>
    )
}
