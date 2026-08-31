import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getUsuarios } from "@/lib/data/users";
import ListaUsuarios from "@/components/users/lista";
import { Spinner1 } from "@/components/ui/spinners";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const metadata = { title: "Pizzería MM - Usuarios" }

export default function Page() {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">Gestión de Usuarios</h1>

            <Suspense fallback={<Spinner1 />}>
                <Content />
            </Suspense>
        </div>
    )
}

async function Content() {
    await connection()
    const session = await auth()
    if (!session) redirect('/login')

    if (session?.user?.role !== 'ADMIN') {
        redirect('/dashboard')
    }

    const users = await getUsuarios()

    return (
        <ListaUsuarios session={session} users={users} />
    )
}
