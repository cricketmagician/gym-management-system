import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const gym = await prisma.gym.findUnique({
            where: { slug: params.slug },
            select: {
                name: true,
                logoUrl: true,
                loginBackgroundUrl: true,
                primaryColor: true
            }
        });

        if (!gym) {
            return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
        }

        return NextResponse.json(gym);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
