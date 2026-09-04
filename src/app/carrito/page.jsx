import { auth } from "@/lib/auth";
import { CartCheckout } from "@/components/carrito";
import { Spinner1 } from "@/components/ui/spinners";
import { Suspense } from "react";
import { connection } from "next/server";


export const metadata = { title: "Pizzería MM - Carrito" }


export default function Page() {
    return (
        <Suspense fallback={<Spinner1 />}>
            <Content />
        </Suspense>
    )
}



async function Content() {
    await connection()
    const session = await auth()
    return <CartCheckout session={session} />
}