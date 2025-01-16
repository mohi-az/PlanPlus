"use server";
import { auth } from "@/auth";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { TasksProvider } from "@/contexts/TasksContext";
import Navbar from "@/lib/components/Navbar";
import Sidebar from "@/lib/components/Sidebar";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return (
    <div className="flex flex-col  w-full h-dvh overflow-hidden ">
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="bg-red-300 ">
        {session && <Navbar session={session} />}
      </div>
      <div className="flex flex-row h-full ">
        <TasksProvider>
          <CategoryProvider>
            <div className="z-10">
              <Suspense fallback={<div>Loading...</div>}>
                <Sidebar />
              </Suspense>
            </div>
            <div className="w-full h-full ">{children}</div>
          </CategoryProvider>
        </TasksProvider>
      </div>
    </div>
  );
}
