'use client'

import { useCart } from "@/lib/store/cart"
import { ShoppingCartIcon } from "lucide-react"
import Link from "next/link"
import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => { }

export default function CartWidget() {
    const { cart } = useCart()
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

    if (!mounted) {
        return (
            <Link
                href="/carrito"
                className="relative p-2 rounded-full hover:outline hover:outline-slate-600 cursor-pointer" >
                <ShoppingCartIcon />
            </Link>
        )
    }

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <Link
            href="/carrito"
            className="relative p-2 rounded-full hover:outline hover:outline-slate-600 cursor-pointer" >
            <ShoppingCartIcon />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                </span>
            )}
        </Link>
    )
}
