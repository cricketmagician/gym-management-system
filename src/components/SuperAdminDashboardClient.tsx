"use client";

import React from 'react';
import { Users, Building2, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import SuperAdminClient from '@/components/SuperAdminClient';

interface Props {
    totalGyms: number;
    totalUsers: number;
    totalAdmins: number;
    gyms: any[];
}

export default function SuperAdminDashboardClient({ totalGyms, totalUsers, totalAdmins, gyms }: Props) {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '40px', 
            padding: '40px', 
            background: '#000', 
            minHeight: '100vh', 
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Cinematic Background Image Overlay */}
            <div style={{ 
                position: 'fixed', 
                inset: 0, 
                backgroundImage: 'url("file:///Users/nihalkumar/.gemini/antigravity/brain/84c8b222-7f07-469d-8238-b883d3f2b978/premium_gym_cinematic_dark_v2_1774551927440.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.15,
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            {/* Dynamic Watermark */}
            <div style={{ 
                position: 'fixed', 
                bottom: '10%', 
                left: '-5%', 
                fontSize: '20vw', 
                fontWeight: 950, 
                color: 'rgba(255,255,255,0.02)', 
                pointerEvents: 'none', 
                letterSpacing: '-0.05em',
                lineHeight: 0.8,
                zIndex: 0,
                transform: 'rotate(-5deg)'
            }}>
                PULSEFIT<br/>GLOBAL
            </div>

            <header style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#000', padding: '8px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', width: 'fit-content', marginBottom: '16px' }}>PULSEFIT GLOBAL COMMAND</div>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.06em', lineHeight: 0.9 }}>Universal Oversight</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '20px', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px' }}>
                        Orchestrating <span style={{ color: '#fff', fontWeight: 800 }}>{totalGyms} elite fitness tenants</span> across the sovereign network.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link href="/api/auth/signout" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '0.875rem', backdropFilter: 'blur(10px)' }} className="scale-hover">Global Logout</Link>
                </div>
            </header>

            {/* Global Stats Grid */}
            <section style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <StatsCard title="Total Gyms" value={totalGyms} icon={<Building2 size={24} />} glow="#f59e0b" />
                <StatsCard title="Global Members" value={totalUsers} icon={<Users size={24} />} glow="#3b82f6" />
                <StatsCard title="System Admins" value={totalAdmins} icon={<ShieldCheck size={24} />} glow="#10b981" />
                <StatsCard title="System Status" value="Healthy" icon={<TrendingUp size={24} />} glow="#8b5cf6" />
            </section>

            {/* Gym Management Section */}
            <section style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '40px', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                <SuperAdminClient initialGyms={gyms} />
            </section>
        </div>
    );
}

function StatsCard({ title, value, icon, glow }: { title: string, value: string | number, icon: React.ReactNode, glow: string }) {
    return (
        <div style={{ 
            padding: '40px', 
            borderRadius: '32px', 
            background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`, 
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)'
        }} className="stats-card-premium">
            {/* Visual Backlight */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: glow, opacity: 0.15, filter: 'blur(50px)', borderRadius: '50%' }}></div>
            
            <div style={{ color: glow, marginBottom: '24px', background: `${glow}10`, width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${glow}20` }}>
                {icon}
            </div>
            
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>{title}</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.05em', lineHeight: 1 }}>{value}</div>
            
            <style jsx>{`
                .stats-card-premium:hover {
                    transform: translateY(-8px);
                    background: rgba(255,255,255,0.05);
                    border-color: ${glow}40;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${glow}10;
                }
            `}</style>
        </div>
    );
}
