import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const admin = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { gymId: true }
        });

        if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

        const gym = await prisma.gym.findUnique({
            where: { id: admin.gymId }
        });

        return NextResponse.json(gym);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const admin = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { gymId: true }
        });

        if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

        const updatedGym = await prisma.gym.update({
            where: { id: admin.gymId },
            data: {
                name: body.name,
                whatsappNumber: body.whatsappNumber,
                instagramLink: body.instagramLink,
                locationDesc: body.locationDesc,
                bannerUrl: body.bannerUrl,
                upiId: body.upiId,
                upiNumber: body.upiNumber,
                wifiSsid: body.wifiSsid,
                wifiPassword: body.wifiPassword,
            }
        });

        return NextResponse.json(updatedGym);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
