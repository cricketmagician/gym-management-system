import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        const gymId = 'gym_01_pulsefit';

        // Verify Gym exists
        const gym = await prisma.gym.findUnique({ where: { slug: gymId } });
        if (!gym) return NextResponse.json({ error: "Gym not found" }, { status: 400 });

        // Verify Plan exists
        const plan = await prisma.plan.findFirst();
        if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 400 });

        const demoUsers = [
            { name: "Bruce Wayne", email: "bruce@example.com", status: "ACTIVE", gender: "MALE" },
            { name: "Diana Prince", email: "diana@example.com", status: "ACTIVE", gender: "FEMALE" },
            { name: "Clark Kent", email: "clark@example.com", status: "PENDING", gender: "MALE" },
            { name: "Natasha Romanoff", email: "natasha@example.com", status: "EXPIRED", gender: "FEMALE" },
            { name: "Peter Parker", email: "peter@example.com", status: "ACTIVE", gender: "MALE" },
            { name: "Wanda Maximoff", email: "wanda@example.com", status: "FROZEN", gender: "FEMALE" },
            { name: "Samus Aran", email: "samus@example.com", status: "PENDING", gender: "FEMALE" },
            { name: "Chris Redfield", email: "chris@example.com", status: "ACTIVE", gender: "MALE" },
        ];

        for (const u of demoUsers) {
            // Create or update user
            const user = await prisma.user.upsert({
                where: { gymId_email: { gymId, email: u.email } },
                update: {},
                create: {
                    gymId,
                    name: u.name,
                    email: u.email,
                    role: 'MEMBER',
                    passwordHash: await bcrypt.hash('password123', 10)
                }
            });

            // Set realistic dates based on status
            const now = new Date();
            let startDate = new Date();
            let endDate = new Date();

            if (u.status === 'EXPIRED') {
                startDate.setMonth(now.getMonth() - 2);
                endDate.setMonth(now.getMonth() - 1);
            } else if (u.status === 'PENDING') {
                startDate.setDate(now.getDate() + 5); // Starts in 5 days
            } else {
                // Active
                startDate.setDate(now.getDate() - 10);
                endDate.setDate(now.getDate() + 20); // Expires in 20 days
            }

            // Create membership
            await prisma.membership.create({
                data: {
                    user: { connect: { id: user.id } },
                    plan: { connect: { id: plan.id } },
                    gym: { connect: { id: gym.id } },
                    startDate,
                    endDate,
                    status: u.status as any,
                }
            });
        }

        return NextResponse.json({ success: true, seeded: demoUsers.length });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
