
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@pulsefit.com' },
            select: { gymId: true }
        });

        if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

        const trainers = [
            {
                name: 'Vikram Singh',
                specialization: 'Bodybuilding & Strength',
                photoUrl: '/trainers/vikram.png',
                bio: 'Elite bodybuilding coach with 12+ years of experience. Specializes in hypertrophy and contest prep.'
            },
            {
                name: 'Ananya Sharma',
                specialization: 'Yoga & Holistic Wellness',
                photoUrl: '/trainers/ananya.png',
                bio: 'Certified Yoga and Pilates instructor. Focused on mobility, mindfulness, and sustainable lifestyle changes.'
            },
            {
                name: 'Marcus Chen',
                specialization: 'Functional & CrossFit',
                photoUrl: '/trainers/marcus.png',
                bio: 'High-energy functional coach and CrossFit athlete. Dedicated to building explosive power and endurance.'
            }
        ];

        // Clean up old trainers for this specific gym to avoid clutter for the demo
        await prisma.trainer.deleteMany({
            where: { gymId: admin.gymId }
        });

        for (const t of trainers) {
            await prisma.trainer.create({
                data: {
                    ...t,
                    gymId: admin.gymId
                }
            });
        }

        return NextResponse.json({ success: true, message: "3 Premium Trainers added successfully to Gym " + admin.gymId });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
