'use client'

import Modal from '@/components/ui/modal';
import { deleteUser, editUser, newUser } from "@/lib/actions/users";
import { use } from "react";
import { IconoInsertar, IconoModificar, IconoEliminar } from "@/components/ui/icons";
import Form from './form';
import { Label, labelEliminar, labelInsertar, labelModificar } from '../ui/labels';
import Estado from './estado';





export default ({ session, promesaUsuarios }) => {
    const users = use(promesaUsuarios)
    const isAdminSession = session?.user?.role === 'ADMIN'

    const Insertar = () =>
        <Modal trigger={<IconoInsertar />}>
            <Form
                action={newUser}
                isAdminSession={isAdminSession}
                labelSubmit={labelInsertar}
            />
        </Modal>

    const Modificar = ({ user }) =>
        <Modal trigger={<IconoModificar />}>
            <Form
                user={user}
                action={editUser}
                labelSubmit={labelModificar}
                isAdminSession={isAdminSession}
            />
        </Modal>


    const Eliminar = ({ user }) =>
        <Modal trigger={<IconoEliminar />}>
            <Form
                user={user}
                action={deleteUser.bind(null, user)}
                labelSubmit={labelEliminar}
                isAdminSession={isAdminSession}
                disabled
            />
        </Modal>


    const Mostrar = ({ user }) =>
        <Modal trigger={
            <div className="cursor-pointer flex gap-2 items-center">
                <img src={user?.image || '/images/avatar-80.png'} alt="Imagen de usuario"
                    className={`size-8 ${!user.active && 'grayscale opacity-30'}`}
                />
                {user.name}
            </div>
        }>
            <Form
                user={user}
                action={() => { return { ok: true } }}
                labelSubmit={<Label color="green">Aceptar</Label>}
                isAdminSession={isAdminSession}
                disabled
            />
        </Modal>


    const Item = ({ user, children }) => {
        return (
            <div key={user.id} className="rounded-full p-2 flex justify-between items-center even:bg-blue-100 odd:bg-slate-100 hover:outline hover:outline-slate-400">

                <div className="relative group flex gap-2 items-center">
                    <Mostrar user={user} />
                    <Popover user={user} />
                </div>

                <div className='flex justify-center items-center gap-1'>
                    {children}
                </div>

            </div>
        )
    }



    const Popover = ({ user }) =>
        <div className="absolute left-10 top-4 z-50 mt-2 hidden group-hover:block bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-2xl p-4 min-w-[320px]">

            <div className="grid grid-cols-[60px_auto] items-center  gap-4 border border-slate-300 rounded-md p-2">
                <img src={user.image} alt="avatar"
                    className={`size-16 ${!user.active && 'grayscale opacity-30'}`} />
                <div>
                    <p>{user.name}</p>
                    <p>{user.address}</p>
                    <p>{user.phone}</p>
                    <p>{user.role}</p>
                </div>
            </div>
        </div>



    return (
        <div>
            {isAdminSession &&
                <div className='flex justify-end items-center gap-4 pb-4'>
                    <Insertar />
                </div>
            }

            {users
                .filter(user => user.id !== session?.user?.id)
                .sort((a, b) => a.name?.localeCompare(b.name))
                .map(user =>
                    <Item key={user.id} user={user}>
                        <Estado user={user} editable={isAdminSession} />
                        <Modificar user={user} />
                        <Eliminar user={user} />
                    </Item>
                )
            }
        </div >

    )
}






