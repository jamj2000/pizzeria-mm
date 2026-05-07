import Pedidos from "@/components/pedidos/lista";
import Link from "next/link";
import { Spinner2 } from "@/components/ui/spinners";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { obtenerPedidos } from "@/lib/data/pedidos";
import { obtenerRepartidores } from "@/lib/data/repartidores";
import { obtenerPizzas } from "@/lib/data/pizzas";
import { obtenerUsuarios } from "@/lib/data/users";

export const metadata = { title: "Pizzería MM - Pedidos" }



export default async function PaginaPedidos() {
    const session = await auth()

    const isAdminSession = session?.user?.role === 'ADMIN'


    return (
        <div>
            <Link href="/" className="text-5xl">🏡</Link>
            <h1 className="text-3xl font-bold mb-4">LISTA DE PEDIDOS</h1>

            <Suspense fallback={<Spinner2 />}>
                <Pedidos
                    promesaPedidos={obtenerPedidos(!isAdminSession ? session?.user.id : undefined)}
                    promesaRepartidores={obtenerRepartidores()}
                    promesaPizzas={obtenerPizzas()}
                    promesaClientes={obtenerUsuarios()}
                    promesaSession={auth()}
                />
            </Suspense>
        </div>
    )

}
