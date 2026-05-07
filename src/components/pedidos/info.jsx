'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { IconoAtras, IconoVer } from "@/components/ui/icons"
import { generateInvoicePDF } from "@/lib/utils/invoice-pdf"
import { FileText } from "lucide-react"





export const PedidoInfo = ({ pedido }) => {

    const pathname = usePathname()
    const { back } = useRouter()

    return (
        <div className="grid lg:grid-cols-[300px_1fr] gap-4 place-items-start">

            <div className='relative w-full'>
                {pathname !== `/pedidos`
                    ? <button
                        onClick={back}
                        className="absolute top-2 right-2 text-sm font-bold cursor-pointer">
                        <IconoAtras />
                    </button>
                    : <Link prefetch
                        href={`/pedidos/${pedido.id}`}
                        className="absolute top-2 right-2 text-sm font-bold cursor-pointer">
                        <IconoVer />
                    </Link>
                }
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
                    <button
                        onClick={() => generateInvoicePDF(pedido)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md text-sm font-semibold"
                    >
                        <FileText size={18} />
                        Descargar Factura
                    </button>
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



export const PedidoCard = ({ pedido }) =>
    <div className="cursor-pointer hover:bg-indigo-100 my-2 p-2">
        <div className="flex gap-4 font-bold">
            <span>Nº {pedido.id}</span>
            <span>
                {new Intl.DateTimeFormat("es-ES", {
                    dateStyle: "full",
                    timeStyle: "long",
                    timeZone: "Europe/Madrid",
                }).format(pedido.fecha_hora)}
            </span>
        </div>
        <div className="pt-5">
            <h2 className="font-bold text-lg">Pizzas</h2>
            {pedido.pedidoPizzas?.map(pp =>
                <p key={pp.pizza.id} className="flex justify-between shrink-0">
                    <span>{pp.cantidad} x {pp.pizza.nombre}</span> <span>{(pp.cantidad * pp.pizza.precio).toFixed(2)}</span>
                </p>
            )}
            <h3 className="flex justify-between shrink-0 font-bold">
                <span>TOTAL (€)</span>
                <span>{pedido.pedidoPizzas?.reduce((acc, pp) => acc + pp.cantidad * pp.pizza.precio, 0).toFixed(2)}</span>
            </h3>
        </div>
    </div>


