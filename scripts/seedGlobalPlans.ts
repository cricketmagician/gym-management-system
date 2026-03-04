import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || "postgresql://myuser:mypassword@127.0.0.1:5432/gym_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding Global Plans...");

    // Create standard duration templates
    const plans = [
        { name: "Monthly", durationDays: 30 },
        { name: "Quarterly", durationDays: 90 },
        { name: "Half-Yearly", durationDays: 180 },
        { name: "Yearly", durationDays: 365 },
    ];

    for (const p of plans) {
        await prisma.plan.upsert({
            where: { name: p.name },
            update: { durationDays: p.durationDays },
            create: p
        });
    }

    console.log("Finished seeding global plans.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
