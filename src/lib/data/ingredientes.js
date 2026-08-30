'use server'

import prisma from "@/lib/prisma"
import { cacheTag } from "next/cache"



export async function getIngredientes() {
    'use cache'
    cacheTag('ingredientes')

    const ingredientes = await prisma.ingrediente.findMany()
    return ingredientes
}





export async function getIngrediente(id) {
    'use cache'
    cacheTag('ingredientes', `ingrediente:${id}`)

    if (Number.isInteger(parseInt(id)) == false) return null

    const ingrediente = await prisma.ingrediente.findUnique({
        where: { id: +id },
    })
    return ingrediente
}



export async function getIngredientesIdNombre() {
    'use cache'

    cacheTag('ingredientes', 'ingredientes:id-nombre')

    const ingredientes = await prisma.ingrediente.findMany({
        select: {
            id: true,
            nombre: true
        }
    })
    return ingredientes
}