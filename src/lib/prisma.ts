import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

// 1. Create a pool using your DATABASE_URL environment variable
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it with the Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
