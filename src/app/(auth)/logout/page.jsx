import { logout } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Lock } from "lucide-react"

import { Suspense } from "react"
import { connection } from "next/server"



export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Content />
    </Suspense>
  )
}






async function Content() {
  await connection()    // Necesario porque NextAuth v5 hace uso de crypto.getRandomValues() durante el prerendering
  const sesion = await auth()

  if (!sesion) {
    redirect('/login')
  }

  return (
    <>
      <h1>Cerrar sesión</h1>
      <form>
        <button formAction={logout} className="logout">
          <Lock /> Cerrar sesión
        </button>
      </form>
    </>
  )
}