'use client'
import sortBy from '@/lib/utils/sort';
import { useState } from 'react';


export default function useRepartidores(dataRepartidores) {
    const [propiedad, setPropiedad] = useState('nombre');
    const [orden, setOrden] = useState('asc');
    const [buscar, setBuscar] = useState('');

    let repartidoresFiltrados = sortBy(dataRepartidores, propiedad, orden);

    if (buscar) {
        const busqueda = buscar.toLowerCase();
        repartidoresFiltrados = repartidoresFiltrados.filter(repartidor =>
            repartidor.nombre.toLowerCase().includes(busqueda) ||
            String(repartidor.telefono).toLowerCase().includes(busqueda)
        );
    }

    return { repartidoresFiltrados, propiedad, setPropiedad, orden, setOrden, buscar, setBuscar };
}
