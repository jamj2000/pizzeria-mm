import NextAuth from "next-auth"
import prisma from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUsuarioBasicoPorId } from "@/lib/data/users"
import authConfig from "@/lib/auth.config"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const options = {
    trustHost: true,
    session: { strategy: 'jwt' },
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/error',
        verifyRequest: '/verify-request'
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token?.sub;

            // Obtener la información actualizada del usuario desde la BD en cada petición
            const updatedUser = await getUsuarioBasicoPorId(session.user.id)

            if (updatedUser) {
                session.user.name = updatedUser.name;
                session.user.email = updatedUser.email;
                session.user.image = updatedUser.image;
                session.user.role = updatedUser.role;
            }

            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
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
