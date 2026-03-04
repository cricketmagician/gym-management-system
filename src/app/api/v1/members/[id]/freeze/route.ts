import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: userId } = await params;
        const body = await req.json();
        const { expectedResumeDate } = body;

        const membership = await prisma.membership.findFirst({
            where: { userId, status: "ACTIVE" }
        });

        if (!membership) {
            return NextResponse.json({ error: "No active membership found for user" }, { status: 404 });
        }

        const updatedMembership = await prisma.membership.update({
            where: { id: membership.id },
            data: {
                status: "FROZEN",
                freezeDate: new Date(),
                expectedResumeDate: expectedResumeDate ? new Date(expectedResumeDate) : null,
            }
        });

        await prisma.auditLog.create({
            data: {
                gymId: session.user.gymId,
                actorId: session.user.id,
                targetId: userId,
                action: "MEMBERSHIP_FROZEN",
                oldData: { status: membership.status },
                newData: { status: "FROZEN" }
            }
        });

        return NextResponse.json(updatedMembership);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
