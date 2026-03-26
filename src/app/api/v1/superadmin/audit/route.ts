import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const gymId = searchParams.get('gymId');

    if (!gymId) {
        return NextResponse.json({ error: "Gym ID required" }, { status: 400 });
    }

    try {
        const logs = await prisma.auditLog.findMany({
            where: { gymId },
            include: {
                actor: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { timestamp: 'desc' },
            take: 50 // Limit to latest 50 for performance
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error("Audit fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
