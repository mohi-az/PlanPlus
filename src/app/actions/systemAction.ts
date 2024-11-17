"use server"
import { prisma } from "@/prisma"

export const AddLog = async ({ detail, type, url }: { detail: string, type: string, url: string }) => {
    
    const response = await prisma.logs.create({
        data: {
            detail,
            type,
            url
        }
    })
    return response
}