'use server'

import prisma from "@/lib/prisma"
import { cacheTag } from "next/cache"



export async function getLotePizzas(offset, limit = 5) {
    const pizzas = await prisma.pizza.findMany({
        skip: offset,
        take: limit,
        orderBy: { id: "asc" },
    })

    return pizzas
}




export async function getPizzas() {
    'use cache'
    cacheTag('pizzas')

    try {
        const pizzas = await prisma.pizza.findMany({
            include: { ingredientes: true }
        })
        return pizzas
    } catch (error) {
        console.log(error.message.split('\n').pop())
        throw new Error(error.message.split('\n').pop())
    }

}




export async function getPizza(id) {
    'use cache'
    cacheTag('pizzas', `pizza:${id}`)


    if (Number.isInteger(parseInt(id)) == false) return null

    const pizza = await prisma.pizza.findUnique({
        where: { id: +id },
        include: { ingredientes: true }
    })

    return pizza
}

