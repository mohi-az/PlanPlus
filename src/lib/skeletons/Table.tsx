import React from 'react'

export default function TableSkeleton() {
    return (
        <div className='flex flex-col' >

            {/* <div className="skeleton w-full h-130"></div> */}
            <table className="table-xs md:table-sm lg:table-md w-full">
            {/* head */}
                    <thead>
                        <tr>
                        <th></th>
                            <th className='lg:font-semibold text-sm lg:text-lg'>Title</th>
                            <th className='lg:font-semibold text-sm lg:text-lg hidden lg:table-cell'>Description</th>
                            <th className='lg:font-semibold text-sm lg:text-lg hidden lg:table-cell'>Due date</th>
                            <th className='hidden lg:table-cell' ></th>
                            <th className='lg:font-semibold text-sm lg:text-lg text-center'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                      
                                <tr className='w-full hover skeleton h-20'><td>&nbsp;</td><td></td><td></td><td></td><td></td><th></th></tr>
                                <tr className='w-full hover skeleton h-20'><td>&nbsp;</td><td></td><td></td><td></td><td></td><th></th></tr>
                                <tr className='w-full hover skeleton h-20'><td>&nbsp;</td><td></td><td></td><td></td><td></td><th></th></tr>
                                <tr className='w-full hover skeleton h-20'><td>&nbsp;</td><td></td><td></td><td></td><td></td><th></th></tr>
                                <tr className='w-full hover skeleton h-20'><td>&nbsp;</td><td></td><td></td><td></td><td></td><th></th></tr>
                                <tr className='w-full hover skeleton h-20'><td>&nbsp;</td><td></td><td></td><td></td><td></td><th></th></tr>

                    </tbody>
                </table>
        </div>
    )
}
