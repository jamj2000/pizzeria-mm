'use server'

import prisma from "@/lib/prisma"
import { cacheTag } from "next/cache";


export async function getUsuarios() {
    'use cache'
    cacheTag('users')

    const users = await prisma.user.findMany({
        include: { pedidos: true }
    });
    return users
}



export async function getUsuarioBasicoPorId(id) {
    if (!id) return null;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, image: true, role: true }
        })
        return user
    }
    catch (error) {
        console.log(error.message.split('\n').pop())
        return null
    }
}

export async function getUsuarioPorId(id) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                pedidos: {
                    include: {
                        pedidoPizzas: {
                            include: {
                                pizza: true
                            }
                        }
                    }
                }
            }
        })
        return user
    }
    catch (error) {
        console.log(error.message.split('\n').pop())
        throw new Error(error.message.split('\n').pop())
    }
}




export async function getUsuarioPorEmail(email) {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    return user
}


