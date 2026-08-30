'use server'
import prisma from '@/lib/prisma'
import { updateTag } from 'next/cache'




export async function createRepartidor(prevState, formData) {
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')

    try {
        await prisma.repartidor.create({
            data: { nombre, telefono }
        })
        updateTag('repartidores')
        return { type: 'success', message: 'Repartidor guardado' }
    } catch (error) {
        console.error("INSERTAR_REPARTIDOR_ERROR", error)
        return { type: 'error', error: 'Error al guardar el repartidor' }
    }
}





export async function updateRepartidor(prevState, formData) {
    const id = Number(formData.get('id'))
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')

    try {
        await prisma.repartidor.update({
            where: { id },
            data: { nombre, telefono }
        })
        updateTag('repartidores')
        return { type: 'success', message: 'Repartidor modificado' }
    } catch (error) {
        console.error("MODIFICAR_REPARTIDOR_ERROR", error)
        return { type: 'error', error: 'Error al modificar el repartidor' }
    }
}





export async function deleteRepartidor(prevState, formData) {
    const id = Number(formData.get('id'))

    try {
        await prisma.repartidor.delete({
            where: { id }
        })
        updateTag('repartidores')
        // return { type: 'success', message: 'Repartidor eliminado' }
    } catch (error) {
        console.error("ELIMINAR_REPARTIDOR_ERROR", error)
        return { type: 'error', error: 'Error al eliminar el repartidor' }
    }
}


