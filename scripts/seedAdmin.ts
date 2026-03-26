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

        // 3. Create Default Plans
        const defaultPlans = [
            { name: 'Standard Monthly', days: 30 },
            { name: 'Standard Quarterly', days: 90 },
            { name: 'Standard Half-Yearly', days: 180 },
            { name: 'Standard Yearly', days: 365 },
        ];

        for (const p of defaultPlans) {
            const plan = await prisma.plan.upsert({
                where: { name: p.name },
                update: { durationDays: p.days },
                create: {
                    name: p.name,
                    durationDays: p.days,
                }
            });
            console.log('Upserted Plan:', plan.name);
        }
    } catch (e: any) {
        console.error("SEED ERROR:", e.message);
        if (e.cause) console.error("CAUSE:", JSON.stringify(e.cause, null, 2));
        throw e;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
