
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@pulsefit.com' },
        select: { gymId: true }
    });

    if (!admin) {
        console.error('Admin not found');
        return;
    }

    const gymId = admin.gymId;

    const trainers = [
        {
            name: 'Vikram Singh',
            specialization: 'Bodybuilding & Strength',
            photoUrl: '/trainers/vikram.png',
            bio: 'Elite bodybuilding coach with 12+ years of experience. Specializes in hypertrophy and contest prep.'
        },
        {
            name: 'Ananya Sharma',
            specialization: 'Yoga & Holistic Wellness',
            photoUrl: '/trainers/ananya.png',
            bio: 'Certified Yoga and Pilates instructor. Focused on mobility, mindfulness, and sustainable lifestyle changes.'
        },
        {
            name: 'Marcus Chen',
            specialization: 'Functional & CrossFit',
            photoUrl: '/trainers/marcus.png',
            bio: 'High-energy functional coach and CrossFit athlete. Dedicated to building explosive power and endurance.'
        }
    ];

    for (const t of trainers) {
        await prisma.trainer.create({
            data: {
                ...t,
                gymId: gymId
            }
        });
        console.log(`Trainer ${t.name} added to Gym ${gymId}`);
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
