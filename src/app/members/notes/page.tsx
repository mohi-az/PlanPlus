"use client"
import React, { useContext } from 'react'
import NotesList from './notesList'
import { NotesContext, NotesProvider } from '@/contexts/notesContext'
import TableSkeleton from '@/lib/skeletons/table'

export default function Notes() {
    const { isPending } = useContext(NotesContext)
    return (
        <div className='w-full p-5 h-remain overflow-y-hidden'>
            <NotesProvider>
                <div className=" rounded-md p-3 bg-base-300  min-h-AdividerWithoutBTN"  >
                    {isPending ? <TableSkeleton />
                        :
                        <NotesList />
}
                </div>
            </NotesProvider>
        </div>
    )
}
