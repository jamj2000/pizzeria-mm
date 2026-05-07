
'use client'
import { RefreshCwIcon } from "lucide-react"
import { useActionState, useId, useEffect } from "react"
import { toast } from "sonner"
import { labelDefault } from "@/components/ui/labels"



export default function Form({ action, repartidor, disabled = false, labelSubmit = labelDefault }) {
    const formId = useId()
    const [state, faction, isPending] = useActionState(action, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
        if (state.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form id={formId} action={faction} className="grid lg:grid-cols-[300px_1fr] gap-4" >
            <input type="hidden" name="id" defaultValue={repartidor?.id} />

            <img src={'/images/default-repartidor.jpg'} alt='repartidor' className='h-[200px] w-full lg:h-full object-contain' />

            <div className="p-4 flex flex-col w-full gap-2 bg-gray-100">

                <button
                    type="submit"
                    className="w-full h-12 flex justify-center items-center rounded-md hover:cursor-pointer hover:opacity-80 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    disabled={isPending}
                >
                    {isPending
                        ? <RefreshCwIcon size={20} className="animate-spin" />
                        : labelSubmit
                    }
                </button>



                <input
                    name='nombre'
                    defaultValue={repartidor?.nombre}
                    placeholder="Nombre"
                    className="w-full appearance-none text-3xl md:text-4xl bg-white disabled:bg-white"
                    disabled={disabled}
                    required
                />

                <input
                    name='telefono'
                    defaultValue={repartidor?.telefono}
                    placeholder="Teléfono"
                    className="w-full appearance-none text-xl md:text-2xl bg-white disabled:bg-white"
                    disabled={disabled}
                    required
                />
            </div>


        </form >
    )
}



