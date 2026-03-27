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
                <div style={{ flex: 1 }}>
                    <div style={{ 
                        background: 'rgba(245,158,11,0.1)', 
                        color: '#f59e0b', 
                        padding: '10px 20px', 
                        borderRadius: '30px', 
                        fontSize: '0.7rem', 
                        fontWeight: 950, 
                        letterSpacing: '0.15em', 
                        width: 'fit-content', 
                        marginBottom: '24px',
                        border: '1px solid rgba(245,158,11,0.2)',
                        backdropFilter: 'blur(10px)'
                    }}>PULSEFIT GLOBAL COMMAND</div>
                    <h1 style={{ 
                        fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', 
                        fontWeight: 950, 
                        letterSpacing: '-0.06em', 
                        lineHeight: 0.85, 
                        color: '#fff',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}>Universal<br/><span style={{ color: 'rgba(255,255,255,0.6)' }}>Oversight</span></h1>
                    <p style={{ 
                        color: 'rgba(255,255,255,0.3)', 
                        marginTop: '32px', 
                        fontSize: '1.4rem', 
                        fontWeight: 600, 
                        maxWidth: '700px',
                        lineHeight: 1.4,
                        letterSpacing: '-0.01em'
                    }}>
                        Orchestrating <span style={{ color: '#fff', fontWeight: 900 }}>{totalGyms} elite fitness tenants</span> across the sovereign global network.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px', paddingTop: '20px' }}>
                    <Link href="/api/auth/signout" style={{ 
                        padding: '16px 32px', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        borderRadius: '20px', 
                        color: 'rgba(255,255,255,0.6)', 
                        textDecoration: 'none', 
                        fontWeight: 800, 
                        fontSize: '0.8125rem', 
                        backdropFilter: 'blur(20px)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.3s ease'
                    }} className="logout-btn-premium">Global Logout</Link>
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
            
            <div style={{ color: glow, marginBottom: '28px', background: `${glow}15`, width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${glow}30`, boxShadow: `0 8px 20px ${glow}10` }}>
                {icon}
            </div>
            
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>{title}</div>
            <div style={{ fontSize: '4rem', fontWeight: 950, letterSpacing: '-0.06em', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
            
            <style jsx>{`
                .stats-card-premium:hover {
                    transform: translateY(-12px) scale(1.02);
                    background: rgba(255,255,255,0.04);
                    border-color: ${glow}50;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${glow}15;
                }
                .logout-btn-premium:hover {
                    background: rgba(239, 68, 68, 0.1) !important;
                    border-color: rgba(239, 68, 68, 0.2) !important;
                    color: #ef4444 !important;
                    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.1);
                }
            `}</style>
        </div>
    );
}
