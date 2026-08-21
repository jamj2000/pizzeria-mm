'use server'
import prisma from "@/lib/prisma"
import { cacheTag } from "next/cache"




export async function getRepartidores() {
    'use cache'
    cacheTag('repartidores')

    const repartidores = await prisma.repartidor.findMany()
    return repartidores
}



export async function getRepartidor(id) {
    'use cache'
    cacheTag('repartidores', `repartidor:${id}`)

    if (Number.isInteger(parseInt(id)) == false) return null

    const repartidor = await prisma.repartidor.findUnique({
        where: { id: +id }
    })
    return repartidor
}