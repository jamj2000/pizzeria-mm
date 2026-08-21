// import { PrismaClient } from "@prisma/client";

// const prisma = global.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// export default prisma


import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis;

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;