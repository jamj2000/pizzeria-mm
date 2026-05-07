
export const labelDefault = <span className="flex gap-2 justify-center items-center w-full font-bold bg-blue-700 text-white p-2 rounded-md">
    Enviar
</span>

export const labelInsertar = <span className="flex gap-2 justify-center items-center w-full font-bold bg-green-700 text-white p-2 rounded-md">
    Guardar
</span>

export const labelModificar = <span className="flex gap-2 justify-center items-center w-full font-bold bg-amber-700 text-white p-2 rounded-md">
    Actualizar
</span>

export const labelEliminar = <span className="flex gap-2 justify-center items-center w-full font-bold bg-red-700 text-white p-2 rounded-md">
    Eliminar
</span>

const colorMap = {
    green: 'bg-green-700',
    red: 'bg-red-700',
    blue: 'bg-blue-700',
    amber: 'bg-amber-700',
    orange: 'bg-orange-700',
    purple: 'bg-purple-700',
    yellow: 'bg-yellow-700',
    pink: 'bg-pink-700',
    indigo: 'bg-indigo-700',
    teal: 'bg-teal-700',
}

export const Label = ({ color, children }) =>
    <span className={`flex gap-2 justify-center items-center w-full font-bold ${colorMap[color] || 'bg-gray-700'} text-white p-2 rounded-md`}>
        {children}
    </span>
