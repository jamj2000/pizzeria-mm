'use client'
import { defaultImage } from "@/lib/constants"
import { MinusIcon, PlusIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"



export default function CheckPizza({ pizza, cant = 0, disabled = false }) {

    const [cantidad, setCantidad] = useState(cant)

    return (
        <div className={`flex flex-row items-center gap-2 p-2 py-1 even:bg-indigo-100 odd:bg-slate-100 ${cantidad > 0 ? 'bg-lime-100 border-green-500 shadow-md' : 'bg-slate-100 border-slate-300'}`}>

            <input type="hidden" name={`pizzas`} value={JSON.stringify({ id: pizza.id, cantidad })} />

            <Image
                width={100}
                height={100}
                src={pizza.foto || defaultImage}
                alt={pizza.nombre}
                className="size-16 object-cover rounded-md"
            />
            <div className="flex-1 text-left">
                <h3 className="text-md font-bold">{pizza.nombre}</h3>
                <p className="text-stone-500">{pizza.precio} € / ud.</p>
            </div>


            <div className="flex flex-col justify-center items-center p-2">
                <span className="text-lg self-end text-slate-500">{(pizza.precio * cantidad).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCantidad(c => Math.max(0, c - 1))}
                        disabled={cantidad === 0 || disabled}
                        className="size-6 rounded-full bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 disabled:opacity-30 disabled:hover:bg-red-100 flex items-center justify-center transition-colors"
                    >
                        <MinusIcon size={10} />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{cantidad}</span>
                    <button
                        type="button"
                        onClick={() => setCantidad(c => c + 1)}
                        disabled={disabled}
                        className="size-6 rounded-full bg-green-100 text-green-600 border border-green-300 hover:bg-green-200 disabled:opacity-30 disabled:hover:bg-green-100 flex items-center justify-center transition-colors"
                    >
                        <PlusIcon size={14} />
                    </button>
                </div>

            </div>

        </div >
    )
}
