import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        // Find a base gym for the superadmin
        const firstGym = await prisma.gym.findFirst();
        
        if (!firstGym) {
            console.error('No gyms found. Please run seedAdmin.ts first.');
            return;
        }

        const email = 'superadmin@pulsefit.com';
        const password = 'pulsefit_super_2026';
        const passwordHash = await bcrypt.hash(password, 10);

        const superAdmin = await prisma.user.upsert({
            where: { gymId_email: { gymId: firstGym.id, email } },
            update: {
                role: 'SUPER_ADMIN',
                passwordHash
            },
            create: {
                gymId: firstGym.id,
                name: 'System SuperAdmin',
                email,
                passwordHash,
                role: 'SUPER_ADMIN'
            }
        });

        console.log('-----------------------------------');
        console.log('✅ SUPER_ADMIN ACCOUNT CREATED');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        console.log('Usage: Login at /login and you will be redirected to /superadmin');

    } catch (error) {
        console.error('Error creating SuperAdmin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
