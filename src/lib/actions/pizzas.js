'use server'
import prisma from '@/lib/prisma'
import { updateTag } from 'next/cache'
import { uploadImage } from "@/lib/actions/images"




export async function createPizza(prevState, formData) {
    const nombre = formData.get('nombre')
    const precio = Number(formData.get('precio'))
    let foto = formData.get('foto')     // Tipo file

    const ingredientes = formData.getAll('ingredientes').map(id => ({ id: Number(id) }))

    try {
        // si tenemos nuevo archivo en el input type=file
        if (foto.size > 0)
            foto = await uploadImage(foto)
        else
            foto = null


        await prisma.pizza.create({
            data: {
                nombre,
                precio,
                ...(foto && { foto }),
                ingredientes: { connect: ingredientes }
            }
        })

        updateTag('pizzas')
        return {
            type: "success",
            message: 'Pizza creada'
        }
    } catch (error) {
        console.error("PIZZA_INSERT_ERROR", error)
        return {
            type: "error",
            message: 'Error al crear la pizza. Inténtalo de nuevo.'
        }
    }
}




export async function updatePizza(prevState, formData) {
    const id = Number(formData.get('id'))
    const nombre = formData.get('nombre')
    const precio = Number(formData.get('precio'))
    let foto = formData.get('foto')     // Tipo file

    const ingredientes = formData.getAll('ingredientes').map(id => ({ id: Number(id) }))

    try {
        // si tenemos nuevo archivo en el input type=file
        if (foto.size > 0)
            foto = await uploadImage(foto)
        else
            foto = null


        await prisma.pizza.update({
            where: { id },
            data: {
                nombre,
                precio,
                ...(foto && { foto }),
                ingredientes: { set: ingredientes }
            }
        })
        updateTag('pizzas')
        return {
            type: "success",
            message: 'Pizza modificada'
        }
    } catch (error) {
        console.error("PIZZA_MODIFICAR_ERROR", error)
        return {
            type: "error",
            message: 'Error al modificar la pizza. Inténtalo de nuevo.'
        }
    }
}



export async function deletePizza(prevState, formData) {
    const id = Number(formData.get('id'))

    try {
        await prisma.pizza.delete({
            where: { id }
        })

        updateTag('pizzas')
        // return {
        //     type: "success",
        //     message: 'Pizza eliminada'
        // }
    } catch (error) {
        console.error("PIZZA_ELIMINAR_ERROR", error)
        return {
            type: "error",
            message: 'Error al eliminar la pizza. Inténtalo de nuevo.'
        }
    }
}




