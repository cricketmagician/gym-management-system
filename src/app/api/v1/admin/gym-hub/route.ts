import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { gymId: true } });
        const gym = await prisma.gym.findUnique({
            where: { id: admin?.gymId },
            include: {
                offers: { orderBy: { createdAt: 'desc' } },
                services: { orderBy: { createdAt: 'asc' } },
                timings: { orderBy: { orderIndex: 'asc' } },
                announcements: { orderBy: { createdAt: 'desc' } }
            }
        });
        return NextResponse.json(gym);
    } catch (error) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const body = await req.json();

    try {
        const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { gymId: true } });
        if (!admin?.gymId) return NextResponse.json({ error: "No gym linked" }, { status: 400 });

        if (type === 'offer') {
            const offer = await prisma.offer.create({
                data: { ...body, gymId: admin.gymId }
            });
            return NextResponse.json(offer);
        }

        if (type === 'service') {
            const service = await prisma.service.create({
                data: { ...body, gymId: admin.gymId }
            });
            return NextResponse.json(service);
        }

        if (type === 'timing') {
            const timing = await prisma.gymTiming.create({
                data: { ...body, gymId: admin.gymId }
            });
            return NextResponse.json(timing);
        }

        if (type === 'announcement') {
            const announcement = await prisma.announcement.create({
                data: { ...body, gymId: admin.gymId }
            });
            return NextResponse.json(announcement);
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const body = await req.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        if (type === 'offer') {
            const offer = await prisma.offer.update({
                where: { id },
                data: body
            });
            return NextResponse.json(offer);
        }

        if (type === 'service') {
            const service = await prisma.service.update({
                where: { id },
                data: body
            });
            return NextResponse.json(service);
        }

        if (type === 'timing') {
            const timing = await prisma.gymTiming.update({
                where: { id },
                data: body
            });
            return NextResponse.json(timing);
        }

        if (type === 'announcement') {
            const announcement = await prisma.announcement.update({
                where: { id },
                data: body
            });
            return NextResponse.json(announcement);
        }

        if (type === 'branding') {
            const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { gymId: true } });
            if (!admin?.gymId) return NextResponse.json({ error: "No gym linked" }, { status: 400 });
            
            const gym = await prisma.gym.update({
                where: { id: admin.gymId },
                data: {
                    name: body.name,
                    logoUrl: body.logoUrl,
                    loginBackgroundUrl: body.loginBackgroundUrl,
                    primaryColor: body.primaryColor
                }
            });
            return NextResponse.json(gym);
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        if (type === 'offer') await prisma.offer.delete({ where: { id } });
        else if (type === 'service') await prisma.service.delete({ where: { id } });
        else if (type === 'timing') await prisma.gymTiming.delete({ where: { id } });
        else if (type === 'announcement') await prisma.announcement.delete({ where: { id } });
        else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

        return NextResponse.json({ success: true });
    } catch (error) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}
