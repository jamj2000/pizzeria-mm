'use server'
import prisma from '@/lib/prisma'
import { revalidatePath, updateTag } from 'next/cache'




async function insertar(prevState, formData) {
    // const estado = formData.get('estado')
    const fecha_hora = new Date(formData.get('fecha_hora')).toISOString()
    const clienteId = formData.get('clienteId')
    const repartidorId = Number(formData.get('repartidorId')) || null

    const pizzas = formData.getAll('pizzas')
        .map(pizza => {
            const { id, cantidad } = JSON.parse(pizza);
            return { pizzaId: Number(id), cantidad: Number(cantidad) }
        })
        .filter(pizza => pizza.cantidad > 0)



    try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        await prisma.pedido.create({
            data: {
                // estado,
                fecha_hora,
                clienteId,
                repartidorId,
                pedidoPizzas: { create: pizzas }
            }
        })

        updateTag('pedidos')
        return { success: 'Pedido registrado correctamente' }
    } catch (error) {
        console.error(error)
        // return { error: 'Error al registrar el pedido' }
        return { error: error.message.split('\n').pop() }
    }
}





async function modificar(prevState, formData) {
    const id = Number(formData.get('id'))
    // const estado = formData.get('estado')
    const fecha_hora = new Date(formData.get('fecha_hora')).toISOString()
    const clienteId = formData.get('clienteId')

    const repartidorId = Number(formData.get('repartidorId')) || null

    // console.log(formData.getAll('pizzas'))

    const pizzas = formData.getAll('pizzas')
        .map(pizza => {
            const { id, cantidad } = JSON.parse(pizza);
            return { pizzaId: Number(id), cantidad: Number(cantidad) }
        })
        .filter(pizza => pizza.cantidad > 0)


    try {
        await prisma.pedido.update({
            where: { id },
            data: {
                // estado,
                fecha_hora,
                clienteId,
                repartidorId,
                pedidoPizzas: {
                    deleteMany: {},
                    create: pizzas,
                }
            }
        })

        updateTag('pedidos')
        return { success: 'Pedido modificado correctamente' }
    } catch (error) {
        console.error(error)
        return { error: 'Error al modificar el pedido' }
    }
}





async function eliminar(prevState, formData) {
    const id = Number(formData.get('id'))

    try {
        await prisma.pedido.delete({
            where: { id }
        })

        updateTag('pedidos')
        return { success: 'Pedido eliminado correctamente' }
    } catch (error) {
        console.error(error)
        return { error: 'Error al eliminar el pedido' }
    }
}


async function changeState(pedido) {

    // await new Promise(resolve => setTimeout(resolve, 2000));
    if (pedido) {
        await prisma.pedido.update({
            where: { id: pedido.id },
            data: { estado: (pedido.estado + 1) % 4 },
        })

        revalidatePath("/dashboard");
    }
}


export {
    insertar,
    modificar,
    eliminar,
    changeState
}