import { Suspense } from "react";
import { getPedido } from "@/lib/data/pedidos";
import { notFound } from "next/navigation";
import { PedidoInfo } from "@/components/pedidos/info";
import { BackLink } from "@/components/simpleui";
import { ArrowLeftIcon } from "lucide-react";


export default function Page({ params }) {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>

            <h1 className="mb-10 py-2 text-3xl font-bold flex gap-2 items-center border-b-4 border-b-blue-400">
                <BackLink>
                    <ArrowLeftIcon
                        size={40}
                        className='p-1 rounded-full  text-blue-500 border bg-blue-200  border-blue-500  hover:text-white hover:bg-blue-500'
                    />
                </BackLink>
                Información del pedido
            </h1>


            <Suspense fallback={"..."}>
                <Content params={params} />
            </Suspense>
        </div>
    )
}

async function Content({ params }) {
    const { id } = await params
    const pedido = await getPedido(id)
    if (!pedido) notFound()

    return <PedidoInfo pedido={pedido} />
}


