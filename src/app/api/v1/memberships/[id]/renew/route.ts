import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: membershipId } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const gymId = session.user.gymId;
        const body = await req.json();
        const { amount, startDate } = body;

        const membership = await prisma.membership.findFirst({
            where: { id: membershipId, gymId },
            include: { plan: true }
        });

        if (!membership) {
            return NextResponse.json({ error: "Membership not found" }, { status: 404 });
        }

        // Calculate new end date
        // Use the provided startDate if available, otherwise fallback to existing logic
        const baseDate = startDate ? new Date(startDate) : (new Date(membership.endDate) > new Date() ? new Date(membership.endDate) : new Date());

        const newEndDate = new Date(baseDate);
        newEndDate.setDate(newEndDate.getDate() + membership.plan.durationDays);

        // Run in transaction
        await prisma.$transaction(async (tx) => {
            // 1. Update Membership
            await tx.membership.update({
                where: { id: membership.id },
                data: {
                    startDate: baseDate, // Update start date of the current membership to reflecting the renewal period
                    endDate: newEndDate,
                    status: 'ACTIVE' // Auto-activate if it was expired
                }
            });

            // 2. Record Payment
            await tx.payment.create({
                data: {
                    userId: membership.userId,
                    gymId: gymId,
                    membershipId: membership.id,
                    amount: amount,
                    currency: "INR",
                    status: "SUCCESS",
                    date: new Date()
                }
            });

            // 3. Audit Log
            await tx.auditLog.create({
                data: {
                    gymId,
                    actorId: session.user.id,
                    targetId: membership.userId,
                    action: 'MEMBERSHIP_RENEWED',
                    newData: { newEndDate, amountPaid: amount }
                }
            });
        });

        return NextResponse.json({ success: true, newEndDate });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
