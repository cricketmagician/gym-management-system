import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, CreditCard, Activity, Phone, Mail, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import FreezeButton from './FreezeButton';
import ActivateButton from './ActivateButton';
import RenewButton from './RenewButton';
import EditMemberModal from './EditMemberModal';
import { formatMemberDate, formatCheckinTime } from '@/lib/date-utils';
import WhatsAppReminder from './WhatsAppReminder';

export default async function MemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return <div style={{ padding: '48px', textAlign: 'center' }}>Unauthorized</div>;

    const user = await prisma.user.findFirst({
        where: { id: id, gymId: session.user.gymId },
        include: {
            memberships: {
                include: { plan: true },
                orderBy: { endDate: 'desc' }
            },
            attendances: {
                orderBy: { timestamp: 'desc' },
                take: 10
            },
            gym: true
        }
    });

    if (!user) {
        notFound();
    }

    const currentMembership = user.memberships[0];
    const isAdmin = session.user.role === 'ADMIN';

    return (
        <div className="member-detail-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
            {/* Premium Header */}
            <header style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Link href="/members" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                    <ArrowLeft size={16} /> Back to Members
                </Link>
                
                <div className="profile-hero" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#000', borderRadius: '32px', overflow: 'hidden', color: '#fff' }}>
                    {/* Background Glow */}
                    <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '400px', height: '400px', background: 'rgba(251, 191, 36, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ShieldCheck size={14} color="#fbbf24" />
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium Member</span>
                            </div>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: '8px', wordBreak: 'break-word' }}>
                            {user.name.toUpperCase()}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontWeight: 500 }}>ID: #{user.id.slice(-8).toUpperCase()}</p>
                    </div>
 
                    <div style={{ position: 'relative', zIndex: 1, alignSelf: 'flex-start' }}>
                        <EditMemberModal user={user as any} />
                    </div>
                </div>
            </header>
 
            <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Membership Card - Premium Orange */}
                    <div className="membership-status-card" style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '32px', 
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                        color: '#fff',
                        border: 'none', 
                        borderRadius: '32px',
                        boxShadow: '0 20px 40px rgba(245, 158, 11, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <CreditCard size={24} /> Membership Status
                            </h3>
                            {currentMembership && (
                                <span style={{ 
                                    padding: '8px 20px', 
                                    background: 'rgba(255,255,255,0.2)', 
                                    backdropFilter: 'blur(10px)', 
                                    borderRadius: '100px', 
                                    fontWeight: 900, 
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase'
                                }}>
                                    {currentMembership.status}
                                </span>
                            )}
                        </div>
                        
                        {currentMembership ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px' }}>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Plan</p>
                                        <p style={{ fontSize: '1.125rem', fontWeight: 800 }}>{currentMembership.plan.name}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined On</p>
                                        <p style={{ fontSize: '1.125rem', fontWeight: 800 }}>{formatMemberDate(currentMembership.startDate)}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valid Until</p>
                                        <p style={{ fontSize: '1.125rem', fontWeight: 800 }}>{formatMemberDate(currentMembership.endDate)}</p>
                                    </div>
                                </div>
 
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <FreezeButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                    <ActivateButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                    <RenewButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                    <WhatsAppReminder 
                                        memberName={user.name}
                                        memberPhone={user.phone || ''}
                                        gymName={user.gym.name}
                                        expiryDate={formatMemberDate(currentMembership.endDate)}
                                        upiId={user.gym.upiId || ''}
                                        upiNumber={user.gym.upiNumber || ''}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.3)' }}>
                                <p style={{ fontWeight: 800, fontSize: '1rem' }}>No Active Membership</p>
                            </div>
                        )}
                    </div>
 
                    {/* Check-ins */}
                    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Activity size={20} color="var(--brand-primary)" /> Recent Check-ins
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {user.attendances.map((att) => (
                                <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(0,0,0,0.01)', borderRadius: '20px', border: '1px solid var(--border-color)', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(45, 212, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Zap size={18} color="#2dd4bf" />
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Check-in</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{formatCheckinTime(att.timestamp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
 
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Contact Card */}
                    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <User size={18} color="var(--brand-primary)" /> Contact Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}><Phone size={18} /></div>
                                <div>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.phone}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}><Mail size={18} /></div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, wordBreak: 'break-all' }}>{user.email || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
            <style jsx>{`
                .profile-hero {
                    padding: 40px;
                }
                .membership-status-card {
                    padding: 40px;
                }
                @media (max-width: 768px) {
                    .member-detail-container {
                        gap: 24px !important;
                        padding: 16px !important;
                    }
                    .profile-hero {
                        padding: 32px 24px !important;
                        border-radius: 24px !important;
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 24px;
                    }
                    .detail-grid {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                    }
                    .membership-status-card {
                        padding: 24px !important;
                        border-radius: 24px !important;
                    }
                    .stats-grid {
                        gap: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
}
