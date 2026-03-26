
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@pulsefit.com' },
        select: { gymId: true }
    });

    if (admin) {
        console.log(`GYM_ID_FOUND:${admin.gymId}`);
    } else {
        console.log('GYM_ID_NOT_FOUND');
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
