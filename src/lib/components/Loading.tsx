"use client"
import React from 'react'
import LottieAnimation from './Lottie'
import loading from '@/assets/lotties/plus-loader.json'

export default function Loading() {
  return (
    <div> <LottieAnimation animationData={loading} loop={true} className='w-24'/></div>
  )
}
