import { logout } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Lock } from "lucide-react"
import { Suspense } from "react"

import { connection } from "next/server"

export default function page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ContenidoLogout />
    </Suspense>
  )
}

async function ContenidoLogout() {
  await connection()
  const sesion = await auth()

  if (sesion) {
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
  else {
    redirect('/login')
  }
}