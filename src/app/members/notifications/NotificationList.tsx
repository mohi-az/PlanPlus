"use client";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/contexts/NotificationsContext";
import clsx from "clsx";
import { Notifications } from "@prisma/client";

export default function NotificationList() {
  const { notifications, markAllAsRead } = useContext(NotificationContext);
  const [initialNotifications, setInitialNotifications] = useState<
    Notifications[]
  >([]);

  useEffect(() => {
    setInitialNotifications((current) =>
      current.length === 0 ? notifications : current,
    );
  }, [notifications]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void markAllAsRead();
    }, 3000);
    return () => clearTimeout(timer);
  }, [markAllAsRead]);

  return (
    <div className="overflow-x-auto  overflow-y-auto">
      <table className="table-xs md:table-sm lg:table-md w-full">
        {/* head */}
        <thead>
          <tr className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-lg">
            <th className="lg:font-semibold text-sm lg:text-lg">Title</th>
            <th className="lg:font-semibold text-sm lg:text-lg">Description</th>
            <th className="lg:font-semibold text-sm lg:text-lg hidden md:table-cell">
              Date
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {initialNotifications.map((notification) => (
            <tr
              key={notification.id}
              className="w-full hover h-6 overflow-y-scroll"
            >
              <td className={clsx(!notification.isRead && "font-bold")}>
                {notification.title}
              </td>
              <td> {notification.description}</td>
              <td className=" hidden md:table-cell">
                {" "}
                {new Date(notification.createdAt).toLocaleDateString()}
              </td>
              <td> {notification.isRead ? "read" : "not read"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
