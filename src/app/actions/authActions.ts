"use server"
import { signIn } from "@/auth";
import { LoginSchema, LoginSchemaType } from "@/lib/schemas/loginSchema";
import { prisma } from "@/prisma"
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ZodIssue } from "zod";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";
import { logger } from "@/lib/logger";


export const GetUserByEmail = async (Email: string) => {
    return prisma.user.findUnique({
        where: { email: Email },
    })
}
export const RegisterUser = async ({ name, email, password }: { name: string, email: string, password: string }): Promise<ActionResult<[]>> => {
    try {
        const hpass = await bcrypt.hash(password, 10);
        const findExist = await prisma.user.findUnique({ where: { email: email } });
        
        if (findExist) {
            logger.warn("Registration attempt with existing email", { email });
            return { status: "error", error: ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED }
        }
        
        const response = await prisma.user.create({
            data: {
                email: email,
                name: name,
                passwordHash: hpass,
                createdAt: new Date(Date.now())
            }
        })
        
        if (response) {
            logger.info("User registered successfully", { userId: response.id });
            return { status: "success", data: [] }
        }
        
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    } catch (error) {
        logger.error("Error during user registration", { error });
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const signInUser = async (data: LoginSchemaType): Promise<ActionResult<string>> => {
    try {
        await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })
        
        logger.info("User signed in successfully", { email: data.email });
        return { status: "success", data: SUCCESS_MESSAGES.LOGGED_IN }
    }
    catch (error) {
        logger.error("Sign in error", { error, email: data.email });
        
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { status: "error", error: ERROR_MESSAGES.INVALID_CREDENTIALS }
                default:
                    return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
            }
        }
        return { status: "error", error: ERROR_MESSAGES.SOMETHING_WENT_WRONG }
    }
}
export const handleUsersLogin = async (_preState: ZodIssue[] | unknown, formData: FormData) => {
    const action = formData.get("action");
    
    if (action) {  // handle providers
        await signIn(action.toString(), { redirectTo: "/members" })
    } else { //Handle credential Login
        const validatedData = LoginSchema.safeParse({ 
            email: formData.get('email'), 
            password: formData.get('password') 
        })
        
        if (!validatedData.success) {
            return validatedData.error.issues
        }
        
        const result = await signInUser(validatedData.data);
        
        if (result.status === 'success') {
            redirect('/members')
        } else {
            const errors = [{ 
                message: "Invalid username or password!", 
                path: ['password'], 
                code: "custom", 
                fatal: true 
            }];
            return errors
        }
    }
}