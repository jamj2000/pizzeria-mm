import { auth } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import { LockIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUsuarioPorId } from "@/lib/data/users";
import { IconoModificar } from "@/components/ui/icons";
import { editUser } from "@/lib/actions/users";
import { labelModificar } from "@/components/ui/labels";
import Form from "@/components/users/form";
import Modal from "@/components/ui/modal";
import Link from 'next/link';
import { connection } from "next/server";
import Image from "next/image";

export const metadata = { title: "Pizzería MM - Dashboard" }

export default function Page() {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <form action={logout}>
                    <button className="flex gap-2 justify-center items-center px-4 py-2 rounded-full hover:outline hover:outline-slate-300 cursor-pointer">
                        <LockIcon /> <span className="hidden md:block">Cerrar sesión</span>
                    </button>
                </form>
            </div>

            <Suspense fallback={"..."}>
                <Content />
            </Suspense>

            <Link prefetch href="/dashboard/pedidos">
                <h1 className="text-xl font-bold my-5">Gestionar pedidos</h1>
            </Link>

            <Link prefetch href="/dashboard/usuarios">
                <h1 className="text-xl font-bold my-5">Gestionar usuarios</h1>
            </Link>

            <Link prefetch href="/dashboard/pizzas">
                <h1 className="text-xl font-bold my-5">Gestionar pizzas</h1>
            </Link>
        </div>
    )
}

async function Content() {
    await connection()    // Necesario porque NextAuth v5 hace uso de crypto.getRandomValues() durante el prerendering
    const session = await auth()
    if (!session) redirect('/login')

    return (
        <UserInfo session={session} />
    )
}

async function UserInfo({ session }) {
    const usuario = await getUsuarioPorId(session.user.id)
    const isAdminSession = session.user.role === 'ADMIN'

    return (
        <div className="grid md:grid-cols-[160px_auto] gap-2">
            <Image
                width={200}
                height={200}
                src={usuario?.image || '/images/avatar-80.png'}
                alt="Imagen de usuario"
                className="size-36"
                priority
            />

            <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                    <p className="font-bold">{usuario.name}</p>
                    <Modal trigger={<IconoModificar />}>
                        <Form action={editUser} isAdminSession={isAdminSession} user={usuario} labelSubmit={labelModificar} />
                    </Modal>
                </div>
                <p>{usuario.email}</p>
                <p>{usuario.address}</p>
                <p>{usuario.phone}</p>
                <p>{usuario.role}</p>
            </div>
        </div>
    )
}