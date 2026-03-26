import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const gymId = session.user.gymId;
        const body = await req.json();
        const { name, email, phone, gender, photoUrl, startDate, planId } = body;

        // Update user and potentially their active membership's start date/plan
        const updatedUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: id, gymId: gymId },
                data: { name, email, phone, gender, photoUrl }
            });

            if (startDate || planId) {
                const latestMembership = await tx.membership.findFirst({
                    where: { userId: id, gymId: gymId },
                    orderBy: { createdAt: 'desc' },
                    include: { plan: true }
                });

                if (latestMembership) {
                    let newStartDate = latestMembership.startDate;
                    if (startDate) newStartDate = new Date(startDate);

                    let newPlanId = latestMembership.planId;
                    let durationDays = latestMembership.plan.durationDays;

                    if (planId && planId !== latestMembership.planId) {
                        const newPlan = await tx.plan.findUnique({
                            where: { id: planId }
                        });
                        if (newPlan) {
                            newPlanId = newPlan.id;
                            durationDays = newPlan.durationDays;
                        }
                    }

                    const end = new Date(newStartDate);
                    end.setDate(end.getDate() + durationDays);

                    await tx.membership.update({
                        where: { id: latestMembership.id },
                        data: {
                            startDate: newStartDate,
                            planId: newPlanId,
                            endDate: end
                        }
                    });
                }
            }

            return user;
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
