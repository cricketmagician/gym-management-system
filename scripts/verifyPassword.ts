const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || "postgresql://myuser:mypassword@127.0.0.1:5432/gym_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'john@example.com';
    const password = 'password123';

    try {
        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (!user) {
            console.log("User not found");
            return;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        console.log(`Password comparison for ${email}: ${isValid}`);
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
