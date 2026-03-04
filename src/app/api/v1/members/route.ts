import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is logged in and has STAFF or ADMIN role
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const gymId = session.user.gymId;
        const body = await req.json();
        const { name, email, phone, planId, startDate, gender, amount } = body;

        // We use a transaction to create User and Membership atomically
        const result = await prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    gymId,
                    name,
                    email: email || null,
                    phone,
                    gender,
                    role: "MEMBER",
                    passwordHash: await bcrypt.hash("changeme123", 10), // Default password
                }
            });

            // Find the selected plan, or fallback to the first available plan
            const plan = planId
                ? await tx.plan.findUnique({ where: { id: planId } })
                : await tx.plan.findFirst();

            if (!plan) throw new Error("No plans available for this gym.");

            // Calculate end date based on actual plan duration
            const end = new Date(startDate);
            end.setDate(end.getDate() + plan.durationDays);

            // Create membership
            const membership = await tx.membership.create({
                data: {
                    user: { connect: { id: user.id } },
                    plan: { connect: { id: plan.id } },
                    gym: { connect: { id: gymId } },
                    startDate: new Date(startDate),
                    endDate: end,
                    status: "ACTIVE",
                }
            });

            // Record the payment
            const paymentAmount = amount ? Number(amount) : 0;

            if (paymentAmount > 0) {
                await tx.payment.create({
                    data: {
                        userId: user.id,
                        gymId,
                        membershipId: membership.id,
                        amount: paymentAmount,
                        currency: "INR",
                        status: "SUCCESS",
                        date: new Date()
                    }
                });
            }

            // Audit Log
            await tx.auditLog.create({
                data: {
                    gymId,
                    actorId: session.user.id,
                    targetId: user.id,
                    action: "MEMBER_CREATED",
                    newData: { userId: user.id, membershipId: membership.id, amountPaid: paymentAmount }
                }
            });

            return { user, membership };
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const gymId = session.user.gymId;

        // List all members for this gym
        const members = await prisma.user.findMany({
            where: { gymId, role: "MEMBER" },
            include: {
                memberships: {
                    where: { gymId },
                    include: { plan: true },
                    orderBy: { endDate: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(members);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
