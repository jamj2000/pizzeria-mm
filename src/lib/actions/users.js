'use server'
import bcrypt from 'bcryptjs'
import { obtenerUsuarioPorEmail } from '@/lib/data/users'
import { revalidatePath } from 'next/cache'

import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'


async function newUser(prevState, formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password')
    const active = Boolean(formData.get('active'))
    const address = formData.get('address');
    const phone = formData.get('phone');
    const image = formData.get('image');
    const role = formData.get('role');

    const user = await obtenerUsuarioPorEmail(email)
    if (user) return { error: 'Este email ya está registrado.' }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const customer = await stripe.customers.create({
            name,
            email,
            phone,
            address: {
                line1: address,
                // city: user.address.city,
                // country: user.address.country,
            },
        })

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                active,
                address,
                phone,
                image: image || '/images/avatar-80.png',
                role,
                stripeCustomerId: customer.id,
            }
        })

        revalidatePath('/dashboard')
        return { success: 'Usuario guardado' }
    } catch (error) {
        return { error: 'Error al registrar el usuario. Inténtalo de nuevo.' }
    }

}


async function editUser(prevState, formData) {
    const id = formData.get('id')
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password')
    const active = Boolean(formData.get('active'))
    const address = formData.get('address');
    const phone = formData.get('phone');
    const image = formData.get('image');
    const role = formData.get('role');

    try {
        // 1. Obtener el usuario existente por ID para asegurar que existe y obtener su stripeCustomerId
        const existingUser = await prisma.user.findUnique({ where: { id } })
        if (!existingUser) return { error: 'Usuario no encontrado.' }

        // 2. Si el email ha cambiado, verificar que el nuevo no esté registrado por otro usuario
        if (email !== existingUser.email) {
            const userWithNewEmail = await obtenerUsuarioPorEmail(email)
            if (userWithNewEmail) return { error: 'Este email ya está registrado por otro usuario.' }
        }

        let hashedPassword
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10)
        }

        // 3. Actualizar en Stripe si tiene cliente
        if (existingUser.stripeCustomerId) {
            await stripe.customers.update(existingUser.stripeCustomerId, {
                name,
                email,
                phone
            })
        }

        // 4. Actualizar en Prisma
        await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                ...(password && { password: hashedPassword }),
                active,
                address,
                phone,
                image: image || existingUser.image,
                role,
            }
        })

        revalidatePath('/dashboard')
        return { success: 'Usuario modificado' }

    } catch (error) {
        return { error: error.message || 'Error al modificar el usuario' }
    }
}

async function deleteUser(user) {
    try {
        const id = user.id
        if (user.stripeCustomerId) {
            await stripe.customers.del(user.stripeCustomerId)
        }
        await prisma.user.delete({
            where: { id },
        })
        revalidatePath('/dashboard')
        return { success: 'Usuario eliminado' }
    } catch (error) {
        return { error: 'Error al eliminar el usuario. Inténtalo de nuevo.' }
    }
}

async function activeUser(user) {
    if (user) {
        console.log('Usuario actualizado', user)
        await prisma.user.update({
            where: { id: user.id },
            data: { active: !user.active },
        })


        revalidatePath("/dashboard");
    }
}





export {
    newUser,
    editUser,
    deleteUser,
    activeUser
}