import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const gymId = 'gym_01_pulsefit';

    // Verify Gym exists
    const gym = await prisma.gym.findUnique({ where: { slug: gymId } });
    if (!gym) {
        console.error("Gym not found. Please run seedAdmin.ts first.");
        return;
    }

    // Verify Plan exists
    const plan = await prisma.plan.findFirst();
    if (!plan) {
        console.error("Plan not found. Please run seedAdmin.ts first.");
        return;
    }

    const demoUsers = [
        { name: "Sarah Connor", email: "sarah@example.com", status: "ACTIVE" },
        { name: "John Wick", email: "john@example.com", status: "ACTIVE" },
        { name: "Ellen Ripley", email: "ellen@example.com", status: "EXPIRING" },
        { name: "Tony Stark", email: "tony@example.com", status: "EXPIRED" },
    ];

    console.log(`Seeding 4 demo members for ${gym.name}...`);

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
        } else if (u.status === 'EXPIRING') {
            startDate.setMonth(now.getMonth() - 1);
            endDate.setDate(now.getDate() + 2); // Expires in 2 days
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
                status: u.status as any, // Bypass TS enum strictness for simplicity in seeding
            }
        });

        console.log(`Created member: ${user.name} (${u.status})`);
    }

    console.log("Demo members seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
