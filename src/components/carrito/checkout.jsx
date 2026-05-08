'use client'

import { useStore } from "@/lib/store/cart"
import { use, useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Trash2, Minus, Plus } from "lucide-react"
import { Spinner3 } from "@/components/ui/spinners"

import { crearSesionPago } from '@/lib/actions/checkout'
import { DEFAULT_PIZZA_IMAGE } from "@/lib/constants"


export default ({ session }) => {
    const { user } = use(session) || {} // Resolvemos promesa de forma segura
    const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useStore()
    const [mounted, setMounted] = useState(false)
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0)

    async function handleCheckout() {
        if (!user) return
        setIsPending(true)
        const url = await crearSesionPago({
            items: cart,
            userId: user.id,
            userEmail: user.email,
            userName: user.name
        })
        // Redirigir a la página de pago de Stripe
        window.location.href = url  // o router.push(url)
        setIsPending(false)
    }



    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)]">
                <p className="text-2xl text-stone-500 mb-4">Tu carrito está vacío</p>
                <Link href="/pizzas" className="text-lg text-blue-600 hover:bg-blue-100 p-2 px-4 rounded-full">
                    Ver Pizzas disponibles
                </Link>
            </div>
        )
    }

    //  Debes <Link href="/login?callbackUrl=%2Fcarrito" className="font-bold underline">iniciar sesión</Link> para tramitar el pedido.

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Tu Pedido</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {cart.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 py-1 px-4 even:bg-indigo-100 odd:bg-slate-100">
                        <img
                            src={item.foto || DEFAULT_PIZZA_IMAGE}
                            alt={item.nombre}
                            className="size-16 object-cover rounded-md"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold">{item.nombre}</h3>
                            <p className="text-stone-500">{item.precio} € / ud.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="p-1 rounded-full hover:bg-slate-200 border border-slate-300"
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="font-bold"> {item.quantity} </span>

                                <button
                                    onClick={() => increaseQuantity(item.id)}
                                    className="p-1 rounded-full hover:bg-slate-200 border border-slate-300"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <span className="text-xl font-bold min-w-[80px] text-right">
                                {(item.precio * item.quantity).toFixed(2)} €
                            </span>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors border border-red-300"
                            >
                                <Trash2 size={20} />
                            </button>

                        </div>
                    </div>
                ))}

                <div className="flex justify-end pt-6 text-2xl font-bold">
                    Total: {total.toFixed(2)} €
                </div>
            </div>

            {user
                ?
                <div className="flex justify-end">
                    <button
                        onClick={handleCheckout}
                        disabled={isPending}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-blue-500 text-white cursor-pointer font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? <Spinner3 /> : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <line x1="2" x2="22" y1="10" y2="10" />
                                </svg>
                                Pagar con Stripe
                            </>
                        )}
                    </button>
                </div>
                :
                <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded text-right">
                    <p className="text-blue-700">
                        Debes <Link href="/login?callbackUrl=%2Fcarrito" className="font-bold underline">iniciar sesión</Link> para tramitar el pedido.
                    </p>
                </div>
            }
        </div>
    )
}
