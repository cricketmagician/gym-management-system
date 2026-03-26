import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const trainers = await prisma.trainer.findMany({
            where: { gymId: session.user.gymId },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(trainers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch trainers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, specialization, photoUrl, bio } = body;

        if (!name || !specialization) {
            return NextResponse.json({ error: "Name and specialization are required" }, { status: 400 });
        }

        const trainer = await prisma.trainer.create({
            data: {
                gymId: session.user.gymId,
                name,
                specialization,
                photoUrl,
                bio
            }
        });

        return NextResponse.json(trainer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create trainer" }, { status: 500 });
    }
}
