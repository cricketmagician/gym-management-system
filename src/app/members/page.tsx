import React from 'react';
import { Search, Plus, AlertCircle, QrCode } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from 'next/link';

export default async function MembersPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div style={{ padding: '48px', textAlign: 'center' }}>Please sign in to view members.</div>;
    }

    // Fetch real members from DB
    const members = await prisma.user.findMany({
        where: { gymId: session.user.gymId, role: 'MEMBER' },
        include: { memberships: { orderBy: { endDate: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Members Directory</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage your gym's complete roster here.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-secondary)' }} size={18} />
                        <input type="text" placeholder="Search..." style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    {/* Placeholder Add Member button for now - will need a dedicated page or interactive modal client component */}
                    <Link href="/members/new" className="btn btn-primary" style={{ textDecoration: 'none' }}><Plus size={18} style={{ marginRight: '8px' }} />Add Member</Link>
                </div>
            </header>

            {(() => {
                const renderTable = (title: string, memberList: typeof members) => (
                    <div style={{ marginBottom: '32px' }} key={title}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>{title} ({memberList.length})</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberList.length > 0 ? memberList.map((user) => {
                                        const latestMembership = user.memberships[0];
                                        const status = latestMembership?.status || 'INACTIVE';

                                        return (
                                            <tr key={user.id}>
                                                <td style={{ fontWeight: 500 }}>{user.name || 'Unknown'}</td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{user.phone || 'N/A'}</td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{latestMembership ? latestMembership.startDate.toLocaleDateString() : 'N/A'}</td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{latestMembership ? latestMembership.endDate.toLocaleDateString() : 'N/A'}</td>
                                                <td><span className={`badge ${status.toLowerCase()}`}>{status}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <Link href={`/members/${user.id}`} className="btn" style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}>Manage</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                                                No members found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

                const males = members.filter(m => m.gender === 'MALE');
                const females = members.filter(m => m.gender === 'FEMALE');
                const others = members.filter(m => m.gender !== 'MALE' && m.gender !== 'FEMALE');

                return (
                    <>
                        {renderTable("Male Members", males)}
                        {renderTable("Female Members", females)}
                        {others.length > 0 && renderTable("Other / Unspecified", others)}
                    </>
                );
            })()}
        </div>
    );
}
