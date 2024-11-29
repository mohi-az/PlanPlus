"use client"
import { RegisterUser } from '@/app/actions/authActions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useActionState, useState } from 'react'
import { registerSchema } from '@/lib/schemas/registerSchema'
import clsx from 'clsx';
import { ZodIssue } from 'zod';

type form = {
    name?: string,
    email?: string
}

export default function Register() {
    const [formValues, setFormValues] = useState<form>();
    const [error, submitLogin, isPending] = useActionState(

        async (_previousState: ZodIssue[] | null, formData: FormData) => {

            setFormValues({ name: formData.get("name")?.toString(), email: formData.get("email")?.toString() })
            const validatedData = registerSchema.safeParse({
                name: formData.get("name"), email: formData.get("email"),
                password: formData.get("password"), confirmPassword: formData.get('confirmPassword')
            });
            if (validatedData.success) {
                const response = await RegisterUser({ ...validatedData.data });
                if (response.status === "success")
                    redirect("/auth/login");
                return null
            }
            else
                return validatedData.error.issues

        },
        null,

    );

    return (
        <div className='w-full'>
            <form action={submitLogin} >

                <div className='text-center font-bold text-xl md:text-2xl lg:text-3xl py-3 '>
                    Create New Account
                </div>
                <div className='text-sm md:text-lg lg:text-xl '>
                    <span className='text-gray-200'> Have an account? </span>
                    {<Link href={'login'} > Log In</Link>}
                </div>
                <div className="label">
                    <span className="label-text">Name</span>
                </div>
                <input type="text" name='name' className="input input-bordered w-full input-sm md:input-md" defaultValue={formValues?.name ?? ''} />

                <div className="label">
                    <span className="label-text">Email</span>
                </div>
                <input type="text" name='email' className="input input-bordered w-full input-sm md:input-md" defaultValue={formValues?.email ?? ''} />
                <div className="label">
                    <span className="label-text">Password</span>
                </div>
                <input type="password" name='password' className="input input-bordered w-full input-sm md:input-md" />
                <div className="label">
                    <span className="label-text">ConfirmPassword</span>
                </div>
                <input type="password" name='confirmPassword' className="input input-bordered w-full input-sm md:input-md" />
                <div className='pt-5 w-full'>
                    <button type='submit' className="btn btn-primary w-full" disabled={isPending}>
                        {isPending && <span className={clsx("loading loading-spinner", { "invisible": !isPending })}>  </span>}


                        Sign Up</button>
                </div>
                <div className='text-sm md:text-base  flex flex-col pt-5'>
                    <span >By creating account, you agree to our Terms of Service</span>
                    <span>Or sign in using:</span>
                    {error && error.map(issue => <span key={issue.code}  className='text-orange-300 text-left'>- {issue.message}</span>)}
                </div>

            </form>
        </div>
    )
}
