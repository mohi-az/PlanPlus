"use server"
import { signIn } from "@/auth";
import { LoginSchema, LoginSchemaType } from "@/lib/schemas/loginSchema";
import { prisma } from "@/prisma"
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ZodIssue } from "zod";


export const GetUserByEmail = async (Email: string) => {
    return prisma.user.findUnique({
        where: {email: Email},
    })
}
export const RegisterUser = async ({ name, email, password }: { name: string, email: string, password: string }): Promise<ActionResult<User>> => {
    const hpass = await bcrypt.hash(password, 10);
    const findExist = await prisma.user.findUnique({ where: { email: email } });
    if (findExist) return { status: "error", error: "this E-mail is registred before!" }
    const response = await prisma.user.create({
        data: {
            email: email,
            name: name,
            passwordHash: hpass,
            createdAt: new Date(Date.now())
        }
    })
    return { status: "success", data: response }

}
export const signInUser = async (data: LoginSchemaType): Promise<ActionResult<string>> => {
    console.log("start....")
    try {

        await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })
        return { status: "success", data: "Logged in" }
    }
    catch (error) {
        console.log(error)
        if (error instanceof AuthError)
            switch (error.type) {
                case "CredentialsSignin":

                    return { status: "error", error: "invalid Credential" }

                default:
                    return { status: "error", error: "Somthing went wrong" }
            }
        else return { status: "error", error: "Somthing went wrong" }
    }

}
export const handleUsersLogin = async (_preState: ZodIssue[] | any, formData: FormData) => {
    const action = formData.get("action");
    if (action) {  // handle providers
        await signIn(action.toString(), { redirectTo: "/members" })
    }
    else {//Handle credential Login

        const validatedData = LoginSchema.safeParse({ email: formData.get('email'), password: formData.get('password') })
        if (!validatedData.success) return validatedData.error.issues
        const result = await signInUser(validatedData.data);
        if (result.status === 'success')
            redirect('/members')          
        else {
            const errors = [{ message: "Invalid username or password!", path: ['password'], code: "custom", fatal: true }];
            return errors
        }
    }

}