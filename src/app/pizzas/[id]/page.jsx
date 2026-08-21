import { Suspense } from "react";
import { getPizza } from "@/lib/data/pizzas";
import { notFound } from "next/navigation";
import { PizzaInfo } from "@/components/pizzas/info";




export default function PaginaPizza({ params }) {
    return (
        <Suspense fallback={"..."}>
            <Pizza paramsPromise={params} />
        </Suspense>
    )
}

async function Pizza({ paramsPromise }) {
    const { id } = await paramsPromise
    const pizza = await getPizza(id)
    if (!pizza) notFound()

    return <PizzaInfo pizza={pizza} />
}

