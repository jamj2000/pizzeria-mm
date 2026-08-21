import { Suspense } from "react";
import BackButton from "@/components/ui/back-button";

import { auth } from "@/lib/auth";
import { getRepartidor } from "@/lib/data/repartidores";
import { redirect } from "next/navigation";

import { notFound } from "next/navigation";



export default function PaginaRepartidor({ params }) {
    return (
        <div>
            <BackButton />
            <div className="h-20">{/* Hueco de separación */}</div>

            <Suspense fallback={"..."}>
                <Repartidor paramsPromise={params} />
            </Suspense>
        </div>
    )
}



async function Repartidor({ paramsPromise }) {
    const { id } = await paramsPromise
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

    const repartidor = await getRepartidor(id)
    if (!repartidor) notFound()

    return (
        <>
            <div className="text-2xl">Nombre: {repartidor.nombre}</div>
            <div>Teléfono: {repartidor.telefono}</div>
        </>
    );
}


