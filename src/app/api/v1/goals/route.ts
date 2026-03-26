import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { currentWeight, targetWeight } = body;

        if (currentWeight === undefined || targetWeight === undefined) {
            return NextResponse.json({ error: "Current and target weights are required" }, { status: 400 });
        }

        // Upsert weight goal for the user
        const goal = await prisma.weightGoal.upsert({
            where: { id: (await prisma.weightGoal.findFirst({ where: { userId: session.user.id } }))?.id || 'new-goal' },
            update: {
                currentWeight: parseFloat(currentWeight),
                targetWeight: parseFloat(targetWeight),
            },
            create: {
                userId: session.user.id,
                gymId: session.user.gymId,
                currentWeight: parseFloat(currentWeight),
                targetWeight: parseFloat(targetWeight),
            }
        });

        return NextResponse.json({ 
            message: "Goals updated successfully", 
            goal,
            status: 'success'
        });
    } catch (error) {
        console.error("Error updating goals:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const goal = await prisma.weightGoal.findFirst({
            where: { userId: session.user.id }
        });

        return NextResponse.json(goal || { currentWeight: 0, targetWeight: 0 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
