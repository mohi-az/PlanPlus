
import React from 'react'
export default async function Page({ Children }: { Children: React.ReactNode }) {

    return (
        <div>
                {Children}
        </div>
    )
}
