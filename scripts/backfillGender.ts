import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Backfilling missing genders...");

    // Find users with no gender
    const usersWithoutGender = await prisma.user.findMany({
        where: { gender: null }
    });

    console.log(`Found ${usersWithoutGender.length} users missing a gender.`);

    for (const user of usersWithoutGender) {
        // Simple heuristic: if name sounds female (ends in a), make female. Otherwise male.
        // For arbitrary test accounts like "vikas", this will default to MALE.
        const name = user.name || "";
        const isLikelyFemale = name.trim().toLowerCase().endsWith('a') && name.toLowerCase() !== "vikas";

        await prisma.user.update({
            where: { id: user.id },
            data: { gender: isLikelyFemale ? "FEMALE" : "MALE" }
        });

        console.log(`Updated ${user.name} to ${isLikelyFemale ? "FEMALE" : "MALE"}`);
    }

    console.log("Backfill complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
