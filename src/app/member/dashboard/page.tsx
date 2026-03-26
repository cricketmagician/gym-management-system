import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import MemberDashboardClient from '@/components/MemberDashboardClient';

export default async function MemberDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return <div>Unauthorized</div>;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            memberships: {
                where: { status: 'ACTIVE' },
                include: { plan: true },
                orderBy: { endDate: 'desc' },
                take: 1
            },
            attendances: true,
            workouts: {
                orderBy: { date: 'desc' },
                take: 5
            },
            weightGoals: {
                orderBy: { updatedAt: 'desc' },
                take: 1
            },
            gym: true
        }
    });

    if (!user) return <div>User not found</div>;

    const activeMembership = user.memberships[0];
    const daysLeft = activeMembership 
        ? Math.max(0, Math.ceil((new Date(activeMembership.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    const attendanceDates = user.attendances.map(a => new Date(a.date));
    const now = new Date();
    const thisWeekAttendance = attendanceDates.filter(d => isWithinInterval(d, { start: startOfWeek(now), end: endOfWeek(now) })).length;
    
    const workoutCount = user.workouts.length || 0;

    const trainers = await prisma.trainer.findMany({
        where: { gymId: user.gymId },
        take: 5
    });

    return (
        <MemberDashboardClient 
            user={user}
            activeMembership={activeMembership}
            daysLeft={daysLeft}
            thisWeekAttendance={thisWeekAttendance}
            workoutCount={workoutCount}
            trainers={trainers}
        />
    );
}
