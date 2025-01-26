"use client"

import { NotificationProvider } from "@/contexts/NotificationsContext";
import NotificationList from "./NotificationList";

export default function NotificationsPage() {
    return (
        <div className='w-full p-5 h-remain overflow-y-hidden'>
            <NotificationProvider>
                <div className=" rounded-md p-3 bg-base-300  min-h-AdividerWithoutBTN"  >
                    <NotificationList />
                </div>
            </NotificationProvider>
        </div>
    );
};