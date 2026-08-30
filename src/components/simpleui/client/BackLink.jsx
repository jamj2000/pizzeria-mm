'use client'
import { useRouter } from "next/navigation"


export function BackLink({ children, className = "" }) {
    const { back } = useRouter()

    return (

        <div
            onClick={back}
            className={`inline-grid place-content-center cursor-pointer ${className}`}
        >
            {children}
        </div>

    )
}
