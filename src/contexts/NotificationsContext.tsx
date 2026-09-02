"use client";

import {
  addUserNotification,
  getUserNotifications,
  markUserNotificationsAsRead,
} from "@/app/actions/systemAction";
import type { NotificationItem } from "@/types/domain";
import React, { createContext, useCallback, useEffect, useState } from "react";

type NotificationContextType = {
  notifications: NotificationItem[];
  refreshNotifications: () => Promise<void>;
  addNotification: (
    description: string,
    title: string,
    type: string,
  ) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const initialValues: NotificationContextType = {
  notifications: [],
  refreshNotifications: async () => undefined,
  addNotification: async () => undefined,
  markAllAsRead: async () => undefined,
};

export const NotificationContext =
  createContext<NotificationContextType>(initialValues);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshNotifications = useCallback(async () => {
    try {
      const response = await getUserNotifications();
      if (response.status === "success") setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  const addNotification = useCallback(
    async (description: string, title: string, type: string) => {
      const response = await addUserNotification(description, title, type);
      if (response.status === "success") {
        setNotifications((current) => [response.data, ...current]);
      }
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    const response = await markUserNotificationsAsRead();
    if (response.status === "success") {
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
    }
  }, []);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        refreshNotifications,
        addNotification,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
