'use client'
import { use } from "react";
import Link from "next/link";
import Modal from "@/components/ui/modal";
import Form from "@/components/repartidores/form";
import { IconoInsertar, IconoModificar, IconoEliminar } from "@/components/ui/icons";
import { labelEliminar, labelInsertar, labelModificar } from "@/components/ui/labels";
import { HeadsetIcon } from "lucide-react";
import { eliminar, insertar, modificar } from "@/lib/actions/repartidores";
import useRepartidores from "@/components/repartidores/hooks/useRepartidores";
import Filtro from "./filtro";



export default function Repartidores({ repartidores }) {


    const {
        repartidoresFiltrados,
        propiedad, setPropiedad,
        orden, setOrden,
        buscar, setBuscar
    } = useRepartidores(repartidores);


    const Insertar = () =>
        <Modal trigger={<IconoInsertar />}>
            <Form
                action={insertar}
                labelSubmit={labelInsertar}
            />
        </Modal>


    const Modificar = ({ repartidor }) =>
        <Modal trigger={<IconoModificar />}>
            <Form
                action={modificar}
                repartidor={repartidor}
                labelSubmit={labelModificar}
            />
        </Modal>


    const Eliminar = ({ repartidor }) =>
        <Modal trigger={<IconoEliminar />}>
            <Form
                action={eliminar}
                repartidor={repartidor}
                labelSubmit={labelEliminar}
                disabled
            />
        </Modal>


    const Item = ({ repartidor, children }) =>
        <div key={repartidor.id} className="p-4 mb-4 bg-blue-50 rounded-lg border border-blue-100   ">
            <div className='flex justify-end items-center gap-1'>
                {children}
            </div>

            <Link href={`/repartidores/${repartidor.id}`} className="font-bold cursor-pointer">
                {repartidor.nombre}
            </Link>
            <a href={`tel:${repartidor.telefono}`} className="flex gap-2 p-2 bg-blue-100">
                <HeadsetIcon /> {repartidor.telefono}
            </a>
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

            <div className='flex justify-end items-center gap-4 pb-4'>
                <Insertar />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {repartidoresFiltrados.map(repartidor =>
                    <Item key={repartidor.id} repartidor={repartidor} >
                        <Modificar repartidor={repartidor} />
                        <Eliminar repartidor={repartidor} />
                    </Item>
                )}
            </div>
        </div>
    );
}
