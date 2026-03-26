import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const goal = await prisma.weightGoal.findFirst({
            where: { 
                userId: session.user.id,
                gymId: session.user.gymId
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(goal || { currentWeight: 0, targetWeight: 0 });
    } catch (error) {
        console.error("Error fetching weight goals:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { currentWeight, targetWeight } = body;

        if (currentWeight === undefined || targetWeight === undefined) {
            return NextResponse.json({ error: "Weights are required" }, { status: 400 });
        }

        // Check if a goal already exists for this user/gym
        const existingGoal = await prisma.weightGoal.findFirst({
            where: {
                userId: session.user.id,
                gymId: session.user.gymId
            }
        });

        let goal;
        if (existingGoal) {
            goal = await prisma.weightGoal.update({
                where: { id: existingGoal.id },
                data: {
                    currentWeight: parseFloat(currentWeight),
                    targetWeight: parseFloat(targetWeight)
                }
            });
        } else {
            goal = await prisma.weightGoal.create({
                data: {
                    userId: session.user.id,
                    gymId: session.user.gymId,
                    currentWeight: parseFloat(currentWeight),
                    targetWeight: parseFloat(targetWeight)
                }
            });
        }

        return NextResponse.json({ 
            message: "Goals updated successfully", 
            goal 
        });
    } catch (error) {
        console.error("Error updating weight goals:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
