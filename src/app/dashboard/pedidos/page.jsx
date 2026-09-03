import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getPedidos } from "@/lib/data/pedidos";
import { Spinner1 } from "@/components/ui/spinners";
import Estado from "@/components/pedidos/estado";
import { PedidoCard } from "@/components/pedidos/info";
import Link from 'next/link';
import Image from "next/image";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const metadata = { title: "Pizzería MM - Pedidos Dashboard" }

export default function Page() {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">Gestión de Pedidos</h1>

            <Suspense fallback={<Spinner1 />}>
                <Content />
            </Suspense>
        </div>
    )
}

async function Content() {
    await connection()
    const session = await auth()
    if (!session) redirect('/login')

    return <UserPedidos session={session} />
}



async function UserPedidos({ session }) {
    const isAdminSession = session.user.role === 'ADMIN'

    let pedidos
    if (isAdminSession) pedidos = await getPedidos()        // Pedidos de todos los usuarios
    else pedidos = await getPedidos(session.user.id)

    if (pedidos.length === 0) return <p>No se han realizado pedidos aún</p>

    return (
        <div>
            <h2 className="text-xl font-bold my-6">Lista de pedidos</h2>

            <div className="flex flex-col gap-2">
                {pedidos
                    .toSorted((a, b) => b.fecha_hora - a.fecha_hora)  // ordenado desde reciente a antiguo
                    .map(pedido =>
                        <div key={pedido.id} className="p-2 flex justify-between items-center gap-4 rounded-full even:bg-blue-100 odd:bg-slate-100 hover:outline hover:outline-slate-400">
                            <Link href={`/pedidos/${pedido.id}`}>
                                <div className="relative group font-mono grid grid-cols-[40px_60px_auto] items-center">
                                    <Image
                                        width={40}
                                        height={40}
                                        src={pedido.cliente?.image || '/images/avatar-80.png'}
                                        alt="avatar"
                                        className="size-8 rounded-full"
                                    />

                                    <span>{pedido.id.toString().padStart(4, '_')}</span>
                                    <span>{new Date(pedido.fecha_hora).toLocaleDateString("es-ES", {
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
                    )}
            </div>
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
            <Image
                width={80}
                height={80}
                src={pedido.cliente?.image || '/images/avatar-80.png'}
                alt=""
                className="size-14 rounded-full"
            />
            <div>
                <p>Cliente: {pedido.cliente?.name}</p>
                <p>Dirección: {pedido.cliente?.address}</p>
                <p>Teléfono: {pedido.cliente?.phone}</p>
            </div>
        </div>

        <div className="mt-4 border border-slate-300 rounded-md p-2">
            <p>Repartidor: {pedido.repartidor?.nombre}</p>
            <p>Tfno repartidor: {pedido.repartidor?.telefono}</p>
        </div>
    </div>
