import { Suspense } from "react";
import Repartidores from "@/components/repartidores/lista";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect, } from "next/navigation";
import { getRepartidores } from "@/lib/data/repartidores";


export const metadata = { title: "Pizzería MM - Repartidores" }

export default function PaginaRepartidores() {
    return (
        <div>
            <Link href="/" className="text-5xl">🏡</Link>
            <h1 className="text-3xl font-bold mb-4">LISTA DE REPARTIDORES</h1>

            <Suspense fallback={"..."}>
                <ContenidoRepartidores />
            </Suspense>
        </div>
    )
}

async function ContenidoRepartidores() {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

    return <Repartidores repartidores={await getRepartidores()} />
}



