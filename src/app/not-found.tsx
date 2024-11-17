"use client"
import { auth } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export default function NotFound() {
  const HandleClick =async()=>{
    redirect('/members')
  }
  return (

    <div className='w-full h-lvh content-center '>

      <div className='flex flex-col md:flex-row  w-full justify-center items-center '>
        <Image unoptimized={true} src={'/images/404.gif'} width={150} height={150} alt='This page could not be found.' />
        <div className='flex flex-col gap-4'>

          <span className='font-mono font-semibold'>This page could not be found.</span>
          <button className='btn btn-secondary  btn-sm md:btn-md' onClick={HandleClick}>Go to the main page</button>
        </div>
      </div>
    </div>
  )
}
