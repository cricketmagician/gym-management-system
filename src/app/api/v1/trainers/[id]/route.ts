import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, specialization, photoUrl, bio } = body;

        const trainer = await prisma.trainer.update({
            where: { id },
            data: {
                name,
                specialization,
                photoUrl,
                bio
            }
        });

        return NextResponse.json(trainer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update trainer" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.trainer.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Trainer deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete trainer" }, { status: 500 });
    }
}
