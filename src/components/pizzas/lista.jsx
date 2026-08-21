'use client'
import Modal from "@/components/ui/modal";
import Form from "@/components/pizzas/form";
import { use } from "react";
import { IconoInsertar, IconoModificar, IconoEliminar } from "@/components/ui/icons";
import { labelInsertar, labelModificar, labelEliminar } from "@/components/ui/labels";
import { eliminar, insertar, modificar } from "@/lib/actions/pizzas";
import { PizzaInfo, PizzaCard } from "./info";
import Filtro from "./filtro";
import usePizzas from "@/components/pizzas/hooks/usePizzas";


export default function List({
    promesaPizzas,
    promesaIngredientes,
    promesaSession
}) {

    const pizzas = use(promesaPizzas)
    const ingredientes = use(promesaIngredientes)
    const session = use(promesaSession)

    const isAdminSession = session?.user.role === 'ADMIN'

    const {
        pizzasFiltradas,
        propiedad, setPropiedad,
        orden, setOrden,
        buscar, setBuscar
    } = usePizzas(pizzas);



    const Insertar = () =>
        <Modal trigger={<IconoInsertar className="self-end" />}>
            <Form
                action={insertar}
                ingredientes={ingredientes}
                labelSubmit={labelInsertar}
            />
        </Modal>

    const Modificar = ({ pizza }) =>
        <Modal trigger={<IconoModificar className="self-end" />}>
            <Form
                action={modificar}
                pizza={pizza}
                ingredientes={ingredientes}
                labelSubmit={labelModificar}
            />
        </Modal>

    const Eliminar = ({ pizza }) =>
        <Modal trigger={<IconoEliminar />}>
            <Form
                action={eliminar}
                pizza={pizza}
                ingredientes={ingredientes}
                labelSubmit={labelEliminar}
                disabled
            />
        </Modal>

    const Item = ({ pizza, children }) =>
        <div className="flex flex-col max-w-96 p-4 mb-4 bg-blue-100 rounded-lg border border-blue-200">
            <div className='flex justify-end items-center gap-1 pt-4'>
                {children}
            </div>
            <Modal trigger={<PizzaCard pizza={pizza} />}>
                <PizzaInfo pizza={pizza} />
            </Modal>
        </div>


    return (
        <div className="flex flex-col gap-4">

            {/* Filtrado y ordenación */}
            <Filtro
                buscar={buscar}
                setBuscar={setBuscar}
                propiedad={propiedad}
                setPropiedad={setPropiedad}
                orden={orden}
                setOrden={setOrden}
            />

            <div className='flex justify-end items-center gap-1 pt-4'>
                {isAdminSession && <Insertar />}
            </div>

            <div className="w-full mx-auto grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
                {pizzasFiltradas.map(pizza =>
                    <Item key={pizza.id} pizza={pizza}>
                        <div className='flex justify-end items-center gap-1 pt-4'>
                            {isAdminSession && <Modificar pizza={pizza} />}
                            {isAdminSession && <Eliminar pizza={pizza} />}
                        </div>
                    </Item>
                )}
            </div>
        </div>

    )
}


