import Pedidos from "@/components/pedidos/lista";
import Link from "next/link";
import { Spinner2 } from "@/components/ui/spinners";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getPedidos } from "@/lib/data/pedidos";
import { getRepartidores } from "@/lib/data/repartidores";
import { getPizzas } from "@/lib/data/pizzas";
import { getUsuarios } from "@/lib/data/users";

export const metadata = { title: "Pizzería MM - Pedidos" }

async function getPedidosForSession() {
    const session = await auth()
    const isAdminSession = session?.user?.role === 'ADMIN'
    return getPedidos(!isAdminSession ? session?.user?.id : undefined)
}

export default function PaginaPedidos() {
    return (
        <div>
            <Link href="/" className="text-5xl">🏡</Link>
            <h1 className="text-3xl font-bold mb-4">LISTA DE PEDIDOS</h1>

            <Suspense fallback={"..."}>
                <Contenido />
            </Suspense>
        </div>
    )
}


async function Contenido() {
    const [
        pedidos,
        repartidores,
        pizzas,
        clientes,
        session
    ] = await Promise.all([
        getPedidosForSession(),
        getRepartidores(),
        getPizzas(),
        getUsuarios(),
        auth()
    ])

    return (
        <Pedidos
            pedidos={pedidos}
            repartidores={repartidores}
            pizzas={pizzas}
            clientes={clientes}
            session={session}
        // isAdminSession={isAdminSession}
        />
    )

}