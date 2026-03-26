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

    const recentAttendance = await prisma.attendance.findMany({
        where: { gymId },
        include: { user: true },
        orderBy: { timestamp: 'desc' },
        take: 8
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: '100vh', padding: '24px' }} className="admin-dashboard">
            <header style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '24px',
                paddingBottom: '8px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ background: '#2dd4bf', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', width: 'fit-content', marginBottom: '12px' }}>MANAGEMENT</div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#111', lineHeight: 1 }}>Command Center</h1>
                        <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9375rem', fontWeight: 500 }}>Live gym operations and member activity.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <AdminQrControl gymId={gymId} />
                    </div>
                </div>
                
                <Link href="/members/new" className="btn-renew" style={{ 
                    textDecoration: 'none', 
                    background: '#000', 
                    color: '#fff', 
                    padding: '16px', 
                    borderRadius: '18px', 
                    border: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                    <Plus size={20} /> <span style={{ fontWeight: 800, letterSpacing: '0.02em' }}>ADD NEW MEMBER</span>
                </Link>
            </header>

            {/* Metric Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                <MetricCard 
                    title="Total Population" 
                    value={totalMembers} 
                    icon={<Users size={22} />} 
                    subtitle="Registered members" 
                    glowColor="rgba(45, 212, 191, 0.2)"
                />
                <MetricCard 
                    title="Active Access" 
                    value={activeMemberships} 
                    icon={<TrendingUp size={22} />} 
                    subtitle="Current permissions" 
                    glowColor="rgba(56, 189, 248, 0.2)"
                    variant="dark"
                />
                <MetricCard 
                    title="Recent Check-ins" 
                    value={recentAttendance.length} 
                    icon={<Clock size={22} />} 
                    subtitle="Last 24 hours" 
                    glowColor="rgba(251, 146, 60, 0.2)"
                />
                <MetricCard 
                    title="Lapsed Members" 
                    value={expiredMemberships} 
                    icon={<AlertCircle size={22} />} 
                    subtitle="Requires attention" 
                    glowColor="rgba(239, 68, 68, 0.2)"
                />
            </section>

            {/* Recent Activity Section */}
            <section className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Verified Activity</h2>
                    <Link href="/attendance" style={{ color: '#2dd4bf', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>View All Records →</Link>
                </div>

                <div className="modern-table-container" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '0 16px' }}>Member</th>
                                <th style={{ padding: '0 16px' }}>Timing</th>
                                <th style={{ padding: '0 16px' }}>Verification</th>
                                <th style={{ padding: '0 16px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAttendance.length > 0 ? recentAttendance.map((record) => (
                                <tr key={record.id} style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '16px' }}>
                                    <td style={{ padding: '16px', borderRadius: '16px 0 0 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                                                {record.user?.name?.[0] || '?'}
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{record.user?.name || 'Unknown User'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: '#666', fontSize: '0.875rem' }}>
                                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700, fontSize: '0.75rem' }}>
                                            <CheckCircle2 size={14} /> SECURE
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                        <Link href={`/members/${record.userId}`} className="btn-action" style={{ padding: '8px 16px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', color: '#000' }}>View Profile</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                                        <p>No recent check-ins recorded.</p>
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

import { CheckCircle2 } from 'lucide-react';

function MetricCard({ title, value, icon, subtitle, glowColor, variant = 'light' }: { title: string, value: string | number, icon: React.ReactNode, subtitle: string, glowColor: string, variant?: 'light' | 'dark' }) {
    const isDark = variant === 'dark';
    return (
        <div className={isDark ? "glass-card-dark" : "glass-card"} style={{ 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ 
                position: 'absolute', 
                top: '-20px', 
                right: '-20px', 
                width: '80px', 
                height: '80px', 
                background: glowColor, 
                borderRadius: '50%', 
                filter: 'blur(30px)' 
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#fff' : '#000' }}>
                    {icon}
                </div>
            </div>
            
            <div>
                <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{title}</p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.03em' }}>{value}</h3>
                <p style={{ fontSize: '0.8125rem', color: isDark ? 'rgba(255,255,255,0.4)' : '#999' }}>{subtitle}</p>
            </div>
        </div>
    );
}
