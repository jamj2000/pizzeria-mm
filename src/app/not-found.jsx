import { BackLink } from "@/components/simpleui";
import { ArrowLeftIcon } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="container mx-auto">
            <BackLink>
                <ArrowLeftIcon
                    size={40}
                    className='p-1 rounded-full  text-blue-500 border bg-blue-200  border-blue-500  hover:text-white hover:bg-blue-500'
                />
            </BackLink>
            <div className="h-40"></div>
            <div className="grid text-5xl text-stone-500">
                El contenido al que intentas acceder no está disponible.
            </div>
        </div>
    ); º
}

