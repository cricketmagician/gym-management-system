import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const gymId = 'gym_01_pulsefit';

    // 1. Create a Gym
    const gym = await prisma.gym.upsert({
        where: { slug: gymId },
        update: {},
        create: {
            id: gymId,
            name: 'PulseFit Downtown',
            slug: gymId,
            timezone: 'UTC',
            currency: 'USD',
        },
    });

    console.log('Upserted Gym:', gym.name);

    // 2. Create Admin User
    const adminEmail = 'admin@pulsefit.com';
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { gymId_email: { gymId: gym.id, email: adminEmail } },
        update: { passwordHash: hashedPassword, role: 'ADMIN' },
        create: {
            gymId: gym.id,
            name: 'Admin Joe',
            email: adminEmail,
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Upserted Admin:', admin.email);

    // 3. Create a Plan
    const plan = await prisma.plan.upsert({
        where: { name: 'Standard Monthly' },
        update: { durationDays: 30 },
        create: {
            name: 'Standard Monthly',
            durationDays: 30,
        }
    });
    console.log('Created Plan:', plan.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
