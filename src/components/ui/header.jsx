import { BikeIcon, HomeIcon, KeyRoundIcon, LockIcon, MenuIcon, PizzaIcon, ScrollTextIcon, ShoppingCartIcon, UserRoundIcon, XIcon } from 'lucide-react'
import { logout } from '@/lib/actions/auth';
import { auth } from '@/lib/auth';
import MenuLink from '@/components/ui/menu-link';
import Link from 'next/link'
import CartWidget from '@/components/carrito/widget';



export default async function Header() {

  const session = await auth()


  return (
    <nav className='z-10 w-full px-4 py-2 flex justify-between items-center bg-white/75 backdrop-blur-xs fixed top-0'> {/* bottom-0 md:bottom-auto md:top-0*/}

      <div className="flex items-center gap-1">
        {/* Control Menú */}
        <input type="checkbox" id="openMenu" className='hidden peer' defaultChecked={true} />

        < label htmlFor="openMenu" className='bg-white hidden peer-checked:block p-2 rounded-full hover:outline hover:outline-slate-600' >
          <XIcon />
        </label >

        <label htmlFor="openMenu" className='bg-white hidden peer-not-checked:block p-2 rounded-full hover:outline hover:outline-slate-600'>
          <MenuIcon />
        </label>


        {/* Menú */}
        <MenuLink label="Inicio" href="/" icon={<HomeIcon />} />
        <MenuLink label="Pizzas" href="/pizzas" icon={<PizzaIcon className='-scale-x-100' />} />
        <MenuLink label="Pedidos" href="/pedidos" icon={<ScrollTextIcon />} />
        {session?.user.role === 'ADMIN' &&
          <MenuLink label="Repartidores" href="/repartidores" icon={<BikeIcon />} />
        }
      </div >

      <div className='flex gap-2 items-center' >
        {/* Sesión */}
        {session &&
          <Link prefetch
            href="/dashboard"
            className="w-full rounded-full hover:outline hover:outline-slate-600 cursor-pointer" >
            {session.user.image ? <img src={session.user.image} className='size-10 rounded-full' /> : <UserRoundIcon className='size-10 p-2' />}
          </Link >
        }


        <CartWidget />


        {/* Sesión */}
        {session
          ?
          <form className="flex gap-2 items-center">
            <button formAction={logout} className='bg-white flex items-center w-full p-2 rounded-full hover:outline hover:outline-slate-600 cursor-pointer'>
              <LockIcon /> {/*  Logout */}
            </button>
          </form>
          :
          <Link href="/login" className="bg-white flex items-center w-full p-2 rounded-full hover:outline hover:outline-slate-600 cursor-pointer">
            <KeyRoundIcon />      {/* Login */}
          </Link>
        }
      </div >
    </nav >
  )
}
