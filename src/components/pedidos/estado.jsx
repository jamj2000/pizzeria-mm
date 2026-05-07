'use client'

import { changeState } from "@/lib/actions/pedidos"
import { LoaderCircleIcon } from "lucide-react"
import { useFormStatus } from "react-dom"

const estados = ['CANCELADO', 'PENDIENTE', 'EN REPARTO', 'ENTREGADO']


const colors = {
    0: 'bg-red-200 text-red-900 border border-red-900',
    1: 'bg-orange-200 text-orange-900 border border-orange-900',
    2: 'bg-blue-200 text-blue-900 border border-blue-900',
    3: 'bg-green-200 text-green-900 border border-green-900'
}


const textoEstado = (codigoEstado) => <span className={`${colors[codigoEstado]} text-xs p-1 px-4 rounded-full `}>
    {estados[codigoEstado]}
</span >





function StateButton({ pedido }) {
    const { pending } = useFormStatus()

    return (
        <button
            disabled={pending}
            className={`disabled:bg-slate-500 rounded-full flex items-center hover:outline hover:outline-black`}
        >
            {pending
                ? <LoaderCircleIcon className={`text-white p-1 size-6 animate-spin`} />
                : textoEstado(pedido.estado)
            }
        </button>
    )
}


export default function Estado({ pedido, editable = false }) {
    if (!editable)
        return textoEstado(pedido.estado)

    return (
        <form action={changeState.bind(null, pedido)}>
            <StateButton pedido={pedido} />
        </form>
    )
}




