'use client'

import { useEffect } from 'react'
import { useCart } from '@/lib/store/cart'
import Link from 'next/link'
import { CheckCircleIcon } from 'lucide-react'

export default function PagoExitoPage() {
    const { clearCart } = useCart()

    useEffect(() => {
        clearCart()
    }, [clearCart])

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] gap-6 text-center px-4">
            <CheckCircleIcon size={80} className="text-green-500" />
            <h1 className="text-3xl font-bold text-stone-800">¡Pago realizado con éxito!</h1>
            <p className="text-stone-500 max-w-md">
                Tu pedido ha sido confirmado. Lo estamos preparando con mucho cariño 🍕.
                Puedes seguir el estado en tu historial de pedidos.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/pedidos"
                    className="bg-blue-500 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                    Ver mis pedidos
                </Link>
                <Link
                    href="/pizzas"
                    className="border border-stone-300 text-stone-600 font-bold px-6 py-3 rounded-full hover:bg-stone-100 transition-colors"
                >
                    Seguir comprando
                </Link>
            </div>
        </div>
    )
}
