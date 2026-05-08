'use client'

import { useActionState, useEffect } from 'react';
import { login } from '@/lib/actions/auth'
import { toast } from 'sonner';
import { Spinner1 } from '@/components/ui/spinners';


export default function LoginForm({ callbackUrl, className, error }) {
    const [state, action, pending] = useActionState(login, {})
    useEffect(() => {
        if (state?.success) toast.success(state.success)
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <form action={action} className={className}>
            <input type='hidden' name='callbackUrl' defaultValue={callbackUrl} />
            <h1 className="text-2xl font-bold mb-4 text-blue-500">Credenciales</h1>

            <div>
                <label>Email</label>
                <input type='email' name='email' placeholder="name@mail.com" className='w-full p-3' />
            </div>
            <div>
                <label>Contraseña</label>
                <input type="password" name='password' placeholder="******" className='w-full p-3' />
            </div>
            <button disabled={pending} className="mt-4 py-4 w-full bg-blue-500 text-white cursor-pointer hover:font-bold">
                {pending ? <Spinner1 /> : "Iniciar sesión"}
            </button>
            {error && <p className='text-red-400'>{error}</p>}
        </form>
    );
}

