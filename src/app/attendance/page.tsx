import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminAttendanceClient from '@/components/AdminAttendanceClient';

export default async function AttendancePage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
        return <div>Unauthorized access. Admin only.</div>;
    }

    const attendanceRecords = await prisma.attendance.findMany({
        orderBy: { date: 'desc' },
        include: {
            user: {
                include: {
                    memberships: {
                        include: { plan: true },
                        orderBy: { endDate: 'desc' },
                        take: 1
                    }
                }
            }
        },
        take: 200 // Show last 200 check-ins
    });

    return (
        <div style={{ padding: '24px' }}>
            <AdminAttendanceClient initialRecords={attendanceRecords} />
        </div>
    );
}
