import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getISTNow, getISTBoundary } from "@/lib/date-utils";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const gymId = session.user.gymId;

        const user = await prisma.user.findFirst({
            where: { id: userId, gymId: gymId }
        });

        if (!user) {
            return NextResponse.json({ error: "Member not found at this gym" }, { status: 404 });
        }

        // Check if member has an active membership
        const activeMembership = await prisma.membership.findFirst({
            where: {
                userId,
                status: "ACTIVE"
            }
        });

        if (!activeMembership) {
            return NextResponse.json({ error: "No active membership found. Please renew." }, { status: 403 });
        }

        // Use IST synchronized timestamp
        const now = new Date(); // DB still stores UTC
        const istNow = getISTNow();

        // 1. Check if already punched in today (based on IST date)
        const startOfISTToday = getISTBoundary('day');
        
        const todaysVisits = await prisma.attendance.count({
            where: {
                userId,
                timestamp: {
                    gte: startOfISTToday
                }
            }
        });

        // Hardcoding limit to 1 per day for this MVP
        if (todaysVisits >= 1) {
            return NextResponse.json({ error: "Daily visit limit reached." }, { status: 403 });
        }

        // All good, log attendance
        const attendance = await prisma.attendance.create({
            data: {
                userId,
                gymId,
                date: new Date(),
                timestamp: new Date()
            }
        });

        return NextResponse.json({ success: true, message: "Welcome!", record: attendance });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
