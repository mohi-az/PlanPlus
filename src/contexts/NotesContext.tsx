"use client";
import { changeFavouriteNote, getUserNotes } from "@/app/actions/userActions";
import type { ActionResult, TaskNote } from "@/types/domain";
import React, { createContext, useCallback, useEffect, useState } from "react";

type NotesContextType = {
  notes: TaskNote[];
  changeFavourite: (noteId: string) => Promise<ActionResult<boolean>>;
  isPending: boolean;
};
const notesContextInitial: NotesContextType = {
  notes: [],
  changeFavourite: async () => ({ status: "error", error: "" }),
  isPending: false,
};
export const NotesContext = createContext(notesContextInitial);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [isPending, setIsPending] = useState(false);

  const getNotes = useCallback(async () => {
    setIsPending(true);
    try {
      const response = await getUserNotes();
      if (response.status === "success") setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsPending(false);
    }
  }, []);
  const changeFavourite = useCallback(
    async (noteId: string): Promise<ActionResult<boolean>> => {
      const response = await changeFavouriteNote(noteId);
      if (response.status === "success") {
        setNotes((current) =>
          current.map((note) =>
            note.id === noteId
              ? { ...note, isFavourite: !note.isFavourite }
              : note,
          ),
        );
      }
      return response;
    },
    [],
  );
  useEffect(() => {
    void getNotes();
  }, [getNotes]);
  return (
    <NotesContext.Provider value={{ notes, isPending, changeFavourite }}>
      {children}
    </NotesContext.Provider>
  );
};
