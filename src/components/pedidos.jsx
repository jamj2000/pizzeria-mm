'use client'   // <---- IMPORTANTE

import { Form, Button, Modal, Prefetch } from "@/components/simpleui";
import { createPedido, deletePedido, updatePedido } from "@/lib/actions/pedidos";
import { generateInvoicePDF } from "@/lib/utils/invoice-pdf";
import { FilePlusCornerIcon, FilePenLineIcon, TrashIcon, ArrowUpRightIcon, FileText } from "lucide-react";
import Estado from "./pedidos/estado";



export const GenerarFactura = ({ pedido }) =>
    <button
        onClick={() => generateInvoicePDF(pedido)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md text-sm font-semibold"
    >
        <FileText size={18} />
        Descargar Factura
    </button>




const fields = (data) => [
    {
        name: "fecha_hora",
        label: "Fecha y hora",
        component: "InputDate",
        type: "datetime-local"
    },
    {
        name: "repartidorId",
        label: "Repartidor",
        component: "InputSelect",
        options: data?.repartidoresIdNombre?.map(({ id, nombre }) => ([nombre, id, data?.repartidores?.find(r => r.id == id)])) ?? []
    }
]





const FormPedido = ({ data = {}, action, disabled }) => {

    const submit = () => {
        switch (action) {
            case createPedido: return {
                color: "green",
                component: "Submit",
                labels: ["Registrar pedido", "Registrando pedido ..."],
            }

            case updatePedido: return {
                color: "indigo",
                component: "Submit",
                labels: ["Modificar pedido", "Modificando pedido ..."],
            }

            case deletePedido: return {
                color: "red",
                component: "Submit",
                labels: ["Eliminar pedido", "Eliminando pedido ..."]
            }
            default:
                return null
        }
    }

    const submitField = submit();

    return (
        <Form
            data={data}
            action={action}
            disabled={disabled}
            fields={[
                ...fields(data),
                ...(submitField ? [submitField] : [])
            ]}
        />
    )
}




const CreateButton = () => (
    <Button color="green">
        <FilePlusCornerIcon className={"size-4 md:size-6"} />
    </Button>
)


const UpdateButton = () => (
    <Button color="indigo">
        <FilePenLineIcon className={"size-4 md:size-6"} />
    </Button>
)

const DeleteButton = () => (
    <Button color="red">
        <TrashIcon className={"size-4 md:size-6"} />
    </Button>
)


const ViewButton = () => (
    <Button color="blue">
        <ArrowUpRightIcon className={"size-4 md:size-6"} />
    </Button>
)



export const CreatePedido = ({ data = {} }) => (
    <Modal trigger={<CreateButton />} className="my-1">
        <h2 className="text-xl font-bold mb-4 text-green-400">Nuevo Pedido</h2>

        <FormPedido data={data} action={createPedido} />
    </Modal>
)


export const UpdatePedido = ({ data = {} }) => (
    <Modal trigger={<UpdateButton />}>
        <h2 className="text-xl font-bold mb-4 text-indigo-400">Modificar Pedido</h2>

        <FormPedido data={data} action={updatePedido} />
    </Modal>
)



export const DeletePedido = ({ data = {} }) => (
    <Modal trigger={<DeleteButton />}>
        <h2 className="text-xl font-bold mb-4 text-red-400">Eliminar Pedido</h2>

        <FormPedido data={data} action={deletePedido} disabled />
    </Modal>
)


export const ViewPedido = ({ data = {} }) => (
    <Modal trigger={<ViewButton />}>
        <h2 className="text-xl font-bold mb-4 text-blue-400">Información del Pedido</h2>

        <FormPedido data={data} action={async () => ({ type: "success" })} disabled />
    </Modal>
)



export const CardPedido = ({ prefix, data, actions }) => (
    <div className="p-4 flex flex-col gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-600 rounded-md shadow-md shadow-current/20">

        {actions &&
            <div className="flex gap-1 self-end" onClick={e => e.stopPropagation()}             >
                {actions.map((Action, index) =>
                    <Action key={index} data={data} />
                )}
            </div>
        }

        <Estado pedido={data} editable={data.isAdminSession} />

        <Prefetch href={prefix && `${prefix}/${data.id}`}>
            <PedidoCard pedido={data} />
        </Prefetch >

        {data.isAdminSession &&
            <>
                <details>
                    <summary className="cursor-pointer hover:bg-slate-300 p-2">Cliente: {data.cliente?.name}</summary>
                    <p>Dirección: {data.cliente?.address}</p>
                    <p>Teléfono: {data.cliente?.phone}</p>
                </details>
                <details>
                    <summary className="cursor-pointer hover:bg-slate-300 p-2">Repartidor: {data.repartidor?.nombre}</summary>
                    <p>Teléfono: {data.repartidor?.telefono}</p>
                </details>
            </>
        }

    </div >
)



// const Item = ({ pedido, children }) =>
//     <div key={pedido.id} className="max-w-96 p-4 mb-4 bg-indigo-50 rounded-lg border border-indigo-100   ">
//         <div className='flex justify-end items-center gap-1'>
//             {children}
//         </div>

//         <Estado pedido={pedido} editable={isAdminSession} />

//         <Modal trigger={<PedidoCard pedido={pedido} />}>
//             <PedidoInfo pedido={pedido} />
//         </Modal>

//         {isAdminSession &&
//             <>
//                 <details>
//                     <summary className="cursor-pointer hover:bg-slate-300 p-2">Cliente: {pedido.cliente?.name}</summary>
//                     <p>Dirección: {pedido.cliente?.address}</p>
//                     <p>Teléfono: {pedido.cliente?.phone}</p>
//                 </details>
//                 <details>
//                     <summary className="cursor-pointer hover:bg-slate-300 p-2">Repartidor: {pedido.repartidor?.nombre}</summary>
//                     <p>Teléfono: {pedido.repartidor?.telefono}</p>
//                 </details>
//             </>
//         }
//     </div>


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





export const Card2Pedido = ({ prefix, data, actions }) => (

    <div className="p-4 xl:p-2 flex flex-col xl:items-center xl:flex-row gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-600 not-xl:rounded-md not-xl:shadow-md not-xl:shadow-current/20 xl:bg-inherit xl:dark:bg-inherit">

        <Prefetch href={prefix && `${prefix}/${data.id}`}>
            <div className={`place-self-stretch p-2 xl:p-0 xl:grid xl:grid-cols-[2fr_3fr] xl:border-none xl:rounded-none xl:items-center xl:gap-4`}>
                <div className="font-semibold ">{data.nombre}</div>

                <div className="text-sm text-gray-500 dark:text-gray-300">{data.telefono}</div>
            </div>
        </Prefetch>


        {actions &&
            <div className="flex gap-1 justify-end"
                onClick={e => e.stopPropagation()}
            >
                {actions.map((Action, index) =>
                    <Action key={index} data={data} />
                )}
            </div>
        }
    </div>
)