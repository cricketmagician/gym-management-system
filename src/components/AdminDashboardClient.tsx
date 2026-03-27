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
    monthlyCollections: number;
    pendingRecovery: number;
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
    monthlyCollections,
    pendingRecovery,
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
        
        const isExpired = member.memberships[0]?.status === 'EXPIRED';
        const message = isExpired 
            ? `Hi ${member.name}! Your membership at ${gymName} has EXPIRED. To avoid interruption, please renew now.`
            : `Hi ${member.name}! Your membership at ${gymName} is expiring soon. Ready to renew and keep crushing your goals?`;
        
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div style={{ position: 'relative', minHeight: '100%' }}>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Multi-Tiered Revenue Grid */}
            <section className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                
                {/* TIER 1: CRITICAL RECOVERY (Large) */}
                <div onClick={() => setViewType('expired')} className="metric-card-tier-1" style={{ cursor: 'pointer' }}>
                  <MetricCard 
                      title="Pending Recovery" 
                      value={`₹${pendingRecovery.toLocaleString()}`} 
                      icon={<AlertCircle size={32} strokeWidth={3} />} 
                      subtitle={`${expiredCount} Lapsed Members`} 
                      brandColor="#ef4444"
                      isInteractive
                      isLarge
                  />
                </div>

                {/* TIER 2: AT RISK (Medium) */}
                <div onClick={() => setViewType('expiring')} className="metric-card-tier-2" style={{ cursor: 'pointer' }}>
                    <MetricCard 
                        title="Expiring Soon" 
                        value={expiringSoonCount} 
                        icon={<Sparkles size={24} strokeWidth={2.5} />} 
                        subtitle="Next 7 Days" 
                        brandColor="#f59e0b"
                        isInteractive
                    />
                </div>

                <div className="metric-card-tier-2">
                    <MetricCard 
                        title="Collections" 
                        value={`₹${monthlyCollections.toLocaleString()}`} 
                        icon={<TrendingUp size={24} strokeWidth={2.5} />} 
                        subtitle="Last 30 Days" 
                        brandColor="#10b981"
                    />
                </div>

                {/* TIER 3: OPERATIONS (Small/Muted) */}
                <div className="metric-card-tier-3">
                  <MetricCard 
                      title="Active Access" 
                      value={activeCount} 
                      icon={<Users size={20} strokeWidth={2.5} />} 
                      subtitle="Current population" 
                      brandColor="#94a3b8"
                  />
                </div>

                <div className="metric-card-tier-3">
                  <MetricCard 
                      title="Check-ins" 
                      value={recentAttendanceLength} 
                      icon={<Clock size={20} strokeWidth={2.5} />} 
                      subtitle="Recent activity" 
                      brandColor="#64748b"
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
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(12px)'
                }} className="modal-container-premium">
                    <div 
                        onClick={closeModal} 
                        style={{ position: 'absolute', inset: 0 }} 
                    />
                    
                    <div className="luxe-modal" style={{ 
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
                        boxShadow: '-20px 0 60px rgba(0,0,0,0.8)'
                    }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ 
                                    background: viewType === 'expiring' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                    color: viewType === 'expiring' ? '#f59e0b' : '#ef4444', 
                                    padding: '6px 12px', 
                                    borderRadius: '8px', 
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
                                        borderRadius: '16px', 
                                        padding: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', color: '#000', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.875rem' }}>
                                                {member.name[0]}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</h4>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>{member.memberships[0]?.plan.name || 'No Plan'}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {viewType === 'expiring' ? 'Expires' : 'Expired On'}
                                            </div>
                                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.8125rem' }}>
                                                {member.memberships[0] ? format(new Date(member.memberships[0].endDate), 'dd MMM yyyy') : '--'}
                                            </div>
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
                                                <MessageCircle size={12} fill="#fff" /> SEND ALERT
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.2)' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Sparkles size={48} opacity={0.5} />
                                    </div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>No members currently in this list.</p>
                                </div>
                            )}
                        </div>

                        <footer>
                            <Link 
                                href="/members" 
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}
                            >
                                VIEW FULL DIRECTORY <ArrowRight size={16} />
                            </Link>
                        </footer>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

function MetricCard({ title, value, icon, subtitle, brandColor, isInteractive = false, isLarge = false }: { title: string, value: string | number, icon: React.ReactNode, subtitle: string, brandColor: string, isInteractive?: boolean, isLarge?: boolean }) {
    return (
        <div className="metric-card-premium" style={{ 
            padding: isLarge ? '48px' : '32px', 
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: isInteractive ? 'pointer' : 'default'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                    width: isLarge ? '72px' : '56px', 
                    height: isLarge ? '72px' : '56px', 
                    borderRadius: '12px', 
                    background: `${brandColor}15`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: brandColor,
                    border: `1px solid ${brandColor}30`
                }}>
                    {icon}
                </div>
                {isInteractive && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 950, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.1)' }}>
                        RECOVER NOW →
                    </div>
                )}
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>{title}</p>
                <h3 style={{ fontSize: isLarge ? '4.5rem' : '3rem', fontWeight: 950, marginBottom: '8px', letterSpacing: '-0.06em', color: '#fff', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{subtitle}</p>
            </div>
        </div>
    );
}
