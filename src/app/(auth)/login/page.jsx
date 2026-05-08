import RegisterCredentials from '@/components/auth-forms/register-credentials'
import LoginForm from '@/components/auth-forms/login-credentials'
import LoginMagicLink from '@/components/auth-forms/login-magic-link'
import LoginOauth from '@/components/auth-forms/login-oauth'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation';
import { CirclePlus, Play, Globe, Key, Mail } from 'lucide-react'

// https://next-auth.js.org/configuration/pages#sign-in-page
const errors = new Map();
errors.set('OAuthSignin', "Error al construir una URL de autorización.");
errors.set('OAuthCallback', "Error al manejar la respuesta de un proveedor de OAuth.");
errors.set('OAuthCreateAccount', "No se pudo crear un usuario proveedor de OAuth en la base de datos.");
errors.set('EmailCreateAccount', "No se pudo crear un usuario de proveedor de correo electrónico en la base de datos.");
errors.set('Callback', "Error en la ruta del controlador de devolución de llamada de OAuth.");
errors.set('OAuthAccountNotLinked', "Este email ya está registrado con otro proveedor.");
errors.set('EmailSignin', "Comprueba tu dirección de correo electrónico.");
errors.set('CredentialsSignin', "Fallo al iniciar sesion. Verifique que los datos que proporcionó sean correctos.");
errors.set('SessionRequired', "Error al iniciar sesión. Verifique que los detalles que proporcionó sean correctos.");
errors.set('Default', "No se puede iniciar sesión.");


async function PaginaLogin({ searchParams }) {
  const { error, callbackUrl } = await searchParams
  globalThis.callbackUrl = callbackUrl

  const sesion = await auth()

  if (sesion) redirect('/dashboard')

  return (
    <div className="relative mt-8 mx-auto flex flex-col gap-2 w-[375px]">
      {/* En Tailwind, la clase peer funciona sólo entre hermanos (siblings) */}
      {/* https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-peers */}

      <input
        id="signup"
        type="radio" name="sign"
        className="hidden peer/register"
      />
      <label
        htmlFor="signup"
        title="Registro"
        className='absolute right-0 text-slate-300 peer-checked/register:text-black'>
        <CirclePlus />
      </label>

      <input
        id="signin"
        title="Iniciar sesión"
        type="radio" name="sign"
        className="hidden peer/login"
        defaultChecked={true} />
      <label
        htmlFor="signin"
        title="Iniciar sesión"
        className='absolute right-10 text-slate-300 peer-checked/login:text-black'>
        <Play />
      </label>

      <input
        id="signmagic"
        title="Iniciar sesión con Magic Link"
        type="radio" name="sign"
        className="hidden peer/magic"
      />
      <label
        htmlFor="signmagic"
        title="Iniciar sesión con Magic Link"
        className='absolute right-20 text-slate-300 peer-checked/magic:text-black'>
        <Mail />
      </label>


      <input
        id="signoauth"
        title="Iniciar sesión OAuth"
        type="radio" name="sign"
        className="hidden peer/oauth"
      />
      <label
        htmlFor="signoauth"
        title="Iniciar sesión con OAuth"
        className='absolute right-30 text-slate-300 peer-checked/oauth:text-black'>
        <Globe />
      </label>


      <RegisterCredentials className="hidden peer-checked/register:block w-full bg-[snow] mt-10 border-2 border-slate-400 rounded-md mx-auto p-8 " />
      <LoginForm className="hidden peer-checked/login:block w-full bg-[snow] mt-10 border-2 border-slate-400 rounded-md mx-auto p-8 " />
      <LoginMagicLink className="hidden peer-checked/magic:block w-full bg-[snow] mt-10 border-2 border-slate-400 rounded-md mx-auto p-8 " />
      <LoginOauth className="hidden peer-checked/oauth:block w-full bg-[snow] mt-10 border-2 border-slate-400 rounded-md mx-auto p-8 " />
      {error && <p className='text-red-400'>{errors.get(error)}</p>}
    </div>
  )
}

export default PaginaLogin