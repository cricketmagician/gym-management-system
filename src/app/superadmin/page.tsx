import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Users, Building2, TrendingUp, ShieldCheck, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px', background: '#000', minHeight: '100vh', color: '#fff' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#000', padding: '8px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', width: 'fit-content', marginBottom: '16px' }}>PULSEFIT GLOBAL COMMAND</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1 }}>Universal Oversight</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1.125rem', opacity: 0.8 }}>Managing {totalGyms} active fitness tenants across the network.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link href="/api/auth/signout" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>Global Logout</Link>
                </div>
            </header>

            {/* Global Stats Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <StatsCard title="Total Gyms" value={totalGyms} icon={<Building2 size={24} />} glow="#f59e0b" />
                <StatsCard title="Global Members" value={totalUsers} icon={<Users size={24} />} glow="#3b82f6" />
                <StatsCard title="System Admins" value={totalAdmins} icon={<ShieldCheck size={24} />} glow="#10b981" />
                <StatsCard title="System Status" value="Healthy" icon={<TrendingUp size={24} />} glow="#8b5cf6" />
            </section>

            {/* Gym Management Section */}
            <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Active Gym Tenants</h2>
                    <button style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Register New Gym
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                <th style={{ padding: '0 24px' }}>Gym Entity</th>
                                <th style={{ padding: '0 24px' }}>Admin Score</th>
                                <th style={{ padding: '0 24px' }}>Status</th>
                                <th style={{ padding: '0 24px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gyms.map(gym => (
                                <tr key={gym.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'background 0.3s' }}>
                                    <td style={{ padding: '20px 24px', borderRadius: '16px 0 0 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', background: gym.primaryColor || '#333', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                                                {gym.name?.[0] || 'G'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{gym.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SLUG: {gym.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontWeight: 700 }}>{gym._count.users} Members</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{gym._count.memberships} Active Plans</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'inline-flex', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>ACTIVE</div>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                        <button style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Manage Audit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function StatsCard({ title, value, icon, glow }: { title: string, value: string | number, icon: React.ReactNode, glow: string }) {
    return (
        <div style={{ 
            padding: '32px', 
            borderRadius: '24px', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: glow, opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%' }}></div>
            <div style={{ color: glow, marginBottom: '20px' }}>{icon}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-0.04em' }}>{value}</div>
        </div>
    );
}
