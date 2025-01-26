"use client"
import { AddLog, AddUserNotifications, ChangeUserNotificationStatus, GetUserNotifications } from '@/app/actions/systemAction'
import { Notifications } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React, { createContext, useEffect, useState } from 'react'
type NotificationType = {
    notifications: Notifications[],
    getNotifications: () => Promise<void>
    AddNotifications: (description: string, title: string, type: string) => Promise<void>
    ChangeStatus: () => void
}

const NotificationInitialValues: NotificationType = { notifications: [], getNotifications: async () => { }, AddNotifications: async () => { }, ChangeStatus: () => { } }

export const NotificationContext = createContext(NotificationInitialValues);
export const NotificationProvider = ({ children }: { children: React.ReactElement }) => {
    const path=usePathname();
    const [notifications, setNotifications] = useState<Notifications[]>([]);

    const getNotifications = async () => {
        const response = await GetUserNotifications();
        if (response.status === "success")
            setNotifications([...response.data]);
    }
    const AddNotifications = async (description: string, title: string, type: string) => {
        const response = await AddUserNotifications(description, title, type);
        if (response.status === "success") getNotifications();
    }
    const ChangeStatus = async () => {
        const response = await ChangeUserNotificationStatus();
        if (response.error) {
            await AddLog({ type: "Error", url:path,detail:"Error on changing notifications status"})
        }
        else{
           await  getNotifications();
        }
    }
    useEffect(() => {
        getNotifications();
    }, [])

    return (
        <NotificationContext.Provider value={{ notifications, AddNotifications, getNotifications, ChangeStatus }}>
            {children}
        </NotificationContext.Provider>
    )
}