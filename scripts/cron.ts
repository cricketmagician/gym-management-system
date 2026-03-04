import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncExpiryStatus() {
    console.log(`[${new Date().toISOString()}] Running syncExpiryStatus...`);
    try {
        const expiredCount = await prisma.membership.updateMany({
            where: {
                endDate: { lt: new Date() },
                status: 'ACTIVE'
            },
            data: {
                status: 'EXPIRED'
            }
        });
        console.log(`[${new Date().toISOString()}] Synced ${expiredCount.count} memberships to EXPIRED.`);
    } catch (error) {
        console.error('Error in syncExpiryStatus:', error);
    }
}

async function sendReminders() {
    console.log(`[${new Date().toISOString()}] Running sendReminders...`);
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 7 Days from now
        const targetDate7Days = new Date(today);
        targetDate7Days.setDate(today.getDate() + 7);

        // 3 Days from now
        const targetDate3Days = new Date(today);
        targetDate3Days.setDate(today.getDate() + 3);

        // Find memberships ending in exactly 7 or 3 days where no reminder was sent today
        const membershipsToRemind = await prisma.membership.findMany({
            where: {
                status: 'ACTIVE',
                OR: [
                    {
                        endDate: {
                            gte: targetDate7Days,
                            lt: new Date(targetDate7Days.getTime() + 24 * 60 * 60 * 1000)
                        }
                    },
                    {
                        endDate: {
                            gte: targetDate3Days,
                            lt: new Date(targetDate3Days.getTime() + 24 * 60 * 60 * 1000)
                        }
                    }
                ],
                AND: [
                    {
                        OR: [
                            { lastNotifiedAt: null },
                            { lastNotifiedAt: { lt: today } } // Avoid sending twice in one day
                        ]
                    }
                ]
            },
            include: { user: true, gym: true, plan: true }
        });

        for (const membership of membershipsToRemind) {
            // Log logic or Queue Message for Email/SMS Provier (RabbitMQ/BullMQ)
            const diffTime = Math.abs(membership.endDate.getTime() - today.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            console.log(`--> Sending email to ${membership.user.email} (Gym: ${membership.gym.name}): Your ${membership.plan.name} plan expires in ${diffDays} days!`);

            // Update lastNotifiedAt
            await prisma.membership.update({
                where: { id: membership.id },
                data: { lastNotifiedAt: new Date() }
            });
        }

        console.log(`[${new Date().toISOString()}] Finished sending ${membershipsToRemind.length} reminders.`);
    } catch (error) {
        console.error('Error in sendReminders:', error);
    }
}

async function runCronJobs() {
    console.log('--- CRON JOB ENGINE STARTED ---');
    await syncExpiryStatus();
    await sendReminders();
    await prisma.$disconnect();
    console.log('--- CRON JOB ENGINE FINISHED ---');
}

runCronJobs();
