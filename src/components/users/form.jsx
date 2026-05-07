'use client'
import { RefreshCwIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import { labelDefault } from "../ui/labels";
import CheckBox from "../ui/check-box";
import InputAvatar from "../ui/input-avatar";


export default function Form({ action, isAdminSession, user, disabled = false, labelSubmit = labelDefault }) {
    const formId = useId()
    const [state, faction, isPending] = useActionState(action, {})


    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
        if (state?.error) toast.error(state.error)
        if (state?.ok) {
            document.getElementById(formId)?.closest('dialog')?.close()
        }

    }, [state])


    return (
        <>
            <form id={formId} action={faction} className="grid lg:grid-cols-[300px_1fr] gap-4">
                <input type="hidden" name="id" defaultValue={user?.id} />

                <div className="flex flex-col gap-2">

                    {disabled
                        ? <img src={user?.image || '/images/avatar-80.png'} alt="Imagen de usuario" className='h-[200px] w-full lg:h-full object-contain' />
                        : < InputAvatar name='image' user={user} />
                    }

                    {isAdminSession
                        ?
                        <CheckBox
                            key={`active-${user?.active}`}
                            name={'active'}
                            defaultChecked={user?.active == true}
                            className={"self-center mb-4 text-sm w-fit after:content-['_Cuenta_no_activa'] has-checked:after:content-['_Cuenta_activa'] has-checked:bg-blue-200 has-checked:text-blue-800  px-2 py-1 text-gray-500"}
                            disabled={disabled}
                        />
                        : <input type="hidden" name="active" defaultValue={user?.active} />
                    }

                </div>

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
                        name='name'
                        defaultValue={user?.name}
                        placeholder="Nombre"
                        className="w-full appearance-none text-3xl md:text-4xl bg-white disabled:bg-white focus:outline-none focus:border-blue-400"
                        disabled={disabled}
                        required
                    />

                    <input
                        name='email'
                        defaultValue={user?.email}
                        placeholder="Email"
                        className="w-full appearance-none text-xl md:text-2xl bg-white disabled:bg-white focus:outline-none focus:border-blue-400"
                        disabled={disabled}
                        required
                    />

                    <input
                        name='password'
                        type='password'
                        placeholder='no cambiar contraseña'
                        className="w-full appearance-none text-xl md:text-2xl bg-white disabled:bg-white focus:outline-none focus:border-blue-400"
                        disabled={disabled}
                    />
                    <input
                        name='address'
                        defaultValue={user?.address}
                        placeholder="Domicilio"
                        className="w-full appearance-none text-xl md:text-2xl bg-white disabled:bg-white focus:outline-none focus:border-blue-400"
                        disabled={disabled}
                    />

                    <input
                        name='phone'
                        defaultValue={user?.phone}
                        placeholder="Teléfono"
                        className="w-full appearance-none text-xl md:text-2xl bg-white disabled:bg-white focus:outline-none focus:border-blue-400"
                        disabled={disabled}
                    />


                    {isAdminSession
                        ?
                        <select
                            key={user?.role}
                            name="role"
                            defaultValue={user?.role || 'USER'}
                            size={2}
                            className="w-full text-md px-3 py-2 rounded-lg focus:outline-none bg-gray-100"
                            disabled={disabled}
                        >
                            <option value='USER' className="p-2 text-center text-xl checked:bg-blue-600 checked:text-white"> USER </option>
                            <option value='ADMIN' className="p-2 text-center text-xl checked:bg-blue-600 checked:text-white"> ADMIN </option>
                        </select>
                        :
                        <input type="hidden" name="role" defaultValue={user?.role} />
                    }
                </div>
            </form>


            <div className="text-lg flex flex-col gap-2">
                <h2 className="text-xl font-bold mt-4">Pedidos realizados</h2>

                {!user?.pedidos?.length
                    ? <p>No se han realizados pedidos aún</p>
                    : user?.pedidos?.sort((a, b) => b.id - a.id).map(pedido =>

                        <div key={pedido.id} className="flex gap-4 items-center">
                            <span>{pedido.id.toString().padStart(4, '_')}</span>
                            <span>{pedido.fecha_hora.toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "Europe/Madrid",
                            })}</span>

                            <span>{['CANCELADO', 'PENDIENTE', 'EN REPARTO', 'ENTREGADO'][pedido.estado]}</span>
                        </div>
                    )}
            </div >

        </>
    )
}
