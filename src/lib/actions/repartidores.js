'use server'
import prisma from '@/lib/prisma'
import { updateTag } from 'next/cache'




async function insertar(prevState, formData) {
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')

    try {
        await prisma.repartidor.create({
            data: { nombre, telefono }
        })
        updateTag('repartidores')
        return { success: 'Repartidor guardado' }
    } catch (error) {
        console.error("INSERTAR_REPARTIDOR_ERROR", error)
        return { error: 'Error al guardar el repartidor' }
    }
}





async function modificar(prevState, formData) {
    const id = Number(formData.get('id'))
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')

    try {
        await prisma.repartidor.update({
            where: { id },
            data: { nombre, telefono }
        })
        updateTag('repartidores')
        return { success: 'Repartidor modificado' }
    } catch (error) {
        console.error("MODIFICAR_REPARTIDOR_ERROR", error)
        return { error: 'Error al modificar el repartidor' }
    }
}





async function eliminar(prevState, formData) {
    const id = Number(formData.get('id'))

    try {
        await prisma.repartidor.delete({
            where: { id }
        })
        updateTag('repartidores')
        return { success: 'Repartidor eliminado' }
    } catch (error) {
        console.error("ELIMINAR_REPARTIDOR_ERROR", error)
        return { error: 'Error al eliminar el repartidor' }
    }
}



export {
    insertar,
    modificar,
    eliminar
}