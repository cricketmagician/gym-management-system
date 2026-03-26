import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, CreditCard, Activity, Phone, Mail, CheckCircle2 } from 'lucide-react';
import FreezeButton from './FreezeButton';
import ActivateButton from './ActivateButton';
import RenewButton from './RenewButton';
import EditMemberModal from './EditMemberModal';
import { formatMemberDate, formatCheckinTime } from '@/lib/date-utils';

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
            }
        }
    });

    if (!user) {
        notFound();
    }

    const currentMembership = user.memberships[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
            {/* Breadcrumb & Header */}
            <header style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Link href="/members" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                    <ArrowLeft size={16} /> Back to Members
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                            <img src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff&size=128`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{user.name}</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1rem' }}>Member Details & Management</p>
                        </div>
                    </div>
                    <EditMemberModal user={user as any} />
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                {/* Profile Card */}
                <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '8px', background: 'rgba(var(--brand-primary-rgb), 0.1)', borderRadius: '10px' }}>
                            <User size={20} color="var(--brand-primary)" />
                        </div> 
                        Contact Information
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: 'var(--text-secondary)' }}><Phone size={18} /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</p>
                                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{user.phone}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: 'var(--text-secondary)' }}><Mail size={18} /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</p>
                                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{user.email || 'Not Provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership Card */}
                <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(var(--brand-primary-rgb), 0.1)', borderRadius: '10px' }}>
                                <CreditCard size={20} color="var(--brand-primary)" />
                            </div> 
                            Membership
                        </h3>
                        {currentMembership && <span className={`badge ${currentMembership.status.toLowerCase()}`} style={{ padding: '6px 14px', borderRadius: '100px', fontWeight: 800, fontSize: '0.75rem' }}>{currentMembership.status}</span>}
                    </div>
                    
                    {currentMembership ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Plan</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 600 }}>{currentMembership.plan.name}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Start Date</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 600 }}>{formatMemberDate(currentMembership.startDate)}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Expiry Date (IST)</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{formatMemberDate(currentMembership.endDate)}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <FreezeButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                <ActivateButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                <RenewButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No active membership found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'rgba(var(--brand-primary-rgb), 0.1)', borderRadius: '10px' }}>
                        <Activity size={20} color="var(--brand-primary)" />
                    </div> 
                    Recent Check-ins (IST Timings)
                </h3>
                {user.attendances.length > 0 ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {user.attendances.map((att) => (
                            <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px solid var(--border-color)', transition: 'all 0.2s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(45, 212, 191, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={20} color="#2dd4bf" />
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>Gym Check-in</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>{formatCheckinTime(att.timestamp)}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Verified Entry</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Calendar size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                        <p style={{ fontWeight: 600 }}>No check-in history available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
