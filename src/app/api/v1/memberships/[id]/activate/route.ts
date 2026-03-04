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

        const membership = await prisma.membership.findFirst({
            where: { id: membershipId, gymId }
        });

        if (!membership) {
            return NextResponse.json({ error: "Membership not found" }, { status: 404 });
        }

        if (membership.status === 'ACTIVE') {
            return NextResponse.json({ error: "Membership is already active" }, { status: 400 });
        }

        await prisma.membership.update({
            where: { id: membership.id },
            data: { status: 'ACTIVE' }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                gymId,
                actorId: session.user.id,
                targetId: membership.userId,
                action: 'MEMBERSHIP_ACTIVATED',
                newData: { status: 'ACTIVE' }
            }
        });

        return NextResponse.json({ success: true, status: 'ACTIVE' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
