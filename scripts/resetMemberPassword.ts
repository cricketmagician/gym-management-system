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
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`Resetting password for ${email}...`);

    try {
        const user = await prisma.user.updateMany({
            where: { email: email.toLowerCase() },
            data: {
                passwordHash: hashedPassword,
                email: email.toLowerCase() // ensure lowercase
            }
        });

        if (user.count > 0) {
            console.log(`SUCCESS: Reset ${user.count} user(s).`);
            console.log(`Credentials: Email: ${email} | Password: ${newPassword}`);
        } else {
            console.log(`ERROR: User with email ${email} not found.`);
        }
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
