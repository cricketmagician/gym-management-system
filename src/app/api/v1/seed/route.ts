import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        const gymId = 'gym_01_pulsefit';

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

        const plan = await prisma.plan.upsert({
            where: { name: 'Standard Monthly' },
            update: { durationDays: 30 },
            create: {
                name: 'Standard Monthly',
                durationDays: 30,
            }
        });

        return NextResponse.json({ success: true, gym, adminEmail });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
