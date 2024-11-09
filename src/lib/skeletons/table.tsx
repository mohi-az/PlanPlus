import React from 'react'

export default function TableSkeleton() {
    return (
        <div className='flex flex-col' >

            {/* <div className="skeleton w-full h-130"></div> */}
            <table className="table ">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Task title</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>status</th>
                            <th></th>
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
