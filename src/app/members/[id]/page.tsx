import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, CreditCard, Activity } from 'lucide-react';
import FreezeButton from './FreezeButton';
import ActivateButton from './ActivateButton';
import RenewButton from './RenewButton';
import EditMemberModal from './EditMemberModal';

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
                take: 5
            }
        }
    });

    if (!user) {
        notFound();
    }

    const currentMembership = user.memberships[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/members" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--surface-color)', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>{user.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Member Details & Management</p>
                    </div>
                </div>
                <EditMemberModal user={user as any} />
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Profile Card */}
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} color="var(--brand-primary)" /> Contact Info
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div><strong style={{ fontSize: '0.875rem' }}>Phone:</strong> <span style={{ color: 'var(--text-secondary)' }}>{user.phone}</span></div>
                        <div><strong style={{ fontSize: '0.875rem' }}>Email:</strong> <span style={{ color: 'var(--text-secondary)' }}>{user.email || 'Not Provided'}</span></div>
                    </div>
                </div>

                {/* Membership Card */}
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CreditCard size={18} color="var(--brand-primary)" /> Membership
                        </div>
                        {currentMembership && <span className={`badge ${currentMembership.status.toLowerCase()}`}>{currentMembership.status}</span>}
                    </h3>
                    {currentMembership ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div><strong style={{ fontSize: '0.875rem' }}>Plan:</strong> <span style={{ color: 'var(--text-secondary)' }}>{currentMembership.plan.name}</span></div>
                            <div><strong style={{ fontSize: '0.875rem' }}>Start Date:</strong> <span style={{ color: 'var(--text-secondary)' }}>{currentMembership.startDate.toLocaleDateString()}</span></div>
                            <div><strong style={{ fontSize: '0.875rem' }}>Expires On:</strong> <span style={{ color: 'var(--text-secondary)' }}>{currentMembership.endDate.toLocaleDateString()}</span></div>

                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                <FreezeButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                <ActivateButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                                <RenewButton membershipId={currentMembership.id} currentStatus={currentMembership.status} />
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No active membership found.</p>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="var(--brand-primary)" /> Recent Check-ins
                </h3>
                {user.attendances.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {user.attendances.map((att) => (
                            <li key={att.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontWeight: 500 }}>Gym Check-in</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                    {att.timestamp.toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No recent check-in history.</p>
                )}
            </div>
        </div>
    );
}
