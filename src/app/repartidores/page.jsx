import { Suspense } from "react";
import { getRepartidores } from "@/lib/data/repartidores";
import { List } from "@/components/simpleui";
import { CardPublicRepartidor } from "@/components/repartidores";



export const metadata = { title: "Pizzería MM - Repartidores" }


export default function Page() {

    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <h1 className="text-3xl font-bold mb-4">NUESTROS REPARTIDORES</h1>


            <Suspense fallback={"..."}>
                <Content />
            </Suspense>
        </div>

    )

}




async function Content() {
    const repartidores = await getRepartidores()

    return (
        <List
            prefix="/repartidores"
            card={CardPublicRepartidor}
            data={repartidores}
            columns={[
                { name: "nombre", label: "Nombre" },
                // { name: "telefono", label: "Teléfono" },
            ]}
            sort="nombre"
        />

    )
}

