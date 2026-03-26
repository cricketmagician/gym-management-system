import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { gymId: true }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const gym = await prisma.gym.findUnique({
            where: { id: user.gymId },
            include: {
                offers: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
                services: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
                timings: { orderBy: { orderIndex: 'asc' } }
            }
        });

        return NextResponse.json(gym);
    } catch (error) {
        console.error("Gym Hub Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
