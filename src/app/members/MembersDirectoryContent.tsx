'use client';

import React, { useState, useMemo } from 'react';
import { Search, User, Phone, Calendar, ArrowRight, MessageSquare, Filter, MoreVertical, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { formatMemberDate } from '@/lib/date-utils';

interface Member {
    id: string;
    name: string;
    phone: string | null;
    gender: string | null;
    photoUrl: string | null;
    memberships: {
        status: string;
        startDate: Date;
        endDate: Date;
        plan: { name: string };
    }[];
}

interface MembersDirectoryContentProps {
    initialMembers: any[];
}

export default function MembersDirectoryContent({ initialMembers }: MembersDirectoryContentProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'MALE' | 'FEMALE' | 'OTHER'>('ALL');

    const filteredMembers = useMemo(() => {
        return initialMembers.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                                 (m.phone && m.phone.includes(search));
            const matchesFilter = filter === 'ALL' || m.gender === filter;
            return matchesSearch && matchesFilter;
        });
    }, [search, filter, initialMembers]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Unified Controls Wrap */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px' 
            }}>
                <div style={{ 
                    display: 'flex', 
                    background: 'rgba(0,0,0,0.03)', 
                    padding: '6px', 
                    borderRadius: '16px', 
                    gap: '4px',
                    width: '100%',
                    overflowX: 'auto'
                }}>
                    <TabButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="All" count={initialMembers.length} />
                    <TabButton active={filter === 'MALE'} onClick={() => setFilter('MALE')} label="Male" count={initialMembers.filter(m => m.gender === 'MALE').length} />
                    <TabButton active={filter === 'FEMALE'} onClick={() => setFilter('FEMALE')} label="Female" count={initialMembers.filter(m => m.gender === 'FEMALE').length} />
                </div>

                <div style={{ position: 'relative', width: '100%' }}>
                    <Search style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} size={20} />
                    <input 
                        type="text" 
                        placeholder="Search names or numbers..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ 
                            width: '100%',
                            padding: '16px 16px 16px 48px', 
                            borderRadius: '18px', 
                            border: '1px solid var(--border-color)', 
                            background: 'var(--surface-color)', 
                            fontSize: '1rem',
                            fontWeight: 600,
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }} 
                    />
                </div>
            </div>

            {/* Grid View */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '20px' 
            }}>
                {filteredMembers.length > 0 ? filteredMembers.map((member, idx) => (
                    <MemberCard key={member.id} member={member} delay={idx * 0.05} />
                )) : (
                    <div style={{ gridColumn: '1 / -1', padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Filter size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
                        <p style={{ fontWeight: 600 }}>No members found matching your criteria.</p>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function TabButton({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) {
    return (
        <button 
            onClick={onClick}
            style={{
                padding: '8px 20px',
                borderRadius: '12px',
                border: 'none',
                background: active ? '#000' : 'transparent',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {label}
            <span style={{ 
                fontSize: '0.7rem', 
                opacity: 0.6, 
                background: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                padding: '2px 8px',
                borderRadius: '100px'
            }}>{count}</span>
        </button>
    );
}

function MemberCard({ member, delay }: { member: any, delay: number }) {
    const latestMembership = member.memberships[0];
    const status = latestMembership?.status || 'INACTIVE';
    const isExpired = status === 'EXPIRED';

    return (
        <div style={{ 
            animation: `fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s both`,
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            transition: 'all 0.3s ease',
            cursor: 'default'
        }} className="member-card-hover">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#000', overflow: 'hidden' }}>
                    <img src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.name}&background=000&color=fff`} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2px' }}>{member.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={12} /> {member.phone || 'No phone'}
                        <span style={{ opacity: 0.3 }}>|</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{member.id.slice(-8).toUpperCase()}</span>
                    </p>
                </div>
                <span className={`badge ${status.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '4px 10px' }}>{status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '14px' }}>
                <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Plan</p>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{latestMembership?.plan.name || 'No Plan'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Expiry</p>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: isExpired ? '#ef4444' : 'inherit' }}>
                        {latestMembership ? formatMemberDate(latestMembership.endDate) : 'N/A'}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <Link 
                    href={`/members/${member.id}`} 
                    style={{ 
                        flex: 1,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        padding: '12px', 
                        background: '#000', 
                        color: '#fff', 
                        borderRadius: '14px', 
                        textDecoration: 'none', 
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        transition: 'transform 0.2s ease'
                    }}
                >
                    Manage
                    <ArrowRight size={14} />
                </Link>
                {member.phone && (
                    <a 
                        href={`https://wa.me/${member.phone.replace(/\D/g, '')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                            padding: '12px',
                            background: 'rgba(37, 211, 102, 0.1)',
                            color: '#25D366',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <MessageSquare size={18} />
                    </a>
                )}
            </div>
            
            <style jsx>{`
                .member-card-hover:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
                    border-color: rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}
