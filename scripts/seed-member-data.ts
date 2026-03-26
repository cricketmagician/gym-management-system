import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("Seeding data for member dashboard...");

  const gym = await prisma.gym.findFirst();
  if (!gym) {
    console.error("No gym found. Please create a gym first.");
    return;
  }

  // 1. Create Trainers
  const trainersData = [
    {
      name: "Abhahama",
      specialization: "Trainers",
      photoUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
      gymId: gym.id,
    },
    {
      name: "Nihal Dintan",
      specialization: "Specialization",
      photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
      gymId: gym.id,
    },
  ];

  for (const trainer of trainersData) {
    await prisma.trainer.upsert({
      where: { id: trainer.name.replace(/\s/g, "-").toLowerCase() }, // Mock ID
      update: {},
      create: {
        ...trainer,
        id: crypto.randomUUID(),
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
