'use client'   // <---- IMPORTANTE

import { Form, Button, Modal, Prefetch } from "@/components/simpleui";
import { createRepartidor, deleteRepartidor, updateRepartidor } from "@/lib/actions/repartidores";
import { FilePlusCornerIcon, FilePenLineIcon, TrashIcon, ArrowUpRightIcon } from "lucide-react";



const fields = (data) => [
    {
        name: "id",
        component: "InputHidden",
        value: data?.id,
    },
    {
        name: "nombre",
        label: "Nombre",
        component: "InputText"
    },
    {
        name: "telefono",
        label: "Teléfono",
        component: "InputText"
    }
]


const FormRepartidor = ({ data = {}, action, disabled }) => {

    const submit = () => {
        switch (action) {
            case createRepartidor: return {
                color: "green",
                component: "Submit",
                labels: ["Registrar repartidor", "Registrando repartidor ..."],
            }

            case updateRepartidor: return {
                color: "indigo",
                component: "Submit",
                labels: ["Modificar repartidor", "Modificando repartidor ..."],
            }

            case deleteRepartidor: return {
                color: "red",
                component: "Submit",
                labels: ["Eliminar repartidor", "Eliminando repartidor ..."]
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



export const CreateRepartidor = ({ data = {} }) => (
    <Modal trigger={<CreateButton />} className="my-1">
        <h2 className="text-xl font-bold mb-4 text-green-400">Nuevo Repartidor</h2>

        <FormRepartidor data={data} action={createRepartidor} />
    </Modal>
)


export const UpdateRepartidor = ({ data = {} }) => (
    <Modal trigger={<UpdateButton />}>
        <h2 className="text-xl font-bold mb-4 text-indigo-400">Modificar Repartidor</h2>

        <FormRepartidor data={data} action={updateRepartidor} />
    </Modal>
)



export const DeleteRepartidor = ({ data = {} }) => (
    <Modal trigger={<DeleteButton />}>
        <h2 className="text-xl font-bold mb-4 text-red-400">Eliminar Repartidor</h2>

        <FormRepartidor data={data} action={deleteRepartidor} disabled />
    </Modal>
)


export const ViewRepartidor = ({ data = {} }) => (
    <Modal trigger={<ViewButton />}>
        <h2 className="text-xl font-bold mb-4 text-blue-400">Información del Repartidor</h2>

        <FormRepartidor data={data} action={async () => ({ type: "success" })} disabled />
    </Modal>
)



export const CardRepartidor = ({ prefix, data, actions }) => (
    <div className="p-4 flex flex-col gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-600 rounded-md shadow-md shadow-current/20">

        <Prefetch href={prefix && `${prefix}/${data.id}`}>
            <div className="flex flex-col gap-2 p-2">
                <div className="font-semibold ">{data.nombre}</div>

                <div className="text-sm text-gray-500 dark:text-gray-300">{data.telefono}</div>
            </div>
        </Prefetch >

        {actions &&
            <div className="flex gap-1 self-end"
                onClick={e => e.stopPropagation()}
            >
                {actions.map((Action, index) =>
                    <Action key={index} data={data} />
                )}
            </div>
        }
    </div >
)



export const Card2Repartidor = ({ prefix, data, actions }) => (

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