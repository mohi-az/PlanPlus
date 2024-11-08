"use client"
import { LoginSchema } from '@/lib/schemas/loginSchema';
import clsx from 'clsx';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useActionState } from 'react'
import { handleUsersLogin, signInUser } from '@/app/actions/authActions';
import { FaGithub, FaGoogle } from 'react-icons/fa';
export default  function page() {
    
    const [error, LoginAction, isPending] = useActionState(handleUsersLogin
        , null
    )
    return (
        <div className='w-full'>
            <form action={LoginAction}>
                <div className='text-center font-bold text-xl md:text-2xl lg:text-3xl py-3 text-nowrap'>
                    Log In
                </div>
                <div className='text-sm md:text-lg lg:text-xl '>
                    <span className='text-gray-200'> Don’t have an account? </span>
                    {<Link href={'register'} > Sign up</Link>}
                </div>
                <div className="label">
                    <span className="label-text">Email</span>
                </div>
                <input type="text" name='email' className="input input-bordered w-full input-sm md:input-md" />
                <div className="label">
                    <span className="label-text">Password</span>
                </div>
                <input type="password" name='password' className="input input-bordered w-full input-sm md:input-md" />
                <div className='py-5 w-full'>
                    {isPending && <span className={clsx("loading loading-infinity loading-sm", { "invisible": !isPending })}>  </span>}
                    <button type='submit' className="btn btn-primary w-full text-lg" disabled={isPending}>Log in</button>
                </div>

                <span>Or sign in using:</span>
                <div className='gap-4 flex justify-center pt-3 flex-col md:flex-row'>
                    <button className="btn btn-outline md:w-1/3" name='action' value={"google"}><FaGoogle /> Google</button>
                    <button className="btn btn-outline md:w-1/3" name='action' value={"github"}><FaGithub /> Github</button>
                </div>


                <div className='text-sm md:text-base  flex flex-col pt-5'>

                    {error && error.map(issue => <span className='text-orange-300 text-left'>- {issue.message}</span>)}
                </div>


            </form>
        </div>
    )
}
