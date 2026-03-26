import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Users, Building2, TrendingUp, ShieldCheck, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import SuperAdminClient from '@/components/SuperAdminClient';

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
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '12px', fontSize: '1.125rem', fontWeight: 500 }}>Managing {totalGyms} active fitness tenants across the network.</p>
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
                <SuperAdminClient initialGyms={gyms.map(g => ({
                    id: g.id,
                    name: g.name,
                    slug: g.slug,
                    primaryColor: g.primaryColor,
                    _count: g._count
                }))} />
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
