import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect, } from "next/navigation";
import { getRepartidores } from "@/lib/data/repartidores";
import { List } from "@/components/simpleui";
import { CreateRepartidor, ViewRepartidor, UpdateRepartidor, DeleteRepartidor, CardPublicRepartidor, CardAdminRepartidor } from "@/components/repartidores";

import { connection } from "next/server";

export const metadata = { title: "Pizzería MM - Repartidores" }



export default function Page() {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">REPARTIDORES</h1>

            <Suspense fallback={"..."}>
                <Content />
            </Suspense>
        </div>
    )
}




async function Content() {
    await connection()    // Necesario porque NextAuth v5 hace uso de crypto.getRandomValues() durante el prerendering
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') redirect('/dashboard')


    const repartidores = await getRepartidores()

    return (
        <List
            prefix="/repartidores"
            card={CardAdminRepartidor}
            data={repartidores}
            columns={[
                { name: "nombre", label: "Nombre" },
                { name: "telefono", label: "Teléfono" },
            ]}
            actions={[
                // ViewRepartidor,
                UpdateRepartidor,
                DeleteRepartidor
            ]}
            sort="nombre"
        >
            <div className="flex justify-between">
                <h2 className="text-2xl text-center inline"></h2>
                <CreateRepartidor />
            </div>
        </List>
    )

}



