import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.workout.delete({
            where: { 
                id,
                userId: session.user.id // Security: Ensure user owns the workout
            }
        });

        return NextResponse.json({ message: "Workout deleted successfully" });
    } catch (error) {
        console.error("Error deleting workout:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
