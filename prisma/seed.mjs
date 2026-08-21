import { createId as cuid } from '@paralleldrive/cuid2';
import bcrypt from 'bcryptjs'
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client"
const connectionString = process.env.DATABASE_URL


import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });




const users = [
    {
        id: cuid(),
        name: "Eva García",
        email: "eva@eva.es",
        phone: '666123456',
        password: 'eva', // Will be hashed inside load
        address: "C/ Larga, 101",
        image: '/images/avatar-75.png',
        role: 'USER',
    },
    {
        id: cuid(),
        name: "Juan Pérez",
        email: "juan@juan.es",
        phone: '666234567',
        password: 'juan',
        address: "C/ Nueva, 11",
        image: '/images/avatar-76.png',
        role: 'USER',
    },
    {
        id: cuid(),
        name: "Pepe Viyuela",
        email: "pepe@pepe.es",
        phone: '666345678',
        password: 'pepe',
        address: "C/ Nueva, 99",
        image: '/images/avatar-77.png',
        role: 'USER',
    },
    {
        id: cuid(),
        name: "Usuario Normal",
        email: "user@user.es",
        phone: '677345678',
        password: 'user',
        address: "C/ Asia, 100",
        image: '/images/avatar-77.png',
        role: 'USER',
    },
    {
        id: cuid(),
        name: "Ana Alferez",
        email: "ana@ana.es",
        phone: '666456789',
        password: 'ana',
        address: "C/ Ancha, 100",
        image: '/images/avatar-78.png',
        role: 'ADMIN',
    },
    {
        id: cuid(),
        name: "Jose López",
        email: "jose@jose.es",
        phone: '666567890',
        password: 'jose',
        address: "Avda. Constitución, 1",
        image: '/images/avatar-79.png',
        role: 'ADMIN',
    },
    {
        id: cuid(),
        name: "Administrador",
        email: "admin@admin.es",
        phone: '666667890',
        password: 'admin',
        address: "Avda. Europa, s/n",
        image: '/images/avatar-79.png',
        role: 'ADMIN',
    },

];


const repartidores = [
    {
        nombre: 'Juan Romero',
        telefono: '666111222'
    },
    {
        nombre: 'Pepe Jiménez',
        telefono: '666111333'
    },
    {
        nombre: 'Luis Gómez',
        telefono: '666111444'
    }
]

const ingredientes = [
    { nombre: 'Masa' },
    { nombre: 'Tomate' },
    { nombre: 'Mozzarella' },
    { nombre: 'Queso Roquefort' },
    { nombre: 'Queso Parmesano' },
    { nombre: 'Pepperoni' },
    { nombre: 'Salami' },
    { nombre: 'Jamón' },
    { nombre: 'Bacón' },
    { nombre: 'Aceitunas' },
    { nombre: 'Champiñones' },
    { nombre: 'Pimientos' },
    { nombre: 'Atún' },
    { nombre: 'Piña' },
    { nombre: 'Albahaca fresca' },
]


// pizzas ---- n:m ---- ingredientes
const pizzas = [
    {
        nombre: 'Mediterránea',
        precio: 10.01,
        foto: 'https://res.cloudinary.com/jamj2000/image/upload/v1742904185/pizzeria/mediterranea.avif',
        ingredientes: {
            connect: [
                { nombre: 'Masa' },
                { nombre: 'Tomate' },
                { nombre: 'Mozzarella' },
                { nombre: 'Aceitunas' },
                { nombre: 'Pimientos' },
                { nombre: 'Albahaca fresca' },
            ]
        }
    },
    {
        nombre: 'Carbonara',
        precio: 11.02,
        foto: 'https://res.cloudinary.com/jamj2000/image/upload/v1744889375/pizzeria/carbonara.avif',
        ingredientes: {
            connect: [
                { nombre: 'Masa' },
                { nombre: 'Tomate' },
                { nombre: 'Mozzarella' },
                { nombre: 'Queso Parmesano' },
                { nombre: 'Pimientos' },
                { nombre: 'Albahaca fresca' },
            ]
        }
    },
    {
        nombre: 'Peperoni',
        precio: 12.03,
        foto: 'https://res.cloudinary.com/jamj2000/image/upload/v1744889405/pizzeria/peperoni.avif',
        ingredientes: {
            connect: [
                { nombre: 'Masa' },
                { nombre: 'Tomate' },
                { nombre: 'Mozzarella' },
                { nombre: 'Pepperoni' },
                { nombre: 'Pimientos' },
                { nombre: 'Albahaca fresca' },
            ]
        }
    },
    {
        nombre: 'Romana',
        precio: 13.04,
        foto: 'https://res.cloudinary.com/jamj2000/image/upload/v1744889419/pizzeria/romana.avif',
        ingredientes: {
            connect: [
                { nombre: 'Masa' },
                { nombre: 'Tomate' },
                { nombre: 'Mozzarella' },
                { nombre: 'Aceitunas' },
                { nombre: 'Pimientos' },
                { nombre: 'Albahaca fresca' },
            ],
        }
    },
    {
        nombre: 'Margarita',
        precio: 14.05,
        foto: 'https://res.cloudinary.com/jamj2000/image/upload/v1743707999/pizzeria/margarita.avif',
        ingredientes: {
            connect: [
                { nombre: 'Masa' },
                { nombre: 'Tomate' },
                { nombre: 'Mozzarella' },
                { nombre: 'Queso Roquefort' },
                { nombre: 'Queso Parmesano' },
                { nombre: 'Albahaca fresca' },
            ],
        }
    },
]

// Eliminar contenido de las tablas y reiniciar secuencias
const resetDatabase = async () => {
    console.log("Reiniciando base de datos (TRUNCATE)...");
    // PostgreSQL
    await prisma.$executeRaw`TRUNCATE TABLE "User", "repartidores", "pizzas", "pedidos", "ingredientes", "pedido_pizzas", "Account" RESTART IDENTITY CASCADE;`;

    // MySQL equivalente (MySQL no soporta TRUNCATE de varias tablas ni CASCADE):
    /*
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
    await prisma.$executeRaw`TRUNCATE TABLE User;`;
    await prisma.$executeRaw`TRUNCATE TABLE repartidores;`;
    await prisma.$executeRaw`TRUNCATE TABLE pizzas;`;
    await prisma.$executeRaw`TRUNCATE TABLE pedidos;`;
    await prisma.$executeRaw`TRUNCATE TABLE ingredientes;`;
    await prisma.$executeRaw`TRUNCATE TABLE pedido_pizzas;`;
    await prisma.$executeRaw`TRUNCATE TABLE Account;`;
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    */
};

const resetStripe = async () => {
    // Eliminar usuarios
    const customers = await stripe.customers.list();
    for (const customer of customers.data) {
        await stripe.customers.del(customer.id);
        console.log("Eliminado cliente ", customer.id)
    }
    console.log(`Usuarios de Stripe eliminados`);
}


const load = async () => {
    try {

        // 0. Reset
        await resetStripe();
        await resetDatabase();

        // 1. Crear usuarios en Stripe y hashear contraseñas
        for (const user of users) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: {
                    line1: user.address,
                },
            });
            user.stripeCustomerId = customer.id;
            user.password = await bcrypt.hash(user.password, 10);
        }
        console.log(`Usuarios de Stripe creados y contraseñas hasheadas`);

        // 2. Users (CUIDs generados arriba)
        await prisma.user.createMany({ data: users });
        console.log(`Usuarios insertados en la base de datos`);
        console.log(`Usuarios insertados`);

        // 3. Repartidores (Insertamos uno a uno para obtener los IDs reales)
        const repartidoresInsertados = [];
        for (const r of repartidores) {
            const result = await prisma.repartidor.create({ data: r });
            repartidoresInsertados.push(result);
        }
        console.log(`Repartidores insertados`);

        // 4. Ingredientes
        await prisma.ingrediente.createMany({ data: ingredientes });
        console.log(`Ingredientes insertados`);

        // 5. Pizzas (Connect por nombre + Captura IDs)
        const pizzasInsertadas = [];
        for (const p of pizzas) {
            const result = await prisma.pizza.create({ data: p });
            pizzasInsertadas.push(result);
        }
        console.log(`Pizzas insertadas`);

        // 6. Pedidos (Reconstruidos con los IDs reales obtenidos arriba)
        const pedidosParaInsertar = [
            {
                fecha_hora: '2024-06-01T20:00:05.000Z',
                pedidoPizzas: {
                    create: [{ pizzaId: pizzasInsertadas[0].id, cantidad: 1 }]
                },
                clienteId: users[0].id,
                repartidorId: repartidoresInsertados[0].id,
            },
            {
                fecha_hora: '2024-07-01T21:12:05.000Z',
                pedidoPizzas: {
                    create: [
                        { pizzaId: pizzasInsertadas[0].id, cantidad: 1 },
                        { pizzaId: pizzasInsertadas[1].id, cantidad: 2 }
                    ]
                },
                clienteId: users[1].id,
                repartidorId: repartidoresInsertados[1].id,
            },
            {
                fecha_hora: '2024-08-01T22:12:05.000Z',
                pedidoPizzas: {
                    create: [
                        { pizzaId: pizzasInsertadas[1].id, cantidad: 1 },
                        { pizzaId: pizzasInsertadas[3].id, cantidad: 1 }
                    ]
                },
                clienteId: users[2].id,
                repartidorId: repartidoresInsertados[2].id,
            },
            {
                fecha_hora: '2024-09-01T23:12:05.000Z',
                pedidoPizzas: {
                    create: [
                        { pizzaId: pizzasInsertadas[1].id, cantidad: 1 },
                        { pizzaId: pizzasInsertadas[2].id, cantidad: 1 },
                        { pizzaId: pizzasInsertadas[3].id, cantidad: 1 }
                    ]
                },
                clienteId: users[2].id,
                repartidorId: repartidoresInsertados[2].id,
            },
        ];

        for (const pedido of pedidosParaInsertar) {
            await prisma.pedido.create({ data: pedido });
        }

        console.log(`Pedidos insertados correctamente`);

    } catch (error) {
        console.error("Error al insertar datos:", error);
    } finally {
        await prisma.$disconnect();
    }
};

load();