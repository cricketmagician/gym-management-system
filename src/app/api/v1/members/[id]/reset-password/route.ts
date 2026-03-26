import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        
        // Only ADMIN or STAFF (within the same gym) can reset a member's password
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF" && session.user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const gymId = session.user.gymId;
        const defaultPassword = "gym123"; // Standard default password
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        // Update the user's password
        // If SuperAdmin, they can reset across gyms, otherwise restrict by gymId
        const whereClause = session.user.role === 'SUPER_ADMIN' ? { id } : { id, gymId };

        await prisma.user.update({
            where: whereClause,
            data: { passwordHash }
        });

        return NextResponse.json({ message: "Password reset successfully", defaultPassword });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
