import React from 'react'
export default async function Page({ children }:{ children: React.ReactNode }) {

    return (
        <div>
                {children}
        </div>
    )
}
