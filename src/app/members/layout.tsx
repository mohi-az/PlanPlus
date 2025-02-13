"use server";
import { auth } from "@/auth";
import { AchievementsProvider } from "@/contexts/AchievementsContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { NotificationProvider } from "@/contexts/NotificationsContext";
import { TasksProvider } from "@/contexts/TasksContext";
import Navbar from "@/lib/components/Navbar";
import Sidebar from "@/lib/components/Sidebar";
import { SessionProvider } from "next-auth/react";
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
      <SessionProvider>
        <ToastContainer position="bottom-right" theme="dark" />
        <div className="bg-red-300 ">
          <NotificationProvider>
            {session && <Navbar />}
          </NotificationProvider>
        </div>
        <div className="flex flex-row h-full ">
          <TasksProvider>
            <CategoryProvider>
              <AchievementsProvider>
                <div className="z-10">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Sidebar />
                  </Suspense>
                </div>
                <div className="w-full h-full ">{children}</div>
              </AchievementsProvider>
            </CategoryProvider>
          </TasksProvider>
        </div>
      </SessionProvider>
    </div>
  );
}
