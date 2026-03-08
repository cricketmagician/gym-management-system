const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL not found in .env");
    process.exit(1);
}

console.log("Using Database URL:", process.env.DATABASE_URL.split('@')[1]); // Log host for verification

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- USER DATA STATUS (REMOTE) ---')
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                role: true,
                passwordHash: true
            }
        })

        if (users.length === 0) {
            console.log("No users found in this database!");
        }

        users.forEach(u => {
            const hasHash = !!u.passwordHash;
            console.log(`[${u.role}] Name: ${u.name} | Email: ${u.email || 'N/A'} | Has Password: ${hasHash}`)
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
