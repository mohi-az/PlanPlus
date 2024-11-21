"use client"
import { NotesContext } from '@/contexts/notesContext';
import Image from 'next/image';
import React, { useCallback, useContext, useState, useTransition } from 'react'

export default function NotesList() {
    let RowNo = 1;
    const [isPending, startTransition] = useTransition();
    const { notes, ChangeFav } = useContext(NotesContext);
    const [selectedNote, setSelectedNote] = useState("");
    const [favBTNActive, setFavBTNActive] = useState<string | null>(null);

    const ChangeFavFlag = useCallback((noteId: string) => {
        startTransition(async () => {
            await ChangeFav(noteId)
            setSelectedNote('')
            setFavBTNActive(null)
            return
        })
    }, [ChangeFav])
    return (
        <div className="overflow-x-auto  overflow-y-auto">
            <table className="table ">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th className='lg:font-semibold text-sm lg:text-lg'>note</th>
                        <th className='lg:font-semibold text-sm lg:text-lg'>Task Title</th>
                        <th className='lg:font-semibold text-sm lg:text-lg'>Description</th>
                        <th className='lg:font-semibold text-sm lg:text-lg'>Complete date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {notes &&
                        notes.map(note =>
                            <tr key={note.id} className='w-full hover h-6 overflow-y-scroll'>
                                <td>{RowNo++}</td>
                                <td>{note.note}</td>
                                <td> {note.task.title}</td>
                                <td> {note.task.description}</td>
                                <td> {note.task.completeAt ? new Date(note.task.completeAt).toDateString() : ''}</td>
                                <td>
                                    <div className='md:tooltip-top' data-tip="Mark as Favourite">
                                        {isPending && selectedNote === note.id ?
                                            <div className='loading  loading-spinner text-info'></div>
                                            :
                                            <Image unoptimized={true} src={
                                                note.isFavourite ?
                                                    "/images/favNote.png" :
                                                    favBTNActive === note.id ? "/images/favNote.gif" : "/images/favNoteGray.png"
                                            }
                                                width={30} height={35} alt='Favourite Icon'
                                                className='cursor-pointer'
                                                onClick={() => {
                                                    ChangeFavFlag(note.id)
                                                    setSelectedNote(note.id)
                                                }}
                                                onMouseOver={() => {

                                                    setFavBTNActive(note.id)
                                                }}
                                                onMouseLeave={() => {

                                                    setFavBTNActive('')
                                                }}
                                            />

                                        }
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
