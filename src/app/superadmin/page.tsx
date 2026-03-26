import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SuperAdminDashboardClient from '@/components/SuperAdminDashboardClient';

export default async function SuperAdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        redirect('/');
    }

    // Global Metrics
    const totalGyms = await prisma.gym.count();
    const totalUsers = await prisma.user.count({ where: { role: 'MEMBER' } });
    const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } });
    
    const gyms = await prisma.gym.findMany({
        include: {
            _count: {
                select: { users: true, memberships: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const initialGyms = gyms.map(g => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
        primaryColor: g.primaryColor,
        _count: g._count
    }));

    return (
        <SuperAdminDashboardClient 
            totalGyms={totalGyms}
            totalUsers={totalUsers}
            totalAdmins={totalAdmins}
            gyms={initialGyms}
        />
    );
}
