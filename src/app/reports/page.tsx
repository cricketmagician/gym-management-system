import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users, CreditCard, Activity, TrendingUp, DollarSign } from 'lucide-react';

export default async function ReportsPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div style={{ padding: '48px', textAlign: 'center' }}>Please sign in to view reports.</div>;
    }

    const gymId = session.user.gymId;

    // 1. Total Members
    const totalMembers = await prisma.user.count({
        where: { gymId, role: 'MEMBER' }
    });

    // 2. Active Memberships
    const activeMemberships = await prisma.membership.count({
        where: { gymId, status: 'ACTIVE' }
    });

    // 3. Current Month Revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const paymentsThisMonth = await prisma.payment.aggregate({
        where: {
            gymId,
            status: 'SUCCESS',
            date: { gte: startOfMonth }
        },
        _sum: { amount: true }
    });

    const monthlyRevenue = paymentsThisMonth._sum.amount ? paymentsThisMonth._sum.amount.toNumber() : 0;

    // 4. Today's Attendance
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todaysAttendance = await prisma.attendance.count({
        where: {
            gymId,
            timestamp: { gte: startOfDay }
        }
    });

    // 5. Recent Payments List
    const recentPayments = await prisma.payment.findMany({
        where: { gymId, status: 'SUCCESS' },
        orderBy: { date: 'desc' },
        take: 5,
        include: { user: true }
    });

    const MetricCard = ({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: any, trend?: string }) => (
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
                <div style={{ width: '40px', height: '40px', background: 'rgba(79,70,229,0.1)', color: 'var(--brand-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{value}</h3>
                {trend && <span style={{ color: 'var(--status-active-text)', background: 'var(--status-active-bg)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>{trend}</span>}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Gym Reports</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Track your revenue, attendance, and member growth.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <MetricCard title="Total Revenue (Month)" value={`₹${monthlyRevenue.toFixed(2)}`} icon={DollarSign} trend="+12%" />
                <MetricCard title="Active Members" value={activeMemberships} icon={Users} trend="+5" />
                <MetricCard title="Total Members" value={totalMembers} icon={CreditCard} />
                <MetricCard title="Today's Check-ins" value={todaysAttendance} icon={Activity} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={18} color="var(--brand-primary)" /> Revenue vs Attendance (Placeholder)
                    </h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Chart visualization will go here.</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Payments</h3>
                    {recentPayments.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentPayments.map((payment) => (
                                <div key={payment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <p style={{ fontWeight: 500 }}>{payment.user.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{payment.date.toLocaleDateString()}</p>
                                    </div>
                                    <span style={{ fontWeight: 600, color: 'var(--status-active-text)' }}>+₹{payment.amount.toNumber().toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No recent payments found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
