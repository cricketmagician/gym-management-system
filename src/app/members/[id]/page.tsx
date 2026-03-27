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
        <div className="member-detail-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1100px', margin: '0 auto', padding: '40px', background: '#0a0a0a', color: '#fff', minHeight: '100vh', position: 'relative' }}>
            {/* Luxe Watermark */}
            <div className="luxe-watermark" style={{ opacity: 0.03, position: 'fixed', top: '20%', right: '5%', fontSize: '10rem', fontWeight: 900, pointerEvents: 'none', zIndex: 0 }}>PROFILE</div>
            
            {/* Premium Header */}
            <header style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                <Link href="/members" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                    <ArrowLeft size={16} /> Back to Members
                </Link>
                
                <div className="profile-hero" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', overflow: 'hidden', color: '#fff', backdropFilter: 'blur(20px)' }}>
                    {/* Background Glow */}
                    <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '400px', height: '400px', background: 'rgba(251, 191, 36, 0.1)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ padding: '6px 12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ShieldCheck size={14} color="#f59e0b" />
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f59e0b' }}>Premium Member</span>
                            </div>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: '8px', wordBreak: 'break-word', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {user.name.toUpperCase()}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.125rem', fontWeight: 600, letterSpacing: '0.05em' }}>ID: #{user.id.slice(-8).toUpperCase()}</p>
                    </div>
 
                    <div style={{ position: 'relative', zIndex: 1, alignSelf: 'flex-start' }}>
                        <EditMemberModal user={user as any} />
                    </div>
                </div>
            </header>
 
            <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '32px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Membership Card - Premium Orange */}
                    <div className="membership-status-card" style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '32px', 
                        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', 
                        color: '#fff',
                        border: 'none', 
                        borderRadius: '32px',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.02em' }}>
                                <CreditCard size={28} strokeWidth={2.5} /> Membership Status
                            </h3>
                            {currentMembership && (
                                <span style={{ 
                                    padding: '8px 24px', 
                                    background: 'rgba(0,0,0,0.15)', 
                                    backdropFilter: 'blur(10px)', 
                                    borderRadius: '100px', 
                                    fontWeight: 950, 
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    {currentMembership.status}
                                </span>
                            )}
                        </div>
                        
                        {currentMembership ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px' }}>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Plan</p>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 950 }}>{currentMembership.plan.name}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Activation</p>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 950 }}>{formatMemberDate(currentMembership.startDate)}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expiration</p>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 950 }}>{formatMemberDate(currentMembership.endDate)}</p>
                                    </div>
                                </div>
 
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <FreezeButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                    <ActivateButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                    <RenewButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                    <WhatsAppReminder 
                                        memberName={user.name}
                                        memberPhone={user.phone || ''}
                                        gymName={user.gym.name}
                                        expiryDate={formatMemberDate(currentMembership.endDate)}
                                        status={currentMembership.status}
                                        upiId={user.gym.upiId || ''}
                                        upiNumber={user.gym.upiNumber || ''}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '48px', textAlign: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                                <p style={{ fontWeight: 950, fontSize: '1.25rem', letterSpacing: '0.05em' }}>NO ACTIVE PROTOCOL</p>
                            </div>
                        )}
                    </div>
 
                    {/* Check-ins */}
                    <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '40px', backdropFilter: 'blur(30px)' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                            <Activity size={24} color="#f59e0b" strokeWidth={2.5} /> Operational Logs
                        </h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {user.attendances.map((att) => (
                                <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', gap: '16px', transition: 'all 0.3s ease' }} className="admin-row-hover">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Zap size={22} color="#2dd4bf" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 900, fontSize: '1rem', color: '#fff', display: 'block' }}>Verified Check-in</span>
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Secure Terminal Access</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{formatCheckinTime(att.timestamp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
 
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Contact Card */}
                    <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '40px', backdropFilter: 'blur(30px)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                            <User size={20} color="#f59e0b" strokeWidth={2.5} /> Entity Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}><Phone size={20} strokeWidth={2.5} /></div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Phone</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff' }}>{user.phone}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}><Mail size={20} strokeWidth={2.5} /></div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Digital Mail</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff', wordBreak: 'break-all' }}>{user.email || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
        </div>
    );
}
