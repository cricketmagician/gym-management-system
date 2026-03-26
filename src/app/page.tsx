import React from 'react';
import Link from 'next/link';
import { Search, Plus, TrendingUp, Users, AlertCircle, TrendingDown, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminQrControl from '@/components/AdminQrControl';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div style={{ 
                height: '100vh', 
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                background: '#000',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 100 // High priority to cover footer
            }}>
                {/* Cinematic Background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url("/landing-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.4,
                    filter: 'grayscale(0.3) contrast(1.2)'
                }} />

                {/* Motivational Watermark */}
                <div className="watermark-text" style={{ 
                    position: 'absolute', 
                    top: '5vh', 
                    left: '4vw', 
                    opacity: 0.05, 
                    pointerEvents: 'none',
                    zIndex: 1 
                }}>
                    PULSE FIT<br/>
                    GO GYM<br/>
                    FOCUS TRAIN<br/>
                    STAY HARD<br/>
                    LIMITLESS<br/>
                    ELITE POWER<br/>
                    PURE GRIND
                </div>

                {/* Luxe Glass Gateway */}
                <div style={{ 
                    position: 'relative', 
                    zIndex: 10,
                    width: '90%',
                    maxWidth: '480px',
                    padding: '60px 40px',
                    borderRadius: '48px',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '40px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                    animation: 'landingFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'linear-gradient(135deg, var(--brand-primary) 0%, #d97706 100%)', 
                            borderRadius: '24px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#000',
                            boxShadow: '0 0 40px rgba(245, 158, 11, 0.4)',
                            animation: 'pulseGlow 3s infinite ease-in-out'
                        }}>
                            <TrendingUp size={40} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="font-premium" style={{ 
                                fontSize: '3rem', 
                                fontWeight: 950, 
                                lineHeight: 1, 
                                letterSpacing: '-0.05em',
                                color: '#fff',
                                marginBottom: '12px'
                            }}>PulseFit</h1>
                            <p style={{ 
                                fontSize: '1rem', 
                                color: 'rgba(255,255,255,0.6)', 
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase'
                            }}>The Elite Fitness Command</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                        <Link href="/login" style={{ 
                            width: '100%',
                            padding: '22px', 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '20px',
                            color: '#000',
                            fontSize: '1.125rem',
                            fontWeight: 900,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: '0 20px 40px rgba(245, 158, 11, 0.25)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }} className="scale-hover">
                            ENTER COMMAND CENTER
                        </Link>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', fontWeight: 500 }}>Authorized Personnel Only</p>
                    </div>
                </div>
            </div>
        );
    }

    const gymId = session.user.gymId;
    const role = session.user.role;

    if (role === 'SUPER_ADMIN') {
        redirect('/superadmin');
    }

    if (role === 'MEMBER') {
        redirect('/member/dashboard');
    }

    // AUTH: ADMIN / STAFF Dashboard
    const totalMembers = await prisma.user.count({ where: { gymId, role: 'MEMBER' } });
    
    // Proactive Intelligence Metrics
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [activeCount, expiredCount, expiringSoonCount, expiringMembers, expiredMembers, gym] = await Promise.all([
        prisma.membership.count({ where: { gymId, status: 'ACTIVE' } }),
        prisma.membership.count({ where: { gymId, status: 'EXPIRED' } }),
        prisma.membership.count({ 
            where: { 
                gymId, 
                status: 'ACTIVE',
                endDate: { gt: now, lte: sevenDaysFromNow }
            } 
        }),
        prisma.user.findMany({
            where: { 
                gymId, 
                role: 'MEMBER',
                memberships: { some: { status: 'ACTIVE', endDate: { gt: now, lte: sevenDaysFromNow } } }
            },
            include: { memberships: { where: { status: 'ACTIVE' }, include: { plan: true } } },
            take: 10
        }),
        prisma.user.findMany({
            where: { 
                gymId, 
                role: 'MEMBER',
                memberships: { some: { status: 'EXPIRED' } }
            },
            include: { memberships: { where: { status: 'EXPIRED' }, include: { plan: true }, orderBy: { endDate: 'desc' }, take: 1 } },
            take: 10
        }),
        prisma.gym.findUnique({ where: { id: gymId } })
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
                        <div style={{ background: 'var(--brand-primary)', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', width: 'fit-content', marginBottom: '12px', boxShadow: '0 4px 12px rgba(45, 212, 191, 0.2)' }}>MANAGEMENT</div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>Command Center</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem', fontWeight: 500, opacity: 0.9 }}>Live gym operations and member activity monitoring.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <AdminLogoutButton />
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

            <AdminDashboardClient 
                totalMembers={totalMembers}
                activeCount={activeCount}
                expiringSoonCount={expiringSoonCount}
                expiredCount={expiredCount}
                recentAttendanceLength={recentAttendance.length}
                expiringMembers={expiringMembers as any}
                expiredMembers={expiredMembers as any}
                gymName={gym?.name || 'PulseFit'}
                gymWhatsApp={gym?.whatsappNumber || ''}
            />

            {/* Recent Activity Section */}
            <section className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Recent Verified Activity</h2>
                    <Link href="/attendance" style={{ color: 'var(--brand-primary)', fontWeight: 800, fontSize: '0.8125rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View All Records →</Link>
                </div>

                <div className="modern-table-container" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                                <th style={{ padding: '12px 16px' }}>Member</th>
                                <th style={{ padding: '12px 16px' }}>Timing</th>
                                <th style={{ padding: '12px 16px' }}>Verification</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
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
