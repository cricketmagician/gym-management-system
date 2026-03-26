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
        const workouts = await prisma.workout.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' },
            take: 20
        });

        return NextResponse.json(workouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
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
        const { title, calories, duration } = body;

        if (!title) {
            return NextResponse.json({ error: "Workout title is required" }, { status: 400 });
        }

        const workout = await prisma.workout.create({
            data: {
                userId: session.user.id,
                gymId: session.user.gymId,
                title,
                calories: calories ? parseInt(calories) : null,
                duration: duration ? parseInt(duration) : null,
                date: new Date()
            }
        });

        return NextResponse.json({ 
            message: "Workout logged successfully", 
            workout,
            status: 'success'
        });
    } catch (error) {
        console.error("Error logging workout:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
