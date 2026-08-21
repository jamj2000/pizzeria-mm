import { Suspense } from "react";
import { getPedido } from "@/lib/data/pedidos";
import { notFound } from "next/navigation";
import { PedidoInfo } from "@/components/pedidos/info";


export default function PaginaPedido({ params }) {
    return (
        <Suspense fallback={"..."}>
            <Pedido paramsPromise={params} />
        </Suspense>
    )
}

async function Pedido({ paramsPromise }) {
    const { id } = await paramsPromise
    const pedido = await getPedido(id)
    if (!pedido) notFound()

    return <PedidoInfo pedido={pedido} />
}


