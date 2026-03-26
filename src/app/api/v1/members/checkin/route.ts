import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { gymId: scannedGymId } = body;

        if (!scannedGymId) {
            return NextResponse.json({ error: "Gym ID is required" }, { status: 400 });
        }

        // Verify the user belongs to this gym
        if (session.user.gymId !== scannedGymId) {
            return NextResponse.json({ error: "Unauthorized: Gym ID mismatch" }, { status: 403 });
        }

        const now = new Date();
        const today = startOfDay(now);

        // Optional: Prevent duplicate check-ins for the same day (or same hour)
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                gymId: session.user.gymId,
                date: today
            }
        });

        if (existingAttendance) {
            // Already checked in today, maybe just return success if it's within a short window
            return NextResponse.json({ 
                message: "Already checked in for today",
                timestamp: existingAttendance.timestamp,
                status: 'success' 
            });
        }

        const attendance = await prisma.attendance.create({
            data: {
                userId: session.user.id,
                gymId: session.user.gymId,
                date: today,
                timestamp: now
            }
        });

        return NextResponse.json({ 
            message: "Check-in successful", 
            timestamp: attendance.timestamp,
            status: 'success'
        });
    } catch (error) {
        console.error("Error logging attendance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
