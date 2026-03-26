import dotenv from 'dotenv';
dotenv.config();

import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

// No need to instantiate PrismaClient here, we use the singleton from lib

async function main() {
    try {
        // Find a base gym for the superadmin (doesn't matter which one, but required by schema)
        const firstGym = await prisma.gym.findFirst();
        
        if (!firstGym) {
            console.error('No gyms found. Please register a gym first.');
            return;
        }

        const email = 'superadmin@pulsefit.com';
        const password = 'pulsefit_super_2026'; // User can change it later
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
