import { Suspense } from "react";
import { getPizza } from "@/lib/data/pizzas";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/simpleui/client";
import { ArrowLeftIcon } from "lucide-react";
import { AddToCart } from "@/components/pizzas";
import { defaultImage } from "@/lib/constants";
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
                Información de la pizza
            </h1>

            <Suspense fallback={"..."}>
                <Content params={params} />
            </Suspense>
        </div>
    )
}





async function Content({ params }) {

    const { id } = await params
    const pizza = await getPizza(id)

    if (!pizza) notFound()

    return (
        <div className="grid lg:grid-cols-[300px_1fr] gap-4 place-items-start">

            <div className='relative w-full'>
                <AddToCart pizza={pizza} className="absolute top-4 right-4" />

                <Image
                    width={600}
                    height={600}
                    alt='foto'
                    src={pizza.foto || defaultImage}
                    className="h-[200px] w-full lg:h-[600px] object-cover"
                />
            </div>

            <div className="flex flex-col justify-center w-full">
                <p className="text-4xl">{pizza.nombre}</p>
                <p className="text-4xl font-bold text-orange-300">{pizza.precio} €</p>
                <p className="py-4 font-bold text-xl">Ingredientes</p>
                {pizza.ingredientes?.map(ingrediente =>
                    <div className="text-lg" key={ingrediente.id}>
                        <p>{ingrediente.nombre}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

