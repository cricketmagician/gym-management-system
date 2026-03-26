const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- CREATING SUPER ADMIN ---');
    try {
        const firstGym = await prisma.gym.findFirst();
        if (!firstGym) {
            console.error('No gyms found. Please register a gym first.');
            return;
        }

        const email = 'superadmin@pulsefit.com';
        const password = 'pulsefit_super_2026';
        const passwordHash = await bcrypt.hash(password, 10);

        const superAdmin = await prisma.user.upsert({
            where: { gymId_email: { gymId: firstGym.id, email } },
            update: {
                role: 'SUPER_ADMIN',
                passwordHash,
                name: 'System SuperAdmin'
            },
            create: {
                gymId: firstGym.id,
                name: 'System SuperAdmin',
                email,
                passwordHash,
                role: 'SUPER_ADMIN'
            }
        });

        console.log('✅ SUPER_ADMIN ACCOUNT CREATED/UPDATED');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('---------------------------');
        console.log('Usage: Login at /login and you will be redirected to /superadmin');

    } catch (e) {
        console.error("ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
