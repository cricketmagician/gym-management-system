import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; // This is the GYM ID
        const session = await getServerSession(authOptions);
        
        // ONLY SuperAdmin can reset a gym's main admin password
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find the main administrator for this gym
        const admin = await prisma.user.findFirst({
            where: { gymId: id, role: 'ADMIN' }
        });

        if (!admin) {
            return NextResponse.json({ error: "No administrator found for this gym" }, { status: 404 });
        }

        const defaultPassword = "admin123@pulsefit"; // Secure default for admins
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        await prisma.user.update({
            where: { id: admin.id },
            data: { passwordHash }
        });

        return NextResponse.json({ 
            message: "Admin password reset successfully", 
            adminEmail: admin.email,
            defaultPassword 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
