'use client'
import React from 'react'
import E404 from '@/assets/lotties/404.json'
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
const LottieAnimation = dynamic(() => import('@/lib/components/Lottie'), { ssr: false });

export default function NotFound() {
  const router = useRouter();
  const HandleClick =async()=>{
    router.push('/members')
  }
  return (

    <div className='w-full h-lvh content-center '>

      <div className='flex flex-col  w-full justify-center items-center '>
        <LottieAnimation animationData={E404} className='w-96' loop={true} />
        <div className='flex flex-col gap-4'>
          <span className='font-mono font-semibold'>This page could not be found.</span>
          <button className='btn btn-accent  btn-sm md:btn-md' onClick={HandleClick}>Go to the main page</button>
        </div>
      </div>
    </div>
  )
}
