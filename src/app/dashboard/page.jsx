import { auth } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import { LockIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense, use } from "react";
import { obtenerUsuarios } from "@/lib/data/users";
import { obtenerUsuarioPorId } from "@/lib/data/users";
import { IconoEliminar, IconoModificar } from "@/components/ui/icons";
import { editUser } from "@/lib/actions/users";
import { labelModificar } from "@/components/ui/labels";
import Form from "@/components/users/form";
import Modal from "@/components/ui/modal";
import ListaUsuarios from "@/components/users/lista";
import { obtenerPedidos } from "@/lib/data/pedidos";
import { Spinner1, Spinner2 } from "@/components/ui/spinners";
import Estado from "@/components/pedidos/estado";
import { PedidoCard } from "@/components/pedidos/info";
import Link from 'next/link'

export const metadata = { title: "Pizzería MM - Dashboard" }


export default async function Dashboard() {
    const session = await auth()

    if (!session) redirect('/login')

    const isAdminSession = session?.user?.role === 'ADMIN'

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <form action={logout}>
                    <button className="flex gap-2 justify-center items-center px-4 py-2 rounded-full hover:outline hover:outline-slate-300 cursor-pointer" >
                        <LockIcon /> <span className="hidden md:block">Cerrar sesión</span>
                    </button>
                </form>
            </div>

            <Suspense fallback={<Spinner2 />}>
                <UserInfo session={session} />
            </Suspense>



            {isAdminSession &&
                <>
                    <h1 className="text-xl font-bold mt-15">Lista de usuarios</h1>
                    <Suspense fallback={<Spinner1 />}>
                        <ListaUsuarios session={session} promesaUsuarios={obtenerUsuarios()} />
                    </Suspense>
                </>
            }


            <Link href="/pedidos">
                <h1 className="text-xl font-bold mt-15 mb-8">Lista de pedidos</h1>
            </Link>
            <Suspense fallback={<Spinner1 />}>
                {isAdminSession
                    ? <UserPedidos isAdminSession={isAdminSession} promesaPedidos={obtenerPedidos()} /> // Todos los pedidos
                    : <UserPedidos isAdminSession={isAdminSession} promesaPedidos={obtenerPedidos(session.user.id)} />
                }
            </Suspense>
        </div >
    )
}








async function UserInfo({ session }) {

    const usuario = await obtenerUsuarioPorId(session.user.id)
    const isAdminSession = session.user.role === 'ADMIN'

    return (
        <div className="grid md:grid-cols-[160px_auto] gap-2">

            <img src={usuario?.image || '/images/avatar-80.png'} className="size-36" alt="Imagen de usuario" />

            <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                    <p className="font-bold">{usuario.name}</p>
                    <Modal trigger={<IconoModificar />}>
                        <Form action={editUser} isAdminSession={isAdminSession} user={usuario} labelSubmit={labelModificar} />
                    </Modal>
                </div>
                <p>{usuario.email}</p>
                <p>{usuario.address}</p>
                <p>{usuario.phone}</p>
                <p>{usuario.role}</p>
            </div>
        </div>

    )
}




function UserPedidos({ isAdminSession, promesaPedidos }) {
    const pedidos = use(promesaPedidos)

    if (pedidos.length == 0) return <p>No se han realizados pedidos aún</p>



    return pedidos
        .sort((a, b) => b.fecha_hora - a.fecha_hora)  // ordenado desde reciente a antiguo
        .map(pedido =>
            <div key={pedido.id} className="p-2 flex  justify-between items-center gap-4 rounded-full even:bg-blue-100 odd:bg-slate-100 hover:outline hover:outline-slate-400">
                <Link href={`/pedidos/${pedido.id}`}>
                    <div className="relative group font-mono grid grid-cols-[40px_60px_auto] items-center">
                        <img src={pedido.cliente.image} alt="avatar" className="size-8" />

                        <span>{pedido.id.toString().padStart(4, '_')}</span>
                        <span>{pedido.fecha_hora.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Europe/Madrid",
                        })}</span>
                        <Popover pedido={pedido} />
                    </div>
                </Link>
                <Estado pedido={pedido} editable={isAdminSession} />
            </div>
        )
}




const Popover = ({ pedido }) =>
    <div className="absolute left-10 bottom-10 z-50 mt-2 hidden group-hover:block bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-2xl p-4 min-w-[320px]">
        <div className="border border-slate-300 rounded-md p-2">
            <PedidoCard pedido={pedido} />
            <Estado pedido={pedido} />
        </div>

        <div className="grid grid-cols-[60px_auto] gap-4 mt-4 border border-slate-300 rounded-md p-2">
            <img src={pedido.cliente.image} alt="" className="size-14" />
            <div>
                <p>Cliente: {pedido.cliente.name}</p>
                <p>Dirección: {pedido.cliente.address}</p>
                <p>Teléfono: {pedido.cliente.phone}</p>
            </div>
        </div>

        <div className="mt-4 border border-slate-300 rounded-md p-2">
            <p>Repartidor: {pedido.repartidor?.nombre}</p>
            <p>Tfno repartidor: {pedido.repartidor?.telefono}</p>
        </div>
    </div>