import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { upiId, upiNumber, upiQrUrl } = body;

        const updatedGym = await prisma.gym.update({
            where: { id: id },
            data: {
                upiId,
                upiNumber,
                upiQrUrl
            }
        });

        return NextResponse.json(updatedGym);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
