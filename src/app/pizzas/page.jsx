import { Suspense } from "react";
import { getPizzas } from "@/lib/data/pizzas";
import { getIngredientes, getIngredientesIdNombre } from "@/lib/data/ingredientes";
import { auth } from "@/lib/auth";
import { List } from "@/components/simpleui";
import { CardPizza, CreatePizza, DeletePizza, UpdatePizza, ViewPizza } from "@/components/pizzas";

export const metadata = { title: "Pizzería MM - Pizzas" }



export default function Page() {

    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">PIZZAS</h1>


            <Suspense fallback={"..."}>
                <Content />
            </Suspense>
        </div>

    )

}




async function Content() {

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

    console.log(data)

    return (
        <List
            prefix="/pizzas"
            card={CardPizza}
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
                <CreatePizza />
            </div>
        </List>
    )

}



