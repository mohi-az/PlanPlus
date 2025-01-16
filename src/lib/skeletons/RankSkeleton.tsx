import React from 'react'

export default function RankSkeleton() {
    return (
        <div className='flex flex-col gap-2 '>
            <div className='skeleton'></div>
            <div className=' flex flex-row flex-nowrap gap-7'>
                <progress className="progress skeleton  progress-accent w-full h-5" value={0} max={0}></progress>
            </div>
            <div className='flex justify-end'>
            <div className=" h-16 w-16 skeleton"></div>
            </div>
        </div>
    )
}
