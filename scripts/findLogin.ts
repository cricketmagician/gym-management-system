const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || "postgresql://myuser:mypassword@127.0.0.1:5432/gym_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- USER DATA ---')
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                phone: true,
                role: true
            }
        })

        users.forEach(u => {
            console.log(`[${u.role}] Name: ${u.name} | Email: ${u.email || 'N/A'} | Phone: ${u.phone || 'N/A'}`)
        })
    } catch (e) {
        console.error("ERROR:", e.message);
    }
    console.log('---------------------------')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
