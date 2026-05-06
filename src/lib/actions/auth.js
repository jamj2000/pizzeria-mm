'use server'

import { signIn, signOut } from '@/lib/auth'
import { obtenerUsuarioPorEmail } from '@/lib/data/users'
import prisma from '@/lib/prisma'
import stripe from '@/lib/stripe'
import bcrypt from 'bcryptjs'




// --------------------------------- REGISTER ------------------------------------

async function register(prevState, formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    try {
        // Comprobamos si el usuario ya está registrado
        const user = await obtenerUsuarioPorEmail(email);

        if (user) {
            return { error: 'El email ya está registrado' }
        }

        // Encriptamos password 
        const hashedPassword = await bcrypt.hash(password, 10)

        // Registrar en Stripe
        const customer = await stripe.customers.create({
            name,
            email,
        })

        // Guardamos credenciales en base datos
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image: '/images/avatar-80.png',
                stripeCustomerId: customer.id
            }
        })



        return { success: "Registro correcto" }
    } catch (error) {
        console.error("REGISTER_ERROR", error)
        return { error: "Error al registrar el usuario. Inténtalo de nuevo." }
    }
}


// --------------------------------- LOGIN MAGIC LINK ------------------------------------ 


export async function loginWithMagicLink(prevState, formData) {
    const email = formData.get('email')

    try {
        await signIn("nodemailer", {
            email,
            redirectTo: globalThis.callbackUrl || '/'
        })

        return { success: "Se ha enviado un correo para iniciar sesión." }
    } catch (error) {
        // Auth.js lanza errores de redirección que son normales, 
        // pero debemos capturar otros errores.
        return { error: "No se ha podido enviar el correo." }
    }
}



// --------------------------------- LOGIN ------------------------------------

async function login(prevState, formData) {
    const email = formData.get('email')
    const password = formData.get('password')

    try {
        // Comprobamos si el usuario está registrado
        const user = await obtenerUsuarioPorEmail(email);

        if (!user) {
            return { error: 'Usuario no registrado.' }
        }

        // Comprobamos si el usuario está activo 
        if (!user.active) {
            return { error: 'Usuario deshabilitado. Consulte al administrador.' }
        }

        // Compare password 
        const matchPassword = user.password
            ? await bcrypt.compare(password, user.password)
            : true; // Caso especial si no hay contraseña almacenada

        if (!matchPassword) {
            return { error: 'Credenciales incorrectas.' }
        }

        await signIn('credentials', {
            email,
            password,
            redirectTo: globalThis.callbackUrl || '/'
        })

        return { success: "Inicio de sesión correcto" }

    } catch (error) {
        // MUY IMPORTANTE: NextAuth utiliza errores para redireccionar. 
        // Si detectamos que es una redirección, debemos relanzarla.
        if (error.type === 'CredentialsSignin') {
            return { error: 'Credenciales inválidas.' }
        }

        // Si es un error de redirección (Next.js internals), lo lanzamos
        if (error.message === 'NEXT_REDIRECT') {
            throw error
        }

        console.error("LOGIN_ERROR", error)
        // Para cualquier otro error inesperado
        throw error
    }
}



// --------------------------------- LOGOUT ------------------------------------

async function logout() {
    await signOut({ redirectTo: '/' })
}





export {
    register,
    login,
    logout,
    loginWithMagicLink,
}