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

    // Proactive Intelligence Metrics
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    let dashboardData = {
        totalMembers: 0,
        activeCount: 0,
        expiredCount: 0,
        expiringSoonCount: 0,
        expiringMembers: [] as any[],
        expiredMembers: [] as any[],
        gym: null as any,
        recentAttendance: [] as any[]
    };

    try {
        const [totalMembers, activeCount, expiredCount, expiringSoonCount, expiringMembers, expiredMembers, gym, recentAttendance] = await Promise.all([
            prisma.user.count({ where: { gymId, role: 'MEMBER' } }),
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
            prisma.gym.findUnique({ where: { id: gymId } }),
            prisma.attendance.findMany({
                where: { gymId },
                include: { user: true },
                orderBy: { timestamp: 'desc' },
                take: 8
            })
        ]);

        dashboardData = {
            totalMembers,
            activeCount,
            expiredCount,
            expiringSoonCount,
            expiringMembers,
            expiredMembers,
            gym,
            recentAttendance
        };
    } catch (error) {
        console.error("Dashboard data fetch failed:", error);
    }

    const { totalMembers, activeCount, expiredCount, expiringSoonCount, expiringMembers, expiredMembers, gym, recentAttendance } = dashboardData;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh', padding: '40px', background: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }} className="admin-dashboard">
            {/* Cinematic Background Glows */}
            <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>
            <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>

            <header style={{ 
                position: 'relative', 
                zIndex: 1,
                display: 'flex', 
                flexDirection: 'column',
                gap: '32px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            color: '#f59e0b', 
                            padding: '8px 16px', 
                            borderRadius: '20px', 
                            fontSize: '0.7rem', 
                            fontWeight: 950, 
                            letterSpacing: '0.15em', 
                            width: 'fit-content', 
                            marginBottom: '20px',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            backdropFilter: 'blur(10px)'
                        }}>COMMAND CENTER</div>
                        <h1 style={{ 
                            fontSize: 'clamp(3rem, 6vw, 5rem)', 
                            fontWeight: 950, 
                            letterSpacing: '-0.06em', 
                            lineHeight: 0.9, 
                            color: '#fff',
                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}>Operations Control</h1>
                        <p style={{ 
                            color: 'rgba(255,255,255,0.3)', 
                            marginTop: '20px', 
                            fontSize: '1.25rem', 
                            fontWeight: 600, 
                            maxWidth: '600px',
                            lineHeight: 1.4
                        }}>Live monitoring of your gym's elite member network.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <AdminLogoutButton />
                        <AdminQrControl gymId={gymId} />
                    </div>
                </div>
                
                <Link href="/members/new" className="glass-btn-premium" style={{ 
                    textDecoration: 'none', 
                    background: 'rgba(255,255,255,0.03)', 
                    color: '#fff', 
                    padding: '20px', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '12px',
                    width: '100%',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease'
                }}>
                    <Plus size={24} strokeWidth={3} /> <span style={{ fontWeight: 950, letterSpacing: '0.1em', fontSize: '0.9rem', textTransform: 'uppercase' }}>Initialize New Member</span>
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
            <section className="glass-card-premium" style={{ 
                position: 'relative',
                zIndex: 1,
                padding: '40px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '32px', 
                background: 'rgba(255,255,255,0.01)', 
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '40px',
                boxShadow: '0 40px 100px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Verified Activity</h2>
                    <Link href="/attendance" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, fontSize: '0.8125rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease' }} className="view-all-premium">View All Records →</Link>
                </div>

                <div className="modern-table-container" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900 }}>
                                <th style={{ padding: '0 24px' }}>Member Entity</th>
                                <th style={{ padding: '0 24px' }}>Operational Timing</th>
                                <th style={{ padding: '0 24px' }}>Verification</th>
                                <th style={{ padding: '0 24px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAttendance.length > 0 ? recentAttendance.map((record) => (
                                <tr key={record.id} style={{ background: 'rgba(255,255,255,0.015)', transition: 'all 0.3s ease' }} className="admin-row-hover">
                                    <td style={{ padding: '20px 24px', borderRadius: '20px 0 0 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.875rem' }}>
                                                {record.user?.name?.[0] || '?'}
                                            </div>
                                            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{record.user?.name || 'Unknown User'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9375rem', fontWeight: 600 }}>
                                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 950, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                                            <CheckCircle2 size={16} strokeWidth={3} /> VERIFIED SECURE
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right', borderRadius: '0 20px 20px 0' }}>
                                        <Link href={`/members/${record.userId}`} className="btn-action-premium" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none', color: '#fff', transition: 'all 0.3s ease' }}>View Profile</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.2)' }}>
                                        <p style={{ fontWeight: 700 }}>No recent operational activity recorded.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <style jsx>{`
                    .admin-row-hover:hover {
                        background: rgba(255,255,255,0.04) !important;
                        transform: scale(1.005);
                    }
                    .glass-btn-premium:hover {
                        background: rgba(255,255,255,0.08) !important;
                        transform: translateY(-4px);
                        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                        border-color: rgba(255,255,255,0.15) !important;
                    }
                    .view-all-premium:hover {
                        color: #fff !important;
                        opacity: 1;
                    }
                    .btn-action-premium:hover {
                        background: rgba(255,255,255,0.1) !important;
                        border-color: rgba(255,255,255,0.2) !important;
                    }
                `}</style>
            </section>
        </div>
    );
}
