"use client"
import React from 'react'
import * as FlatIcon from "react-icons/fc";

export default function IconLoader({ name }: { name: string }) {
    type IconKeys = keyof typeof FlatIcon;
    const iconName: IconKeys = name as IconKeys
    const Icon = FlatIcon[iconName]
    return (
        <div><Icon /></div>
    )
}
