const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL not found in .env");
    process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'john@test.com'; // Use the email found in remote DB
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`Resetting password for ${email} in REMOTE DB...`);

    try {
        const user = await prisma.user.updateMany({
            where: { email: email.toLowerCase() },
            data: {
                passwordHash: hashedPassword,
            }
        });

        if (user.count > 0) {
            console.log(`SUCCESS: Reset ${user.count} user(s).`);
            console.log(`Credentials: Email: ${email} | Password: ${newPassword}`);
        } else {
            console.log(`ERROR: User with email ${email} not found in REMOTE DB.`);

            // Try to create john@example.com if john@test.com is not what they want
            // But let's stick to fixing what's there first.
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
