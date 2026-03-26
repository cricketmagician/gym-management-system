import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { photoUrl } = body;

        if (!photoUrl) {
            return NextResponse.json({ error: "photoUrl is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { photoUrl }
        });

        return NextResponse.json({ 
            message: "Profile photo updated successfully", 
            photoUrl: updatedUser.photoUrl 
        });
    } catch (error) {
        console.error("Error updating profile photo:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
