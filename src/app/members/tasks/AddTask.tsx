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
            <button className=' btn btn-primary ' onClick={() => setShowingModal(true)}>Add new task</button>
            <TaskForm task={null} ChangeFormVisibility={ChangeFormVisibility} showingModal={showingModal} />
        </div>
    )
}
