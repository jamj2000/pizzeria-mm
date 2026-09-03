import { Suspense } from "react";

import { auth } from "@/lib/auth";
import { getRepartidor } from "@/lib/data/repartidores";
import { redirect } from "next/navigation";

import { notFound } from "next/navigation";
import { BackLink } from "@/components/simpleui/client";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";



export default function Page({ params }) {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>

            <h1 className="mb-10 py-2 text-3xl font-bold flex gap-2 items-center border-b-4 border-b-blue-400">

                <BackLink>
                    <ArrowLeftIcon
                        size={40}
                        className='p-1 rounded-full  text-blue-500 border bg-blue-200  border-blue-500  hover:text-white hover:bg-blue-500'
                    />
                </BackLink>
                Información del repartidor
            </h1>


            <Suspense fallback={"..."}>
                <Content params={params} />
            </Suspense>
        </div>
    )
}



async function Content({ params }) {
    const [{ id }, session] = await Promise.all([params, auth()])

    if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

    const repartidor = await getRepartidor(id)
    if (!repartidor) notFound()

    return (
        <div>
            <Image
                src={repartidor.foto || "/images/avatar-80.png"}
                alt="foto"
                width={200}
                height={200}
            />
            <div className="text-2xl">  {repartidor.nombre}</div>
            {/* <div>Teléfono: {repartidor.telefono}</div> */}
        </div>
    );
}


