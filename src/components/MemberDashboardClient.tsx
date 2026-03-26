"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Dumbbell, ArrowRight, Zap, Trophy, TrendingUp, Sparkles, LogOut, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { signOut } from 'next-auth/react';
import { getDirectImageUrl } from '@/lib/image-utils';

interface MemberDashboardClientProps {
    user: any;
    activeMembership: any;
    daysLeft: number;
    thisWeekAttendance: number;
    workoutCount: number;
    trainers: any[];
}

export default function MemberDashboardClient({ 
    user, 
    activeMembership, 
    daysLeft, 
    thisWeekAttendance, 
    workoutCount, 
    trainers 
}: MemberDashboardClientProps) {
    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

    const handleWhatsApp = () => {
        const adminPhone = (user.gym?.whatsappNumber || '').replace(/\D/g, '');
        const message = `Hi ${user.gym?.name || 'PulseFit'}! I want to renew my membership.\n\nName: ${user.name}\nID: #${user.id.slice(-8).toUpperCase()}\nPlan: ${activeMembership?.plan.name || 'N/A'}`;
        window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
        setIsRenewModalOpen(false);
    };

    const orangeGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';

    return (
        <div style={{ position: 'relative' }}>
            {/* Premium Renewal Popup */}
            {isRenewModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div 
                        onClick={() => setIsRenewModalOpen(false)} 
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} 
                    />
                    <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '400px', 
                        background: '#fff', 
                        borderRadius: '32px', 
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        color: '#000'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Renew Membership</h2>
                                <p style={{ color: '#666', fontSize: '0.9375rem', marginTop: '4px', fontWeight: 500 }}>Ready to crush more goals?</p>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Current Plan</span>
                                <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>{activeMembership?.plan.name || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Member ID</span>
                                <span style={{ fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.05em' }}>#{user.id.slice(-8).toUpperCase()}</span>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: '#64748b', textAlign: 'center', lineHeight: 1.5, fontWeight: 500 }}>
                            You will be redirected to WhatsApp to contact the administrator for payment details and renewal confirmation.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button 
                                onClick={handleWhatsApp}
                                style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                            >
                                CONTINUE TO WHATSAPP <ArrowRight size={18} />
                            </button>
                            <button 
                                onClick={() => setIsRenewModalOpen(false)}
                                style={{ width: '100%', padding: '16px', background: 'transparent', color: '#64748b', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                            >
                                Not now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 0 110px 0', position: 'relative', zIndex: 1 }} className="member-dashboard">
                <style jsx>{`
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.9) translateY(20px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>

                {/* Full-Bleed Premium Brand Banner */}
                <header style={{ 
                    width: '100%', 
                    height: '240px', 
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#000'
                }}>
                    <img 
                        src={getDirectImageUrl(user.gym?.bannerUrl) || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"} 
                        alt="Gym Banner" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))' }} />
                    <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ padding: '6px', background: 'var(--brand-primary)', borderRadius: '8px' }}>
                                <Zap size={16} color="#fff" />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Member Portal</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{user.gym?.name || 'PulseFit'}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', fontWeight: 500, marginTop: '4px' }}>Welcome back, {user.name.split(' ')[0]}!</p>
                    </div>
                </header>

                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {/* Membership Card - Premium Amber Orange */}
                        <div className="card" style={{ 
                            padding: '20px', 
                            background: orangeGradient, 
                            color: '#fff', 
                            borderRadius: '24px', 
                            border: 'none',
                            boxShadow: '0 15px 30px rgba(245, 158, 11, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Trophy size={18} /> Membership Status
                                </h3>
                                <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 800 }}>ACTIVE</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>{daysLeft}</h2>
                                <p style={{ fontSize: '0.875rem', fontWeight: 700, opacity: 0.8 }}>DAYS LEFT</p>
                            </div>
        
                            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Current Plan</p>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>{activeMembership?.plan.name || 'No Active Plan'}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Valid Until</p>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>{activeMembership ? format(new Date(activeMembership.endDate), 'dd MMM yyyy') : '--'}</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)', padding: '10px 16px', borderRadius: '16px', margin: '0 -4px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <p style={{ fontSize: '0.5rem', fontWeight: 700, opacity: 0.5 }}>MEMBER ID</p>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800 }}>#{user.id.slice(-8).toUpperCase()}</p>
                                </div>
                                <button 
                                    onClick={() => setIsRenewModalOpen(true)}
                                    style={{ background: '#fff', color: '#000', padding: '8px 14px', borderRadius: '12px', border: 'none', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                >
                                    RENEW NOW <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
        
                        {/* Quick Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Link href="/member/checkin" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', color: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 10px 20px rgba(45, 212, 191, 0.2)' }}>
                                    <div style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px', width: 'fit-content' }}>
                                        <QrCode size={20} color="#fff" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: 900, letterSpacing: '-0.02em' }}>QUICK SCAN</h4>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Check-in Now</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/member/attendance" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                                    <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', width: 'fit-content' }}>
                                        <Calendar size={20} color="#f59e0b" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{thisWeekAttendance}</h4>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>This Week</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
        
                    {/* Motivation Section */}
                    <div style={{ 
                        padding: '24px', 
                        background: 'rgba(245, 158, 11, 0.05)', 
                        border: '1px dashed #f59e0b', 
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{ padding: '12px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                            <TrendingUp size={24} color="#f59e0b" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Consistency is Key!</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>You've been active for {thisWeekAttendance} {thisWeekAttendance === 1 ? 'day' : 'days'} this week. Keep hitting those goals!</p>
                        </div>
                    </div>
        
                    {/* Trainers Section */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Certified Trainers</h3>
                            <Link href="/member/trainers" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f59e0b', textDecoration: 'none' }}>View All</Link>
                        </div>
                        <div className="horizontal-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
                            {trainers.map((trainer) => (
                                <Link key={trainer.id} href={`/member/trainers/${trainer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ 
                                        minWidth: '280px', 
                                        padding: '24px', 
                                        background: '#fff', 
                                        border: '1px solid rgba(0,0,0,0.04)', 
                                        borderRadius: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }} className="card-hover-bright">
                                        <div style={{ position: 'relative' }}>
                                            <img src={trainer.photoUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=fde68a&color=b45309`} alt={trainer.name} style={{ width: '72px', height: '72px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                                            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', background: '#2dd4bf', border: '3px solid #fff', borderRadius: '50%' }}></div>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '1.0625rem', fontWeight: 900, marginBottom: '4px', letterSpacing: '-0.02em' }}>{trainer.name}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{trainer.specialization}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
