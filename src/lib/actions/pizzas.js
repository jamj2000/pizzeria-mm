'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { uploadImage } from "@/lib/actions/images"




async function insertar(prevState, formData) {
    const nombre = formData.get('nombre')
    const precio = Number(formData.get('precio'))
    const file = formData.get('file')

    try {
        let foto = null
        if (file.size > 0) {
            foto = await uploadImage(file)
        }

        const ingredientes = formData.getAll('ingredientes').map(id => ({ id: Number(id) }))

        await prisma.pizza.create({
            data: {
                nombre,
                precio,
                foto,
                ingredientes: { connect: ingredientes }
            }
        })

        revalidatePath('/pizzas')
        return { success: 'Pizza creada' }
    } catch (error) {
        console.error("PIZZA_INSERT_ERROR", error)
        return { error: 'Error al crear la pizza. Inténtalo de nuevo.' }
    }
}

async function modificar(prevState, formData) {
    const id = Number(formData.get('id'))
    const nombre = formData.get('nombre')
    const precio = Number(formData.get('precio'))
    const file = formData.get('file')

    try {
        const existingPizza = await prisma.pizza.findUnique({ where: { id } })

        let foto = existingPizza?.foto ?? null
        if (file.size > 0) {
            foto = await uploadImage(file)
        }

        const ingredientes = formData.getAll('ingredientes').map(id => ({ id: Number(id) }))

        await prisma.pizza.update({
            where: { id },
            data: {
                nombre,
                precio,
                foto,
                ingredientes: { set: ingredientes }
            }
        })
        revalidatePath('/pizzas')
        return { success: 'Pizza modificada' }
    } catch (error) {
        console.error("PIZZA_MODIFICAR_ERROR", error)
        return { error: 'Error al modificar la pizza. Inténtalo de nuevo.' }
    }
}

async function eliminar(prevState, formData) {
    const id = Number(formData.get('id'))

    try {
        await prisma.pizza.delete({
            where: { id }
        })

        revalidatePath('/pizzas')
        return { success: 'Pizza eliminada' }
    } catch (error) {
        console.error("PIZZA_ELIMINAR_ERROR", error)
        return { error: 'Error al eliminar la pizza. Inténtalo de nuevo.' }
    }
}





export {
    insertar,
    modificar,
    eliminar
}

