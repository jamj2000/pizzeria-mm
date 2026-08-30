import { Suspense } from "react";
import { getPedido } from "@/lib/data/pedidos";
import { notFound } from "next/navigation";
import { PedidoInfo } from "@/components/pedidos/info";
import { BackLink } from "@/components/simpleui";
import { ArrowLeftIcon } from "lucide-react";



import { GenerarFactura } from "@/components/pedidos";



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

    // return <PedidoInfo pedido={pedido} />


    return (
        <div className="grid lg:grid-cols-[300px_1fr] gap-4 place-items-start">

            <div className='relative w-full'>
                <div className="bg-linear-to-r from-indigo-500 to-indigo-100 h-[200px] w-full lg:h-[600px]" />
            </div>

            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 text-2xl font-bold">
                        <span>Nº {pedido.id}</span>
                        <span className="text-gray-500 font-normal">
                            {new Intl.DateTimeFormat("es-ES", {
                                dateStyle: "full",
                                timeStyle: "short",
                                timeZone: "Europe/Madrid",
                            }).format(pedido.fecha_hora)}
                        </span>
                    </div>
                    <GenerarFactura pedido={pedido} />
                </div>

                <div className="mt-6 space-y-1 text-gray-700">
                    <p><span className="font-semibold text-gray-900">Cliente:</span> {pedido?.cliente?.name}</p>
                    <p><span className="font-semibold text-gray-900">Dirección:</span> {pedido?.cliente?.address}</p>
                    <p><span className="font-semibold text-gray-900">Teléfono:</span> {pedido?.cliente?.phone}</p>
                </div>

                <div className="py-5 max-w-md">
                    <h2 className="font-bold text-lg">Pizzas</h2>
                    {pedido.pedidoPizzas?.map(pp =>
                        <p key={pp.pizza.id} className="flex justify-between shrink-0">
                            <span>{pp.cantidad} x {pp.pizza.nombre}</span> <span>{(pp.cantidad * pp.pizza.precio).toFixed(2)}</span>
                        </p>
                    )}
                    <h3 className="flex justify-between shrink-0 font-bold">
                        <span>TOTAL (€)</span>
                        <span>{pedido.pedidoPizzas?.reduce((acc, pp) => acc + (pp.cantidad * pp.pizza.precio), 0).toFixed(2)}</span>
                    </h3>
                </div>

                <div>Nombre del repartidor: {pedido?.repartidor?.nombre}</div>
                <div>Teléfono del repartidor: {pedido?.repartidor?.telefono}</div>

            </div>
        </div>
    )
}
