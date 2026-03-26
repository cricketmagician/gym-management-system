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
            {/* Holographic Watermark Background */}
            <div className="watermark-text" style={{ 
                position: 'fixed', 
                top: '10vh', 
                left: '20%', 
                fontSize: '15rem', 
                opacity: 0.03, 
                pointerEvents: 'none', 
                zIndex: 0,
                fontWeight: 950,
                lineHeight: 0.8
            }}>
                COMMAND<br />CENTER
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Metric Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <MetricCard 
                    title="Total Population" 
                    value={totalMembers} 
                    icon={<Users size={22} />} 
                    subtitle="Registered members" 
                    glowColor="rgba(45, 212, 191, 0.2)"
                />
                <MetricCard 
                    title="Active Access" 
                    value={activeCount} 
                    icon={<TrendingUp size={22} />} 
                    subtitle="Current permissions" 
                    glowColor="rgba(56, 189, 248, 0.2)"
                />
                <div onClick={() => setViewType('expiring')} style={{ cursor: 'pointer' }}>
                    <MetricCard 
                        title="Expiring Soon" 
                        value={expiringSoonCount} 
                        icon={<Sparkles size={22} />} 
                        subtitle="Next 7 days" 
                        glowColor="rgba(245, 158, 11, 0.2)"
                        isInteractive
                    />
                </div>
                <MetricCard 
                    title="Recent Check-ins" 
                    value={recentAttendanceLength} 
                    icon={<Clock size={22} />} 
                    subtitle="Last 24 hours" 
                    glowColor="rgba(251, 146, 60, 0.2)"
                />
                <div onClick={() => setViewType('expired')} style={{ cursor: 'pointer' }}>
                    <MetricCard 
                        title="Expired Members" 
                        value={expiredCount} 
                        icon={<AlertCircle size={22} />} 
                        subtitle="Requires attention" 
                        glowColor="rgba(239, 68, 68, 0.2)"
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

function MetricCard({ title, value, icon, subtitle, glowColor, isInteractive = false }: { title: string, value: string | number, icon: React.ReactNode, subtitle: string, glowColor: string, isInteractive?: boolean }) {
    const brandColor = glowColor.replace('0.2', '1');
    return (
        <div className="card scale-hover" style={{ 
            padding: '24px', 
            borderRadius: '24px',
            background: 'var(--surface-color)',
            border: isInteractive ? `2px solid ${brandColor}` : '1px solid var(--border-color)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: `0 20px 40px -20px ${glowColor.replace('0.2', '0.5')}, 0 0 15px -5px ${glowColor.replace('0.2', '0.1')}`,
            cursor: isInteractive ? 'pointer' : 'default'
        }}>
            <div style={{ 
                position: 'absolute', 
                top: '-20px', 
                right: '-20px', 
                width: '120px', 
                height: '120px', 
                background: glowColor, 
                borderRadius: '50%', 
                filter: 'blur(35px)',
                opacity: 0.7
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '14px', 
                    background: glowColor, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: brandColor 
                }}>
                    {icon}
                </div>
                {isInteractive && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Details →
                    </div>
                )}
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>{title}</p>
                <h3 style={{ fontSize: '2.75rem', fontWeight: 950, marginBottom: '4px', letterSpacing: '-0.05em', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, opacity: 0.7 }}>{subtitle}</p>
            </div>
        </div>
    );
}
