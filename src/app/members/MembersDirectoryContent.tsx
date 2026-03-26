'use client';

import React, { useState, useMemo } from 'react';
import { Search, User, Filter, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface Member {
    id: string;
    name: string;
    phone: string | null;
    gender: string | null;
    photoUrl: string | null;
    memberships: {
        status: string;
        plan: { name: string };
    }[];
}

interface MembersDirectoryContentProps {
    initialMembers: any[];
}

export default function MembersDirectoryContent({ initialMembers }: MembersDirectoryContentProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');

    const filteredMembers = useMemo(() => {
        return initialMembers.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                                 (m.phone && m.phone.includes(search));
            const matchesFilter = filter === 'ALL' || m.gender === filter;
            return matchesSearch && matchesFilter;
        });
    }, [search, filter, initialMembers]);

    const boys = filteredMembers.filter(m => m.gender === 'MALE');
    const girls = filteredMembers.filter(m => m.gender === 'FEMALE');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '80px' }}>
            {/* Elite Controls Wrap */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <Search style={{ position: 'absolute', top: '20px', left: '24px', color: 'rgba(255,255,255,0.3)' }} size={24} />
                    <input 
                        type="text" 
                        placeholder="Search names or numbers..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ 
                            width: '100%',
                            padding: '20px 24px 20px 64px', 
                            borderRadius: '24px', 
                            border: '1px solid rgba(255,255,255,0.08)', 
                            background: 'rgba(255,255,255,0.03)', 
                            color: '#fff',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }} 
                        className="focus:border-amber-500/50 focus:bg-white/5"
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '8px', 
                    borderRadius: '50px', 
                    gap: '4px',
                    width: 'fit-content',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <TabButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Roster" count={initialMembers.length} />
                    <TabButton active={filter === 'MALE'} onClick={() => setFilter('MALE')} label="Boys" count={initialMembers.filter(m => m.gender === 'MALE').length} />
                    <TabButton active={filter === 'FEMALE'} onClick={() => setFilter('FEMALE')} label="Girls" count={initialMembers.filter(m => m.gender === 'FEMALE').length} />
                </div>
            </div>

            {/* Categorized View */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                {(filter === 'ALL' || filter === 'MALE') && boys.length > 0 && (
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                            Boys Category
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {boys.map((member, idx) => (
                                <MinimalMemberCard key={member.id} member={member} delay={idx * 0.03} />
                            ))}
                        </div>
                    </section>
                )}

                {(filter === 'ALL' || filter === 'FEMALE') && girls.length > 0 && (
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></div>
                            Girls Category
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {girls.map((member, idx) => (
                                <MinimalMemberCard key={member.id} member={member} delay={idx * 0.03} />
                            ))}
                        </div>
                    </section>
                )}

                {filteredMembers.length === 0 && (
                    <div style={{ padding: '120px 40px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.01)', borderRadius: '48px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                        <Filter size={64} style={{ opacity: 0.1, marginBottom: '24px' }} />
                        <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>No members found in this category.</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.5 }}>Try adjusting your search or filter settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) {
    return (
        <button 
            onClick={onClick}
            style={{
                padding: '12px 28px',
                borderRadius: '40px',
                border: 'none',
                background: active ? '#fff' : 'transparent',
                color: active ? '#000' : 'rgba(255,255,255,0.4)',
                fontWeight: 800,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}
        >
            {label}
            <span style={{ 
                fontSize: '0.7rem', 
                opacity: 0.8, 
                background: active ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)',
                color: active ? '#000' : 'rgba(255,255,255,0.3)',
                padding: '2px 10px',
                borderRadius: '100px',
                fontWeight: 900
            }}>{count}</span>
        </button>
    );
}

function MinimalMemberCard({ member, delay }: { member: any, delay: number }) {
    const status = member.memberships[0]?.status || 'INACTIVE';

    return (
        <Link 
            href={`/members/${member.id}`}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '24px', 
                textDecoration: 'none',
                color: '#fff',
                transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`
            }}
            className="member-card-minimal"
        >
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.name}&background=111&color=fff&bold=true`} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{member.name}</h3>
                    {status === 'ACTIVE' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', opacity: 0.3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    #{member.id.slice(-6).toUpperCase()}
                </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.3s ease' }} className="member-card-arrow">
                <ArrowRight size={16} />
            </div>

            <style jsx>{`
                .member-card-minimal:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.15);
                    transform: translateX(8px);
                }
                .member-card-minimal:hover .member-card-arrow {
                    opacity: 1;
                    transform: translateX(4px);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Link>
    );
}
