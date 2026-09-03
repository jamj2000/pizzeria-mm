import { Suspense } from "react";
import { getPizzas } from "@/lib/data/pizzas";
import { List } from "@/components/simpleui";
import { CardPublicPizza } from "@/components/pizzas";


export const metadata = { title: "Pizzería MM - Pizzas" }


export default function Page() {

    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">NUESTRAS PIZZAS</h1>


            <Suspense fallback={"..."}>
                <Content />
            </Suspense>
        </div>

    )

}




async function Content() {
    const pizzas = await getPizzas()

    return (
        <List
            prefix="/pizzas"
            card={CardPublicPizza}
            data={pizzas}
            columns={[
                { name: "nombre", label: "Nombre" },
                { name: "precio", label: "Precio" },
            ]}
            sort="nombre"
        />

    )
}




