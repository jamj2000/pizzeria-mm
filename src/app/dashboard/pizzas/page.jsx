import { Suspense } from "react";
import { getPizzas } from "@/lib/data/pizzas";
import { getIngredientesIdNombre } from "@/lib/data/ingredientes";
import { auth } from "@/lib/auth";
import { List } from "@/components/simpleui";
import { CardAdminPizza, CreatePizza, DeletePizza, UpdatePizza, ViewPizza } from "@/components/pizzas";

import { connection } from "next/server";
import { Spinner1 } from "@/components/ui/spinners";

export const metadata = { title: "Pizzería MM - Pizzas" }



export default function Page() {

    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">Gestión de Pizzas</h1>

            <Suspense fallback={<Spinner1 />}>
                <Content />
            </Suspense>
        </div>

    )

}




async function Content() {
    await connection()    // Necesario porque NextAuth v5 hace uso de crypto.getRandomValues() durante el prerendering
    const session = await auth()

    const isAdminSession = session?.user?.role === 'ADMIN'

    const [
        pizzas,
        ingredientesIdNombre,
    ] = await Promise.all([
        getPizzas(),
        getIngredientesIdNombre(),
    ])


    const data = pizzas.map(p => ({
        ...p,
        ingredientesIdNombre
    }))


    return (
        <List
            prefix="/pizzas"
            card={CardAdminPizza}
            data={data}
            columns={[
                { name: "nombre", label: "Nombre" },
                { name: "precio", label: "Precio" },
            ]}
            actions={[
                ...(isAdminSession ? [UpdatePizza, DeletePizza] : [])
            ]}
            sort="nombre"
        >
            <div className="flex justify-between">
                <h2 className="text-2xl text-center inline"></h2>
                <CreatePizza data={data} />
            </div>
        </List>
    )

}
