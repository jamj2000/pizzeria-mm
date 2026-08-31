import { BikeIcon, HomeIcon, KeyRoundIcon, LockIcon, MenuIcon, PizzaIcon, ScrollTextIcon, ShoppingCartIcon, UserRoundIcon, XIcon } from 'lucide-react'
import { logout } from '@/lib/actions/auth';
import { auth } from '@/lib/auth';
// import MenuLink from '@/components/ui/menu-link';
import Link from 'next/link'
import CartWidget from '@/components/carrito/widget';
import { MainMenu, MenuLink } from '../simpleui';
import { connection } from 'next/server';
import Image from 'next/image';



export default async function Header() {
  await connection()    // Necesario porque NextAuth v5 hace uso de crypto.getRandomValues() durante el prerendering
  const session = await auth()


  return (
    <nav className='z-10 w-full px-4 py-2 flex justify-between items-center bg-white/75 backdrop-blur-xs fixed top-0'> {/* bottom-0 md:bottom-auto md:top-0*/}

      {/* <div className="flex items-center gap-1">
        <input type="checkbox" id="openMenu" className='hidden peer' defaultChecked={true} />

        < label htmlFor="openMenu" className='bg-white hidden peer-checked:block p-2 rounded-full hover:outline hover:outline-slate-600' >
          <XIcon />
        </label >

        <label htmlFor="openMenu" className='bg-white hidden peer-not-checked:block p-2 rounded-full hover:outline hover:outline-slate-600'>
          <MenuIcon />
        </label>


   
        <MenuLink label="Inicio" href="/" icon={<HomeIcon />} />
        <MenuLink label="Pizzas" href="/pizzas" icon={<PizzaIcon className='-scale-x-100' />} />
        <MenuLink label="Pedidos" href="/pedidos" icon={<ScrollTextIcon />} />
        {session?.user.role === 'ADMIN' &&
          <MenuLink label="Repartidores" href="/repartidores" icon={<BikeIcon />} />
        }
      </div > */}


      {/* <MenuLink label="Inicio" href="/">
        <HomeIcon /> Inicio
      </MenuLink> */}

      <MainMenu position='left'>
        <MenuLink label="Pizzas" href="/pizzas">
          <PizzaIcon className='-scale-x-100' /> Pizzas
        </MenuLink>

        <MenuLink label="Pedidos" href="/pedidos">
          <ScrollTextIcon /> Pedidos
        </MenuLink>

        {session?.user.role === 'ADMIN' &&
          <MenuLink label="Repartidores" href="/repartidores">
            <BikeIcon /> Repartidores
          </MenuLink>
        }

      </MainMenu>

      <div className='flex gap-2 items-center' >
        {/* Sesión */}
        {session &&
          <Link
            href="/dashboard"
            className="w-full rounded-full hover:outline hover:outline-slate-600 cursor-pointer" >
            {session.user.image
              ?
              <Image
                width={60}
                height={60}
                alt="imagen de usuario"
                src={session.user.image}
                className='size-10 rounded-full'
              />
              : <UserRoundIcon className='size-10 p-2' />}
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
