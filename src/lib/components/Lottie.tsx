"use client"
import React, {  useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import clsx from 'clsx';


const LottieAnimation = ({ animationData, loop = true,className,delayLoop=false }:{ animationData:object, loop:boolean,className?:string ,delayLoop?:boolean}) => {
  const animationRef = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && animationRef.current) {
      animationInstance.current = lottie.loadAnimation({
        container: animationRef.current,
        animationData,
        loop,
      });
  
      if (delayLoop) {
        const interval = setInterval(() => {
          animationInstance.current?.goToAndPlay(0, true);
        }, 10000);
        return () => clearInterval(interval); // Clean up the interval
      }
    }
    return () => {
      animationInstance.current?.destroy();
    };
  }, [animationData, loop]);

  return( <div ref={animationRef}  className={clsx(className)}/>);
};

export default LottieAnimation;
