import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const gymId = 'gym_01_pulsefit';

    try {
        const gym = await prisma.gym.update({
            where: { id: gymId },
            data: {
                primaryColor: '#0D9488', // Teal 600
                secondaryColor: '#0F766E', // Teal 700
                fontFamily: "'Inter', sans-serif",
                name: 'PulseFit Elite'
            }
        });
        console.log("SUCCESS: Gym branding updated for", gym.name);
    } catch (e: any) {
        console.error("ERROR:", e.message);
    }
}

main().finally(() => prisma.$disconnect());
