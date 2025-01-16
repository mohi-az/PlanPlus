import React from 'react'

export default function BadgeSkeleton() {
    return (
        <div>

            <div className="card card-compact w-full flex flex-row justify-start">
                <div className="h-full flex items-center justify-center">
                <div className=" h-32 w-32 skeleton"></div>

                </div>
                <div className="card-body flex flex-col ">
                    <span className="text-sm skeleton"></span>
                    <h2 className="card-title font-mono"></h2>
                    <span className="text-sm skeleton"></span>
                    <h2 className="card-title font-mono"></h2>
                </div>

            </div></div>
    )
}
