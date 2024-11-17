"use client"
import Image from 'next/image'
import React, { useEffect } from 'react'
import { AddLog } from '../actions/systemAction'
import { usePathname } from 'next/navigation'

export default function Error({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
  const pt = usePathname();
  const Loggingٍrror = async () => await AddLog({ detail: error.message, type: 'Error', url: pt })
  useEffect(() => {
    Loggingٍrror();
  }, [error])
  return (

    <div className='w-full h-lvh content-center '>

      <div className='flex flex-col md:flex-row  w-full justify-center items-center '>
        <Image unoptimized={true} src={'/images/404.gif'} width={150} height={150} alt='This page could not be found.' />
        <div className='flex flex-col gap-4'>
          <h2>Something went wrong!</h2>
          <button className='btn btn-accent' onClick={() => reset()}>Try again</button>
        </div>
      </div>
    </div>
  )
}
