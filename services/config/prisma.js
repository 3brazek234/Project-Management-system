import 'dotenv/config'; // لو بتستخدم dotenv محلياً
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';

import ws from 'ws';
neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`; // لازم DATABASE_URL يكون في Vercel Env Vars

const adapter = new PrismaNeon({ connectionString });
const prismaClient = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prismaClient;

export default prismaClient; // ده بيعمل export لـ Prisma Client
