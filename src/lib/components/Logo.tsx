'use client'
import React from 'react'
import loading from '@/assets/lotties/plus-loader.json'
import LottieAnimation from './Lottie'

export default function Logo() {
    return (

        <div className="text-2xl  text-orange-400 flex flex-row flex-nowrap">
            <LottieAnimation animationData={loading} loop={false} delayLoop={true} className='w-8' />
            <div>
                Plan Plus
            </div>
        </div>

    )
}
