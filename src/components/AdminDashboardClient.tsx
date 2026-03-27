"use client"

import React, { useState } from 'react';
import { Users, TrendingUp, Sparkles, Clock, AlertCircle, X, MessageCircle, Calendar, ArrowRight, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Member {
    id: string;
    name: string;
    phone?: string;
    memberships: {
        status: string;
        endDate: Date | string;
        plan: {
            name: string;
        };
    }[];
}

interface AdminDashboardClientProps {
    totalMembers: number;
    activeCount: number;
    expiringSoonCount: number;
    expiredCount: number;
    recentAttendanceLength: number;
    expiringMembers: Member[];
    expiredMembers: Member[];
    gymName: string;
    gymWhatsApp: string;
}

export default function AdminDashboardClient({ 
    totalMembers, 
    activeCount, 
    expiringSoonCount, 
    expiredCount, 
    recentAttendanceLength,
    expiringMembers,
    expiredMembers,
    gymName,
    gymWhatsApp
}: AdminDashboardClientProps) {
    const [viewType, setViewType] = useState<'expired' | 'expiring' | null>(null);

    const closeModal = () => setViewType(null);

    const getWhatsAppUrl = (member: Member) => {
        const phone = (member.phone || '').replace(/\D/g, '');
        if (!phone) return '#';
        
        const message = `Hi ${member.name}! Your membership at ${gymName} is expiring soon. Ready to renew and keep crushing your goals?`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div style={{ position: 'relative', minHeight: '100%' }}>
            {/* Midnight Luxe 2.0 Refined Dashboard */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Metric Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                <MetricCard 
                    title="Total Population" 
                    value={totalMembers} 
                    icon={<Users size={24} strokeWidth={2.5} />} 
                    subtitle="Registered members" 
                    glowColor="rgba(148, 163, 184, 0.15)"
                    brandColor="#94a3b8"
                />
                <MetricCard 
                    title="Active Access" 
                    value={activeCount} 
                    icon={<TrendingUp size={24} strokeWidth={2.5} />} 
                    subtitle="Current permissions" 
                    glowColor="rgba(249, 115, 22, 0.15)"
                    brandColor="#f97316"
                />
                <div onClick={() => setViewType('expiring')} style={{ cursor: 'pointer' }}>
                    <MetricCard 
                        title="Expiring Soon" 
                        value={expiringSoonCount} 
                        icon={<Sparkles size={24} strokeWidth={2.5} />} 
                        subtitle="Next 7 days" 
                        glowColor="rgba(245, 158, 11, 0.15)"
                        brandColor="#f59e0b"
                        isInteractive
                    />
                </div>
                <MetricCard 
                    title="Recent Check-ins" 
                    value={recentAttendanceLength} 
                    icon={<Clock size={24} strokeWidth={2.5} />} 
                    subtitle="Last 24 hours" 
                    glowColor="rgba(100, 116, 139, 0.15)"
                    brandColor="#64748b"
                />
                <div onClick={() => setViewType('expired')} style={{ cursor: 'pointer' }}>
                    <MetricCard 
                        title="Expired Members" 
                        value={expiredCount} 
                        icon={<AlertCircle size={24} strokeWidth={2.5} />} 
                        subtitle="Requires attention" 
                        glowColor="rgba(234, 88, 12, 0.15)"
                        brandColor="#ea580c"
                        isInteractive
                    />
                </div>
            </section>

            {/* Cinematic Slide-over Modal */}
            {viewType && (
                <div style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    zIndex: 2000, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div 
                        onClick={closeModal} 
                        style={{ position: 'absolute', inset: 0 }} 
                    />
                    
                    <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '500px', 
                        height: '100vh', 
                        background: '#0a0a0a', 
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        boxShadow: '-20px 0 60px rgba(0,0,0,0.8)',
                        animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ 
                                    background: viewType === 'expiring' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                    color: viewType === 'expiring' ? '#f59e0b' : '#ef4444', 
                                    padding: '6px 12px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.65rem', 
                                    fontWeight: 900, 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em',
                                    marginBottom: '8px',
                                    width: 'fit-content'
                                }}>
                                    {viewType === 'expiring' ? 'Critical Retention' : 'Lapsed Accounts'}
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.03em' }}>
                                    {viewType === 'expiring' ? 'Expiring Soon' : 'Expired Members'}
                                </h2>
                            </div>
                            <button 
                                onClick={closeModal}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px', color: '#fff', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }} className="member-scroll">
                            {(viewType === 'expiring' ? expiringMembers : expiredMembers).length > 0 ? (
                                (viewType === 'expiring' ? expiringMembers : expiredMembers).map((member) => (
                                    <div key={member.id} style={{ 
                                        background: 'rgba(255,255,255,0.03)', 
                                        border: '1px solid rgba(255,255,255,0.06)', 
                                        borderRadius: '24px', 
                                        padding: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.875rem' }}>
                                                {member.name[0]}
                                            </div>
                                            <div>
                                                <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{member.name}</h4>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>{member.memberships[0]?.plan.name || 'No Plan'}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {viewType === 'expiring' ? 'Expires' : 'Expired On'}
                                            </div>
                                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.8125rem' }}>
                                                {member.memberships[0] ? format(new Date(member.memberships[0].endDate), 'dd MMM yyyy') : '--'}
                                            </div>
                                            {viewType === 'expiring' && (
                                                <a 
                                                    href={getWhatsAppUrl(member)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                        background: '#25D366', 
                                                        color: '#fff', 
                                                        padding: '6px 12px', 
                                                        borderRadius: '8px', 
                                                        fontSize: '0.7rem', 
                                                        fontWeight: 900, 
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        marginTop: '4px'
                                                    }}
                                                >
                                                    <MessageCircle size={12} fill="#fff" /> RENEW
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.2)' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Sparkles size={48} opacity={0.5} />
                                    </div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>Great news! No members are currently in this list.</p>
                                </div>
                            )}
                        </div>

                        <footer>
                            <Link 
                                href="/members" 
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}
                            >
                                VIEW FULL DIRECTORY <ArrowRight size={16} />
                            </Link>
                        </footer>
                    </div>
                    <style jsx>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideIn {
                            from { transform: translateX(100%); }
                            to { transform: translateX(0); }
                        }
                        .member-scroll::-webkit-scrollbar {
                            width: 6px;
                        }
                        .member-scroll::-webkit-scrollbar-thumb {
                            background: rgba(255,255,255,0.1);
                            border-radius: 10px;
                        }
                    `}</style>
                </div>
            )}
        </div>
        </div>
    );
}

function MetricCard({ title, value, icon, subtitle, glowColor, brandColor, isInteractive = false }: { title: string, value: string | number, icon: React.ReactNode, subtitle: string, glowColor: string, brandColor: string, isInteractive?: boolean }) {
    return (
        <div className="metric-card-premium" style={{ 
            padding: '32px', 
            borderRadius: '32px',
            background: 'rgba(255,255,255,0.01)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            cursor: isInteractive ? 'pointer' : 'default'
        }}>
            {/* Visual Backlight */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: brandColor, opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '18px', 
                    background: `${brandColor}20`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: brandColor,
                    border: `1px solid ${brandColor}40`,
                    boxShadow: `0 8px 20px ${brandColor}15`
                }}>
                    {icon}
                </div>
                {isInteractive && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.1)' }}>
                        Details →
                    </div>
                )}
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>{title}</p>
                <h3 style={{ fontSize: '3.5rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.06em', color: '#fff', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{subtitle}</p>
            </div>

            <style jsx>{`
                .metric-card-premium:hover {
                    transform: translateY(-12px) scale(1.02);
                    background: rgba(255,255,255,0.04);
                    border-color: ${brandColor}50;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${brandColor}15;
                }
            `}</style>
        </div>
    );
}
