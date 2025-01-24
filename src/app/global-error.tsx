"use client"
import React, { useCallback, useEffect } from 'react'
import { AddLog } from './actions/systemAction'
import { usePathname } from 'next/navigation'
// import ErroL from '@/assets/lotties/Error.json'
// import LottieAnimation from "@/lib/components/Lottie";
export default function Error({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
  const pt = usePathname();
  const LogginError = useCallback(async () => { await AddLog({ detail: error.message, type: 'Error', url: pt }) }, [error, pt])
  useEffect(() => {

    LogginError();
  }, [LogginError])
  return (
    <div className='w-full h-lvh content-center'>
      <div className='flex flex-col  w-full justify-center items-center gap-10'>
        {/* <LottieAnimation animationData={ErroL} loop={false} className='w-96' /> */}
        <div className='flex flex-col gap-4'>
          <button className='btn btn-warning btn-wide' onClick={() => reset()}>Try again</button>
        </div>
      </div>
    </div>
  )
}
