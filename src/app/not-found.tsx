"use client"
import Lottie from 'lottie-react'
import { redirect } from 'next/navigation'
import React from 'react'
import E404 from '@/assets/lotties/404.json'
export default function NotFound() {
  const HandleClick =async()=>{
    redirect('/members')
  }
  return (

    <div className='w-full h-lvh content-center '>

      <div className='flex flex-col  w-full justify-center items-center '>
        <Lottie animationData={E404} className='w-96' />
        <div className='flex flex-col gap-4'>
          <span className='font-mono font-semibold'>This page could not be found.</span>
          <button className='btn btn-accent  btn-sm md:btn-md' onClick={HandleClick}>Go to the main page</button>
        </div>
      </div>
    </div>
  )
}
