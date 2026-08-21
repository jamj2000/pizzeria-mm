import Pizzas from "@/components/pizzas/lista";
import Link from "next/link";
import { Spinner2 } from "@/components/ui/spinners";
import { Suspense } from "react";
import { getPizzas } from "@/lib/data/pizzas";
import { getIngredientes } from "@/lib/data/ingredientes";
import { auth } from "@/lib/auth";

export const metadata = { title: "Pizzería MM - Pizzas" }



export default function PaginaPizzas() {

    return (
        <div>
            <Link href="/" className="text-5xl">🏡</Link>
            <h1 className="text-3xl font-bold mb-4">LISTA DE PIZZAS</h1>


            <Suspense fallback={"..."}>
                <Contenido />
            </Suspense>
        </div>

    )

}



async function Contenido() {

    const [
        pizzas,
        ingredientes,
        session
    ] = await Promise.all([
        getPizzas(),
        getIngredientes(),
        auth()
    ])

    return <Pizzas
        pizzas={pizzas}
        ingredientes={ingredientes}
        session={session}
    />
}