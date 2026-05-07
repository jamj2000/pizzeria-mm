'use client'
import sortBy from '@/lib/utils/sort';
import { useState } from 'react';

export default function usePizzas(dataPizzas) {
    const [propiedad, setPropiedad] = useState('nombre');
    const [orden, setOrden] = useState('asc');
    const [buscar, setBuscar] = useState('');

    let pizzasFiltradas = sortBy(dataPizzas, propiedad, orden);

    if (buscar) {
        const busqueda = buscar.toLowerCase();
        pizzasFiltradas = pizzasFiltradas.filter(pizza =>
            pizza.nombre.toLowerCase().includes(busqueda) ||
            String(pizza.precio).includes(busqueda)
        );
    }

    return { pizzasFiltradas, propiedad, setPropiedad, orden, setOrden, buscar, setBuscar };
}
