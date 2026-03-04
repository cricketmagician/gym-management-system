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
        const { action } = body; // 'FREEZE' or 'UNFREEZE'

        const membership = await prisma.membership.findFirst({
            where: { id: membershipId, gymId }
        });

        if (!membership) {
            return NextResponse.json({ error: "Membership not found" }, { status: 404 });
        }

        let updateData: any = {};

        if (action === 'FREEZE' && membership.status === 'ACTIVE') {
            updateData = {
                status: 'FROZEN',
                freezeDate: new Date()
            };
        } else if (action === 'UNFREEZE' && membership.status === 'FROZEN') {
            updateData = {
                status: 'ACTIVE',
                freezeDate: null
            };

            // Optionally: Extend the end date mathematically by the number of days frozen.
            // Keeping it simple for MVP.
        } else {
            return NextResponse.json({ error: "Invalid state transition" }, { status: 400 });
        }

        await prisma.membership.update({
            where: { id: membership.id },
            data: updateData
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                gymId,
                actorId: session.user.id,
                targetId: membership.userId,
                action: action === 'FREEZE' ? 'MEMBERSHIP_FROZEN' : 'MEMBERSHIP_UNFROZEN',
                newData: updateData
            }
        });

        return NextResponse.json({ success: true, status: updateData.status });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
