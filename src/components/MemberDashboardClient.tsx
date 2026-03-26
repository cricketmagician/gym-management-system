"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Dumbbell, ArrowRight, Zap, Trophy, TrendingUp, Sparkles, LogOut, QrCode, Camera, Timer, Activity, CheckCircle2, MapPin, User as UserIcon, Volume2, Smartphone, Share, PlusSquare, Wifi, Phone, MessageSquare, Instagram, Copy } from 'lucide-react';
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
    announcements: any[];
}

function MetricCard({ 
    title, 
    value, 
    unit, 
    icon, 
    color, 
    href,
    onClick,
    variant = 'default',
    compact = false
}: { 
    title: string, 
    value: number | string, 
    unit: string, 
    icon: React.ReactNode, 
    color: string, 
    href?: string,
    onClick?: () => void,
    variant?: 'default' | 'black' | 'orange' | 'white',
    compact?: boolean
}) {
    const isBlack = variant === 'black';
    const isOrange = variant === 'orange';
    const isWhite = variant === 'white';

    const cardContent = (
        <div className="card" style={{ 
            padding: compact ? '16px 20px' : '24px', 
            borderRadius: '24px', 
            background: isWhite ? '#ffffff' : (isOrange ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : (isBlack ? '#1a1a1a' : 'var(--surface-color)')), 
            border: (isOrange || isWhite) ? 'none' : (isBlack ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-color)'),
            display: 'flex',
            flexDirection: 'column',
            gap: compact ? '8px' : '12px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            cursor: (href || onClick) ? 'pointer' : 'default',
            boxShadow: isWhite
                ? '0 10px 40px rgba(255,255,255,0.4)'
                : (isOrange 
                    ? '0 10px 30px rgba(234, 88, 12, 0.3)' 
                    : (isBlack ? '0 10px 30px rgba(0,0,0,0.3)' : `0 10px 30px -10px rgba(0,0,0,0.1), 0 0 20px -5px ${color}20`))
        }}
        onClick={onClick}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: isWhite ? '#666' : (isOrange ? '#fff' : color) }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: (isOrange || isWhite) ? 0.9 : 0.8 }}>{title}</span>
                <div style={{ padding: compact ? '4px' : '8px', background: isWhite ? '#f3f4f6' : (isOrange ? 'rgba(255,255,255,0.2)' : (isBlack ? 'rgba(255,255,255,0.1)' : `${color}10`)), borderRadius: '10px' }}>
                    {compact ? React.cloneElement(icon as any, { size: 16 }) : icon}
                </div>
            </div>
            <div>
                <h4 style={{ 
                    fontSize: compact ? '1.25rem' : ((typeof value === 'string' && value.length > 8) ? '1.5rem' : '2rem'), 
                    fontWeight: 900, 
                    color: isWhite ? '#000' : ((isBlack || isOrange) ? '#fff' : 'var(--text-primary)'), 
                    letterSpacing: '-0.02em', 
                    lineHeight: 1 
                }}>{value}</h4>
                <p style={{ fontSize: '0.75rem', color: isWhite ? '#666' : (isOrange ? 'rgba(255,255,255,0.8)' : (isBlack ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)')), fontWeight: 600, marginTop: '4px' }}>{unit}</p>
            </div>
            {/* Glossy overlay effect for interactivity */}
            {(href || onClick) && <div className="card-gloss" />}
        </div>
    );

    if (href) {
        return (
            <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="scale-hover">
                    {cardContent}
                </div>
            </Link>
        );
    }

    return cardContent;
}

export default function MemberDashboardClient({ 
    user, 
    activeMembership, 
    daysLeft, 
    thisWeekAttendance, 
    workoutCount, 
    trainers,
    announcements
}: MemberDashboardClientProps) {
    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
    const [isA2HSOpen, setIsA2HSOpen] = useState(false);
    const [isQuickConnectOpen, setIsQuickConnectOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(deferredPrompt);
                setDeferredPrompt(null);
            }
        } else {
            setIsA2HSOpen(true);
        }
    };

    const handleCopyWifi = async () => {
        if (user.gym?.wifiPassword) {
            await navigator.clipboard.writeText(user.gym.wifiPassword);
            alert(`WiFi Password copied! SSID: ${user.gym.wifiSsid || 'PulseFit'}`);
        } else {
            alert("No WiFi details configured yet.");
        }
    };

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

            {/* Add to Home Screen Modal */}
            {isA2HSOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div 
                        onClick={() => setIsA2HSOpen(false)} 
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} 
                    />
                    <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '420px', 
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
                            <div style={{ width: '64px', height: '64px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Install PulseFit App</h2>
                                <p style={{ color: '#666', fontSize: '0.9375rem', marginTop: '4px', fontWeight: 600 }}>Get the premium app experience!</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: '32px', height: '32px', background: '#000', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Share size={16} />
                                </div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>1. Tap the <span style={{ fontWeight: 800 }}>'Share'</span> button in your browser.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: '32px', height: '32px', background: '#000', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <PlusSquare size={16} />
                                </div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>2. Scroll down and tap <span style={{ fontWeight: 800 }}>'Add to Home Screen'</span>.</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsA2HSOpen(false)}
                            style={{ width: '100%', padding: '18px', background: '#000', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        >
                            UNDERSTOOD
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 0 110px 0', position: 'relative', zIndex: 1 }} className="member-dashboard">
                {/* Global Watermark handled in layout.tsx */}

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
                    <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', zIndex: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ padding: '4px', background: 'var(--brand-primary)', borderRadius: '6px' }}>
                                <Zap size={14} color="#fff" />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.9 }}>Member Portal</span>
                        </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '28px', left: '24px', right: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.2, opacity: 0.75 }}>{user.gym?.name || 'PulseFit'}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6 }}>
                                <MapPin size={12} color="#fff" />
                                <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#fff' }}>{user.gym?.locationDesc || 'Facility Location'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Top Action Row: Greeting & Quick Scan */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1.1fr 0.9fr', 
                        gap: '12px', 
                        marginTop: '0px',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        {/* Member Welcome (Compact) */}
                        <div className="glass-card" style={{ 
                            padding: '16px 20px', 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            textAlign: 'left',
                            gap: '4px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                        }}>
                            <h2 className="font-premium" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                                Hi <span style={{ textTransform: 'uppercase' }}>{user.name}</span>,
                            </h2>
                            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', opacity: 0.8, lineHeight: 1.2 }}>Make every workout count.</p>
                        </div>

                        {/* Quick Scan (Side Tile) */}
                        <Link href="/member/checkin" style={{ textDecoration: 'none' }}>
                            <div className="glass-card" style={{ 
                                padding: '16px', 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                height: '100%',
                                background: 'rgba(45, 212, 191, 0.1)',
                                borderColor: 'rgba(45, 212, 191, 0.2)',
                                boxShadow: '0 8px 24px rgba(45, 212, 191, 0.1)'
                            }}>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    background: '#2dd4bf', 
                                    color: '#fff', 
                                    borderRadius: '12px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <QrCode size={22} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>SCAN</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.6rem', fontWeight: 700 }}>CHECK-IN</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {/* Membership Card - Premium Amber Orange / Arctic Frozen */}
                        {(() => {
                            const isFrozen = activeMembership?.status === 'FROZEN';
                            const cardBackground = isFrozen 
                                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                                : orangeGradient;
                            const accentColor = isFrozen ? '#38bdf8' : '#fff';
                            const shadowColor = isFrozen ? 'rgba(56, 189, 248, 0.1)' : 'rgba(245, 158, 11, 0.2)';

                            return (
                                <div className="card" style={{ 
                                    padding: '24px', 
                                    background: cardBackground, 
                                    color: '#fff', 
                                    borderRadius: '24px', 
                                    border: isFrozen ? '1px solid rgba(56, 189, 248, 0.2)' : 'none',
                                    boxShadow: `0 15px 40px ${shadowColor}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {isFrozen && (
                                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: '#38bdf8', opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%' }} />
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {isFrozen ? <Timer size={18} className="text-sky-400" /> : <Trophy size={18} />} 
                                            Membership Status
                                        </h3>
                                        <span style={{ padding: '6px 12px', background: isFrozen ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.2)', color: isFrozen ? '#38bdf8' : '#fff', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.05em' }}>
                                            {activeMembership?.status || 'NO PLAN'}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <h2 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.05em', lineHeight: 1, color: accentColor }}>
                                            {isFrozen ? 'PAUSED' : daysLeft}
                                        </h2>
                                        {!isFrozen && <p style={{ fontSize: '0.875rem', fontWeight: 700, opacity: 0.8 }}>DAYS LEFT</p>}
                                    </div>
                
                                    <div style={{ paddingTop: '16px', borderTop: `1px solid ${isFrozen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)'}`, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</p>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 850 }}>{activeMembership?.plan.name || 'No Active Plan'}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {isFrozen ? 'Resume Date' : 'Valid Until'}
                                            </p>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 850, color: isFrozen ? '#38bdf8' : '#fff' }}>
                                                {isFrozen 
                                                    ? (activeMembership.expectedResumeDate ? format(new Date(activeMembership.expectedResumeDate), 'dd MMM yyyy') : 'TBD') 
                                                    : (activeMembership ? format(new Date(activeMembership.endDate), 'dd MMM yyyy') : '--')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '12px 18px', borderRadius: '18px', margin: '0 -4px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <p style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.5, letterSpacing: '0.05em' }}>MEMBER ID</p>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.02em' }}>#{user.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        {!isFrozen && (
                                            <button 
                                                onClick={() => setIsRenewModalOpen(true)}
                                                style={{ background: '#fff', color: '#000', padding: '10px 16px', borderRadius: '14px', border: 'none', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                                className="scale-hover"
                                            >
                                                RENEW NOW <ArrowRight size={16} />
                                            </button>
                                        )}
                                        {isFrozen && (
                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Sparkles size={14} /> FROZEN STATUS
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
        
                        {/* Quick Scan Entry moved to top row */}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <MetricCard 
                            title="Attendance" 
                            value={thisWeekAttendance} 
                            unit="Days this week" 
                            icon={<Timer size={18} />} 
                            color="#2dd4bf" 
                            href="/member/attendance" 
                            variant="black"
                        />
                        <MetricCard 
                            title="Workout Session" 
                            value={workoutCount} 
                            unit="Sessions" 
                            icon={<Activity size={18} />} 
                            color="#fb923c" 
                            href="/member/workouts" 
                        />

                        {/* Row 2: Left column with 2 stacked compact cards, Right column with Quick Connect */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <MetricCard 
                                title="App Experience" 
                                value="Get App" 
                                unit="Setup" 
                                icon={<Smartphone />} 
                                color="#a78bfa" 
                                onClick={handleInstall}
                                variant="white"
                                compact={true}
                            />
                            <MetricCard 
                                title="Profile" 
                                value="Share" 
                                unit="Invite" 
                                icon={<Share />} 
                                color="#2dd4bf" 
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'PulseFit Gym',
                                            text: `Join me at ${user.gym?.name || 'PulseFit Gym'}!`,
                                            url: window.location.origin
                                        });
                                    } else {
                                        alert("Share link copied!");
                                        navigator.clipboard.writeText(window.location.origin);
                                    }
                                }}
                                variant="black"
                                compact={true}
                            />
                        </div>
                        
                        <MetricCard 
                            title="Gym Access" 
                            value="Quick Connect" 
                            unit="Wifi, WhatsApp & More" 
                            icon={<Zap size={20} />} 
                            color="#fff" 
                            onClick={() => setIsQuickConnectOpen(true)}
                            variant="orange"
                        />
                    </div>

                    <style jsx>{`
                        @keyframes popIn {
                            from { opacity: 0; transform: scale(0.9) translateY(20px); }
                            to { opacity: 1; transform: scale(1) translateY(0); }
                        }
                        .scale-hover {
                            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                        }
                        .scale-hover:hover {
                            transform: scale(1.02);
                        }
                        .card-gloss {
                            position: absolute;
                            inset: 0;
                            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
                            pointer-events: none;
                        }
                        .trainer-card:hover .trainer-img {
                            transform: scale(1.1);
                        }
                        .marquee-content {
                            display: flex;
                            animation: marquee 30s linear infinite;
                        }
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .marquee-container:hover .marquee-content {
                            animation-play-state: paused;
                        }
                        @keyframes pulse-amber {
                            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); opacity: 1; }
                            70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); opacity: 0.5; }
                            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); opacity: 1; }
                        }
                        @media (max-width: 640px) {
                            div[style*="grid-template-columns: repeat(4, 1fr)"] {
                                grid-template-columns: repeat(2, 1fr) !important;
                                gap: 12px !important;
                            }
                            div[style*="grid-column: span 2"] {
                                grid-column: span 2 !important;
                            }
                            div[style*="grid-column: span 1"] {
                                grid-column: span 1 !important;
                            }
                        }
                    `}</style>
        
                    {/* Motivation Section */}
                    <div style={{ 
                        padding: '24px', 
                        background: 'rgba(245, 158, 11, 0.05)', 
                        border: '1px dashed rgba(245, 158, 11, 0.3)', 
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{ padding: '12px', background: 'var(--surface-color)', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={24} color="#f59e0b" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Consistency is Key!</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', opacity: 0.8 }}>You've been active for {thisWeekAttendance} {thisWeekAttendance === 1 ? 'day' : 'days'} this week. Keep hitting those goals!</p>
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
                                    <div className="trainer-card" style={{ 
                                        minWidth: '200px', 
                                        height: '280px',
                                        position: 'relative',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border-color)',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                        cursor: 'pointer'
                                    }}>
                                        {/* Background Image */}
                                        <img 
                                            src={getDirectImageUrl(trainer.photoUrl) || `https://ui-avatars.com/api/?name=${trainer.name}&background=000&color=fff&size=512`} 
                                            alt={trainer.name} 
                                            className="trainer-img"
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover',
                                                borderRadius: '24px', // Double down on rounding for the image itself
                                                transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' 
                                            }} 
                                        />
                                        
                                        {/* Gradient Overlay */}
                                        <div style={{ 
                                            position: 'absolute', 
                                            inset: 0, 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)' 
                                        }} />

                                        {/* Activity/Online Indicator Removed as requested */}

                                        {/* Trainer Details Overlay */}
                                        <div style={{ 
                                            position: 'absolute', 
                                            bottom: 0, 
                                            left: 0, 
                                            right: 0, 
                                            padding: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px'
                                        }}>
                                            <p style={{ 
                                                fontSize: '1.125rem', 
                                                fontWeight: 900, 
                                                color: '#fff', 
                                                letterSpacing: '-0.02em', 
                                                lineHeight: 1.2 
                                            }}>{trainer.name}</p>
                                            <span style={{ 
                                                fontSize: '0.65rem', 
                                                color: '#f59e0b', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '0.05em',
                                                background: 'rgba(245, 158, 11, 0.2)',
                                                width: 'fit-content',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                backdropFilter: 'blur(4px)'
                                            }}>{trainer.specialization}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Announcement Marquee Section - Midnight Luxe Overhaul */}
                    {announcements && announcements.length > 0 && (
                        <section style={{ marginTop: '0px', marginBottom: '8px' }}>
                            <div style={{ 
                                background: 'rgba(0,0,0,0.4)', 
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '14px',
                                padding: '14px 0',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{ 
                                    paddingLeft: '24px', 
                                    paddingRight: '16px', 
                                    borderRight: '1px solid rgba(255,255,255,0.1)',
                                    color: '#f59e0b',
                                    zIndex: 2,
                                    background: 'rgba(8, 8, 8, 0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <div className="pulse-amber" style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }} />
                                    <span style={{ fontSize: '0.65rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.9 }}>Broadcast</span>
                                </div>
                                
                                <div className="marquee-container" style={{ flex: 1, whiteSpace: 'nowrap', display: 'flex' }}>
                                    <div className="marquee-content" style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
                                        {announcements.map((a: any) => (
                                            <span key={a.id} style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.01em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Sparkles size={14} className="text-amber-500 opacity-50" />
                                                {a.content}
                                            </span>
                                        ))}
                                        {/* Duplicate for seamless scroll */}
                                        {announcements.map((a: any) => (
                                            <span key={`${a.id}-dup`} style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.01em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Sparkles size={14} className="text-amber-500 opacity-50" />
                                                {a.content}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
                
                {/* Quick Connect Modal */}
                {isQuickConnectOpen && (
                    <div style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        background: 'rgba(0,0,0,0.85)', 
                        backdropFilter: 'blur(20px)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        zIndex: 1000, 
                        padding: '24px' 
                    }} onClick={() => setIsQuickConnectOpen(false)}>
                        <div style={{ 
                            background: '#0a0a0a', 
                            width: '100%', 
                            maxWidth: '400px', 
                            borderRadius: '32px', 
                            padding: '32px', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '32px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: '8px', color: '#fff' }}>GYM CONNECT</h3>
                                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Get instant access to facility resources.</p>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div onClick={handleCopyWifi} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }} className="scale-hover">
                                    <span style={{ padding: '12px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '16px' }}>
                                        <Wifi size={24} color="#2dd4bf" />
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}>GYM WIFI</span>
                                </div>
                                
                                <a href={`tel:${(user.gym?.whatsappNumber || '').replace(/\s/g, '')}`} style={{ textDecoration: 'none', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)' }} className="scale-hover">
                                    <span style={{ padding: '12px', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '16px' }}>
                                        <Phone size={24} color="#fb923c" />
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}>CALL NOW</span>
                                </a>
                                
                                <a href={`https://wa.me/${(user.gym?.whatsappNumber || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)' }} className="scale-hover">
                                    <span style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '16px' }}>
                                        <MessageSquare size={24} color="#22c55e" />
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}>WHATSAPP</span>
                                </a>
                                
                                <a href={user.gym?.instagramLink || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)' }} className="scale-hover">
                                    <span style={{ padding: '12px', background: 'rgba(225, 48, 108, 0.1)', borderRadius: '16px' }}>
                                        <Instagram size={24} color="#e1306c" />
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}>INSTAGRAM</span>
                                </a>
                            </div>
                            
                            <button onClick={() => setIsQuickConnectOpen(false)} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', borderRadius: '18px', border: 'none', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer' }}>
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
