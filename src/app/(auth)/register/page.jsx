import RegisterForm from '@/components/auth-forms/register-credentials'
import Link from 'next/link'


function page() {
  return (
    <div className="mx-auto mt-10 w-80 p-8 border border-slate-300 rounded-md bg-slate-50">
      <h1 className='text-3xl font-bold py-4'>Crear cuenta</h1>
      <RegisterForm />
      <Link href='/login' className='text-blue-500 cursor-pointer'>
        Iniciar sesión.
      </Link>
    </div>
  )
}

export default page