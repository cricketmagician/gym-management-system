import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PaymentRecoveryClient from "@/components/PaymentRecoveryClient";

export default async function PaymentsPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
        redirect("/login");
    }

    const gymId = session.user.gymId;

    // Fetch memberships that are EXPIRED or expiring in the next 7 days
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const memberships = await prisma.membership.findMany({
        where: {
            gymId,
            OR: [
                { status: 'EXPIRED' },
                { endDate: { lt: now } },
                { 
                    AND: [
                        { status: 'ACTIVE' },
                        { endDate: { lte: sevenDaysFromNow } }
                    ]
                }
            ]
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    photoUrl: true
                }
            },
            plan: {
                select: {
                    id: true,
                    name: true,
                    durationDays: true
                }
            }
        },
        orderBy: {
            endDate: 'asc'
        }
    });

    // Fetch latest payment per membership to estimate recovery amount (if plan amount isn't explicitly stored)
    // Actually, we can just use the plan name and typical price if known, or show 'Pending Recovery' based on user history.
    // For now, let's just pass the data to the client component.

    const gym = await prisma.gym.findUnique({
        where: { id: gymId },
        select: { name: true, whatsappNumber: true }
    });

    return (
        <div className="payments-container lux-root" style={{ padding: '60px', minHeight: '100vh', background: 'var(--bg-deep)' }}>
            <PaymentRecoveryClient 
                initialMemberships={memberships as any} 
                gymName={gym?.name || 'PulseFit'}
                gymWhatsApp={gym?.whatsappNumber || ''}
            />
        </div>
    );
}
