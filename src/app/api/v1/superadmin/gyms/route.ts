import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Unauthorized access. SuperAdmin only." }, { status: 401 });
        }

        const body = await req.json();
        const { gymName, gymSlug, adminName, adminEmail, adminPassword } = body;

        if (!gymName || !gymSlug || !adminName || !adminEmail || !adminPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Create the Gym
        const newGym = await prisma.gym.create({
            data: {
                name: gymName,
                slug: gymSlug,
                timezone: "Asia/Kolkata",
                currency: "INR",
                primaryColor: "#f59e0b", // Default Elite Amber
                secondaryColor: "#000000",
                fontFamily: "'Inter', sans-serif"
            }
        });

        // 2. Hash Password and Create Admin User
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        const newAdmin = await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                passwordHash: passwordHash,
                role: "ADMIN",
                gymId: newGym.id
            }
        });

        return NextResponse.json({ 
            success: true, 
            gym: newGym, 
            admin: { id: newAdmin.id, email: newAdmin.email } 
        });

    } catch (error: any) {
        console.error("Gym Registration Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Gym Slug or Admin Email already exists." }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
