'use client'

import { usePathname, useRouter } from "next/navigation"
import { IconoAtras, IconoVer } from "../ui/icons"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store/cart"
import { DEFAULT_PIZZA_IMAGE } from "@/lib/constants"


function addToCart(pizza) {
    useStore.getState().addToCart(pizza)
}

const IconoAgregar = ({ pizza }) =>
    <PlusIcon size={32}
        className='absolute bottom-2 right-2 text-orange-500 border border-orange-500 rounded-full bg-orange-200 p-1 cursor-pointer hover:text-white hover:bg-orange-500'
        onClick={(e) => {
            e.stopPropagation()
            addToCart(pizza)
        }}
    />



export const PizzaInfo = ({ pizza }) => {

    const pathname = usePathname()
    const { back } = useRouter()

    return (
        <div className="grid lg:grid-cols-[300px_1fr] gap-4 place-items-start">

            <div className='relative w-full'>
                {pathname !== `/pizzas`
                    ? <button
                        onClick={back}
                        className="absolute top-2 right-2 text-sm font-bold cursor-pointer">
                        <IconoAtras />
                    </button>
                    : <Link prefetch
                        href={`/pizzas/${pizza.id}`}
                        className="absolute top-2 right-2 text-sm font-bold cursor-pointer">
                        <IconoVer />
                    </Link>
                }
                <img
                    alt='foto'
                    src={pizza.foto || DEFAULT_PIZZA_IMAGE}
                    className="h-[200px] w-full lg:h-[600px] object-cover"
                />
                <IconoAgregar pizza={pizza} />
            </div>

            <div className="flex flex-col justify-center w-full">
                <p className="text-4xl">{pizza.nombre}</p>
                <p className="text-4xl font-bold text-orange-300">{pizza.precio} €</p>
                <p className="py-4 font-bold text-xl">Ingredientes</p>
                {pizza.ingredientes?.map(ingrediente =>
                    <div className="text-lg" key={ingrediente.id}>
                        <p>{ingrediente.nombre}</p>

                    </div>
                )}
            </div>
        </div>
    )
}




export const PizzaCard = ({ pizza }) =>
    <div className="grid place-content-center cursor-pointer gap-2">
        <div className="font-bold text-2xl ">{pizza.nombre}</div>

        <div className='relative'>
            <img alt='foto'
                src={pizza.foto || DEFAULT_PIZZA_IMAGE}
            />
            <IconoAgregar pizza={pizza} />
        </div>

        <div className="flex justify-end font-bold text-2xl text-stone-700">
            {pizza.precio} €
        </div>
    </div>


