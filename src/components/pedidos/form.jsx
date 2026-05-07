
'use client'
import { labelDefault } from "../ui/labels"
import { RefreshCwIcon } from "lucide-react";
import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import CheckPizza from "./check-pizza";
import CheckRadio from "../ui/check-radio";



export default function Form({ action, user, pedido, pizzas, repartidores, disabled = false, labelSubmit = labelDefault }) {
    const formId = useId()
    const [state, faction, isPending] = useActionState(action, {})

    const isAdminSession = user?.role === 'ADMIN'

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
        if (state.error) {
            toast.error(state.error)
        }
    }, [state])


    const [fechaActual] = useState(() => {
        const ahora = new Date()
        const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
        return local.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
    })

    const fechaPedido = pedido?.fecha_hora
        ? new Date(pedido?.fecha_hora - pedido?.fecha_hora.getTimezoneOffset() * 60000).toISOString().split('Z')[0]
        : fechaActual

    const pedidoPizzas = pedido?.pedidoPizzas


    return (
        <form id={formId} action={faction} className="flex flex-col gap-2 text-sm" >
            <input type="hidden" name="id" defaultValue={pedido?.id} />
            <input type='hidden' name="clienteId" defaultValue={user.id} />

            <button
                type="submit"
                className="w-full h-12 flex justify-center items-center rounded-md hover:cursor-pointer hover:opacity-80 disabled:bg-slate-300 disabled:cursor-not-allowed outline-none"
                disabled={isPending}
            >
                {isPending
                    ? <RefreshCwIcon size={20} className="animate-spin" />
                    : labelSubmit
                }
            </button>

            <p className="font-bold">Pedido {pedido?.id}</p>

            <label> Fecha y hora:
                <input
                    name="fecha_hora"
                    type="datetime-local"
                    className="w-full"
                    defaultValue={fechaPedido}
                    disabled={disabled}
                />
            </label>


            {isAdminSession &&
                <>
                    <p className="font-bold">Repartidor</p>
                    <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {repartidores.map(repartidor =>
                            <CheckRadio
                                key={repartidor.id}
                                name="repartidorId"
                                disabled={disabled}
                                defaultValue={repartidor.id}
                                defaultChecked={pedido?.repartidorId === repartidor.id}
                            >
                                {repartidor.nombre}
                            </CheckRadio>
                        )}
                    </div>
                </>
            }

            <p className="font-bold">Pizzas</p>
            <div className="grid gap-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {pizzas.map(pizza =>
                    <CheckPizza
                        key={pizza.id}
                        pizza={pizza}
                        disabled={disabled}
                        cant={pedidoPizzas?.find(p => p.pizzaId === pizza.id)?.cantidad || 0}
                    />
                )}
            </div>
        </form >
    )
}


