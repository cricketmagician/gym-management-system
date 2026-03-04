import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || "postgresql://myuser:mypassword@127.0.0.1:5432/gym_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        const user = await prisma.user.findFirst({
            where: { gymId: 'gym_01_pulsefit' },
            include: {
                memberships: {
                    include: { plan: true },
                    orderBy: { endDate: 'desc' }
                },
                attendances: {
                    orderBy: { timestamp: 'desc' },
                    take: 5
                }
            }
        });
        console.log("SUCCESS! User found:", !!user);
    } catch (e: any) {
        console.error("ERROR:", e.message);
    }
}

main().finally(() => prisma.$disconnect());
