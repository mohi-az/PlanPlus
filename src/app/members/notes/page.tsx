"use client";
import React, { useContext } from "react";
import NotesList from "./NotesList";
import { NotesContext, NotesProvider } from "@/contexts/NotesContext";
import TableSkeleton from "@/lib/skeletons/Table";

function NotesContent() {
  const { isPending } = useContext(NotesContext);

  return (
    <div className="rounded-md p-3 bg-base-300 min-h-AdividerWithoutBTN">
      {isPending ? <TableSkeleton /> : <NotesList />}
    </div>
  );
}

export default function Notes() {
  return (
    <div className="w-full p-5 h-remain overflow-y-hidden">
      <NotesProvider>
        <NotesContent />
      </NotesProvider>
    </div>
  );
}
