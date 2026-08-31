import Pedidos from "@/components/pedidos/lista";
import { Spinner2 } from "@/components/ui/spinners";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getPedidos } from "@/lib/data/pedidos";
import { getRepartidoresIdNombre } from "@/lib/data/repartidores";
import { getPizzasIdNombre } from "@/lib/data/pizzas";
import { getUsersIdNombre } from "@/lib/data/users";

import { connection } from "next/server";
import { List } from "@/components/simpleui";
import { CardPedido, CreatePedido, DeletePedido, UpdatePedido } from "@/components/pedidos";

export const metadata = { title: "Pizzería MM - Pedidos" }



async function getPedidosForSession() {
    await connection()    // Necesario porque NextAuth v5 hace uso de crypto.getRandomValues() durante el prerendering
    const session = await auth()
    const isAdminSession = session?.user?.role === 'ADMIN'
    return getPedidos(!isAdminSession ? session?.user?.id : undefined)
}




export default function Page() {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">PEDIDOS</h1>

            <Suspense fallback={"..."}>
                <Content />
            </Suspense>
        </div>
    )
}


async function Content() {
    const [
        pedidos,
        repartidoresIdNombre,
        pizzasIdNombre,
        clientesIdNombre,
        session
    ] = await Promise.all([
        getPedidosForSession(),
        getRepartidoresIdNombre(),
        getPizzasIdNombre(),
        getUsersIdNombre(),
        auth()
    ])


    const isAdminSession = session?.user?.role === 'ADMIN'

    const data = pedidos.map(p => ({
        ...p,
        repartidoresIdNombre,
        pizzasIdNombre,
        clientesIdNombre,
        isAdminSession
    }))


    // return (
    //     <List
    //         prefix="/pedidos"
    //         card={CardPedido}
    //         data={data}
    //         columns={[
    //             { name: "fecha_hora", label: "Fecha" },
    //             { name: "cliente", label: "Cliente" },
    //             { name: "repartidor", label: "Repartidor" },
    //         ]}
    //         actions={[
    //             ...(isAdminSession ? [UpdatePedido, DeletePedido] : [])
    //         ]}
    //         sort="fecha_hora"
    //         direction="asc"
    //     >
    //         <div className="flex justify-between">
    //             <h2 className="text-2xl text-center inline"></h2>
    //             <CreatePedido />
    //         </div>
    //     </List>
    // )

    return (
        <Pedidos
            pedidos={pedidos}
            repartidores={repartidoresIdNombre}
            pizzas={pizzasIdNombre}
            clientes={clientesIdNombre}
            session={session}
        // isAdminSession={isAdminSession}
        />
    )



}