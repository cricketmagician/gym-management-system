const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../src/generated/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const args = process.argv.slice(2);
    const email = args[0];
    const newPassword = args[1];

    if (!email || !newPassword) {
        console.log('Usage: node scripts/emergencyReset.ts <email> <newPassword>');
        return;
    }

    console.log(`--- EMERGENCY RESET: ${email} ---`);
    try {
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            console.error(`Error: User with email ${email} not found.`);
            return;
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash }
        });

        console.log('✅ PASSWORD RESET SUCCESSFUL');
        console.log(`User: ${user.name} (${user.role})`);
        console.log(`New Password: ${newPassword}`);
        console.log('---------------------------');

    } catch (e) {
        console.error("ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
