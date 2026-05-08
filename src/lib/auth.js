import NextAuth from "next-auth"
import prisma from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { obtenerUsuarioPorId } from "@/lib/data/users"
import authConfig from "@/lib/auth.config"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const options = {
    session: { strategy: 'jwt' },
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/error'
    },
    callbacks: {
        async session({ session, token }) {
            // console.log(session, user);
            session.user.id = token?.sub;     // Para incluir ID de usuario
            session.user.role = token?.role

            // Obtener la información actualizada del usuario en cada petición
            const updatedUser = await obtenerUsuarioPorId(session.user.id)

            if (updatedUser) {
                session.user.name = updatedUser.name; // Actualizar el nombre en la sesión
                session.user.email = updatedUser.email; // Actualizar el nombre en la sesión
                session.user.image = updatedUser.image; // Actualizar la imagen en la sesión
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const user = await obtenerUsuarioPorId(token.sub)
            if (!user) return token;

            token.role = user?.role
            return token
        }
    },
    events: {
        // Evento para Magic Link y OAuth, no para credentials
        async createUser({ user }) {
            if (!user.stripeCustomerId) {
                const customer = await stripe.customers.create({ email: user.email })
                await prisma.user.update({
                    where: { id: user.id },
                    data: { stripeCustomerId: customer.id }
                })
            }
        }
    }

}



export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({ ...options, ...authConfig })
