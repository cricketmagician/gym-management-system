import React from 'react';
import Link from 'next/link';
import { Search, Plus, TrendingUp, Users, AlertCircle, TrendingDown, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminQrControl from '@/components/AdminQrControl';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div style={{ 
                height: 'calc(100vh - 100px)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '24px',
                textAlign: 'center'
            }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--brand-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '8px' }}>
                    <Plus size={32} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Welcome to PulseFit</h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>Your premium gym management partner. Please sign in to access your dashboard.</p>
                </div>
                <Link href="/login" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none' }}>
                    Sign In to Continue
                </Link>
            </div>
        );
    }

    const gymId = session.user.gymId;
    const role = session.user.role;

    if (role === 'MEMBER') {
        redirect('/member/dashboard');
    }

    // AUTH: ADMIN / STAFF Dashboard
    const totalMembers = await prisma.user.count({ where: { gymId, role: 'MEMBER' } });
    const [activeMemberships, expiredMemberships] = await Promise.all([
        prisma.membership.count({ where: { gymId, status: 'ACTIVE' } }),
        prisma.membership.count({ where: { gymId, status: 'EXPIRED' } })
    ]);

    // Fetch Recent Attendance Activity for Admin
    const recentAttendance = await prisma.attendance.findMany({
        where: { gymId },
        include: { user: true },
        orderBy: { timestamp: 'desc' },
        take: 8
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="dashboard-container">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Overview</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Welcome back, PulseFit activity today.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <AdminQrControl gymId={gymId} />
                    <div style={{ position: 'relative', flex: '1 1 200px' }}>
                        <Search style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                padding: '10px 16px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--surface-color)',
                                color: 'var(--text-primary)',
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <Link href="/members/new" className="btn btn-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        Add Member
                    </Link>
                </div>
            </header>

            <section className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <MetricCard title="Total Members" value={totalMembers} icon={<Users size={20} />} trend="All time accounts" trendUp={true} />
                <MetricCard title="Active Members" value={activeMemberships} icon={<TrendingUp size={20} />} trend="Currently permitted" trendUp={true} color="var(--status-active-text)" bg="var(--status-active-bg)" />
                <MetricCard title="Recent Punch-Ins" value={recentAttendance.length} icon={<Clock size={20} />} trend="Last 24 hours activity" trendUp={true} color="var(--brand-primary)" bg="rgba(79,70,229,0.1)" />
                <MetricCard title="Expired" value={expiredMemberships} icon={<TrendingDown size={20} />} trend="Lapsed access" trendUp={false} color="var(--status-expired-text)" bg="var(--status-expired-bg)" />
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Activity (Verified Attendance)</h2>
                    <Link href="/attendance" className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textDecoration: 'none' }}>View All Attendance</Link>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Member Name</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAttendance.length > 0 ? recentAttendance.map((record) => {
                                return (
                                    <tr key={record.id}>
                                        <td style={{ fontWeight: 500 }}>{record.user?.name || 'Unknown'}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>
                                            <span className="badge active">VERIFIED</span>
                                        </td>
                                        <td>
                                            <Link href={`/members/${record.userId}`} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>View History</Link>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <AlertCircle size={32} opacity={0.5} />
                                            <p>No recent activity logged.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

// Micro-component for encapsulation
function MetricCard({ title, value, icon, trend, trendUp, color = 'var(--brand-primary)', bg = 'rgba(79,70,229,0.1)' }: { title: string, value: string | number, icon: React.ReactNode, trend: string, trendUp: boolean, color?: string, bg?: string }) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
                    <p className="numbers" style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1 }}>{value}</p>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', background: bg, color: color }}>
                    {icon}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: trendUp ? 'var(--status-active-text)' : 'var(--text-secondary)' }}>
                {trend}
            </div>
        </div>
    );
}
