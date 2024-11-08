import React, { ReactElement } from 'react'

export default function layout({ children }: { children: ReactElement }) {
    return (
        <div className='bg-dark w-full h-lvh flex'>
            <div className='w-4/5 md:w-3/5  m-auto lg:w-2/5'>
                <div className='text-center py-4 text-4xl font-extrabold text-green-500'>Plan Pluse</div>
                <div className="card bg-base-100 w-full shadow-xl ">

                    <div className="card-body items-center text-center">
                        {
                            children
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
