'use client'
import Lottie from 'lottie-react'
import React from 'react'

export default function Stat({ icon, title, value, desc }: { icon?: any , title: string, value: string, desc: string }) {
    return (
        <div className="stat  w-full gap-1 sm:p-5 sm:px-6">
            <div className="stat-figure text-secondary w-16 md:w-24">
                {icon &&  <Lottie animationData={icon}  /> }
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-desc">{desc}</div>
        </div>
    )
}