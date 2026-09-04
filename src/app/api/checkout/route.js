// Esta ruta no se usa. En su lugar se utiliza la 
// acción de servidor crearSesionPago en lib/actions/checkout.js
// Se deja disponible la ruta para poder hacer checkout directamente desde el frontend
// (por ejemplo desde una aplicación móvil, si fuera necesario).


import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'

export async function POST(req) {
    const { items, userId, userName, userEmail } = await req.json()

    if (!items || items.length === 0) {
        return Response.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const line_items = items.map((item) => ({
        price_data: {
            currency: 'eur',
            product_data: {
                name: item.nombre,
                ...(item.foto && { images: [item.foto] }),
            },
            unit_amount: Math.round(item.precio * 100), // Stripe trabaja en céntimos
        },
        quantity: item.quantity,
    }))

    const user = userId ? await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true }
    }) : null

    // The Checkout Session creation: https://docs.stripe.com/api/checkout/sessions/create
    // The Checkout Session object:  https://docs.stripe.com/api/checkout/sessions/object
    const sessionConfig = {
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${baseUrl}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pago/cancelado`,
        metadata: {
            userId: userId || '',
            userName: userName || '',
            // Guardamos los items como JSON para recrear el pedido en el webhook
            items: JSON.stringify(
                items.map((item) => ({ id: item.id, cantidad: item.quantity }))
            ),
        },
    }

    if (user?.stripeCustomerId) {
        sessionConfig.customer = user.stripeCustomerId
    } else {
        sessionConfig.customer_email = userEmail
        sessionConfig.customer_creation = 'always'
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return Response.json({ url: session.url })
}
