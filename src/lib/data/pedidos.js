'use server'

import prisma from "@/lib/prisma"
import { cacheTag } from "next/cache"



export async function getPedidos(clienteId) {
    'use cache'
    cacheTag('pedidos', `cliente:${clienteId}`)

    const pedidos = await prisma.pedido.findMany({
        where: {
            clienteId // dentro de where, valores undefined equivalen a desactivar filtro 
        },
        include: {
            cliente: true,
            repartidor: true,
            pedidoPizzas: {
                include: { pizza: true }
            }
        }
    })

    return pedidos
}




export async function getPedido(id) {
    'use cache'
    cacheTag('pedidos', `pedido:${id}`)


    if (Number.isInteger(parseInt(id)) == false) return null

    const pedido = await prisma.pedido.findUnique({
        where: { id: +id },
        include: {
            cliente: true,
            repartidor: true,
            pedidoPizzas: {
                include: { pizza: true }
            }
        }
    })
    return pedido
}