'use client'   // <---- IMPORTANTE

import { Form, Button, Modal, Prefetch } from "@/components/simpleui";
import { createPizza, deletePizza, updatePizza } from "@/lib/actions/pizzas";
import { defaultImage } from "@/lib/constants";
import { useCart } from "@/lib/store/cart";
import { PlusIcon, FilePlusCornerIcon, FilePenLineIcon, TrashIcon, ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";



export const AddToCart = ({ pizza, className = '' }) => {
    const addToCart = useCart(state => state.addToCart)

    return (
        <PlusIcon size={24}
            className={`${className} text-orange-500 border border-orange-500 rounded-full bg-orange-200 p-1 cursor-pointer hover:text-white hover:bg-orange-500`}
            onClick={(e) => {
                e.stopPropagation()
                addToCart(pizza)
            }}
        />
    )
}




const fields = (data) => [
    {
        name: "foto",
        label: "Foto",
        component: "InputImage",
        width: 240,
        height: 240,
        className: "self-end"
    },
    {
        name: "nombre",
        label: "Nombre",
        component: "InputText"
    },
    {
        name: "precio",
        label: "Precio",
        component: "InputNumber"
    },
    {
        name: "ingredientes",
        label: "Ingredientes",
        component: "InputGroup",
        multiple: true,
        options: data?.ingredientesIdNombre?.map(({ id, nombre }) => ([nombre, id, data?.ingredientes?.find(i => i.id == id)])) ?? []
    }
]



const FormPizza = ({ data = {}, action, disabled }) => {
    const submit = () => {
        switch (action) {
            case createPizza: return {
                color: "green",
                component: "Submit",
                labels: ["Registrar pizza", "Registrando pizza ..."],
            }

            case updatePizza: return {
                color: "indigo",
                component: "Submit",
                labels: ["Modificar pizza", "Modificando pizza ..."],
            }

            case deletePizza: return {
                color: "red",
                component: "Submit",
                labels: ["Eliminar pizza", "Eliminando pizza ..."]
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



export const CreatePizza = ({ data = {} }) => (
    <Modal trigger={<CreateButton />} className="my-1">
        <h2 className="text-xl font-bold mb-4 text-green-400">Nueva Pizza</h2>

        <FormPizza data={data} action={createPizza} />
    </Modal>
)


export const UpdatePizza = ({ data = {} }) => (
    <Modal trigger={<UpdateButton />}>
        <h2 className="text-xl font-bold mb-4 text-indigo-400">Modificar Pizza</h2>

        <FormPizza data={data} action={updatePizza} />
    </Modal>
)



export const DeletePizza = ({ data = {} }) => (
    <Modal trigger={<DeleteButton />}>
        <h2 className="text-xl font-bold mb-4 text-red-400">Eliminar Pizza</h2>

        <FormPizza data={data} action={deletePizza} disabled />
    </Modal>
)


export const ViewPizza = ({ data = {} }) => (
    <Modal trigger={<ViewButton />}>
        <h2 className="text-xl font-bold mb-4 text-blue-400">Información de la Pizza</h2>

        <FormPizza data={data} action={async () => ({ type: "success" })} disabled />
    </Modal>
)


export const CardPublicPizza = ({ data }) => (
    <div className="p-4 flex flex-col gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-600 rounded-md shadow-md shadow-current/20" >

        <AddToCart pizza={data} className="self-end" />

        <Link prefetch href={`/pizzas/${data.id}`}>
            <div className="flex gap-2 items-center">

                <Image src={data.foto || defaultImage} alt={data.nombre || 'pizza'} width={80} height={80} className="object-cover rounded-md shadow-sm" />

                <div className="flex flex-col gap-2 p-2">
                    <div className="font-semibold ">{data.nombre}</div>

                    <div className="text-sm text-gray-500 dark:text-gray-300">{data.precio}</div>
                </div>
            </div>
        </Link>
    </div >
)



export const CardAdminPizza = ({ prefix, data, actions }) => (

    <div className="p-4 flex flex-col gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-600 rounded-md shadow-md shadow-current/20">

        <Prefetch href={prefix && `${prefix}/${data.id}`}>
            <div className="flex gap-2 items-center">

                <Image src={data.foto || defaultImage} alt={data.nombre || 'pizza'} width={80} height={80} className="object-cover rounded-md shadow-sm" />

                <div className="flex flex-col gap-2 p-2">
                    <div className="font-semibold ">{data.nombre}</div>

                    <div className="text-sm text-gray-500 dark:text-gray-300">{data.precio}</div>
                </div>
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



export const Card2AdminPizza = ({ prefix, data, actions }) => (

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

