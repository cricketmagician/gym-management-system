"use client"

import React, { useState, useMemo } from 'react';
import { Search, Calendar, User, Clock, ShieldCheck, ShieldAlert, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceRecord {
    id: string;
    date: Date;
    user: {
        name: string;
        phone: string | null;
        id: string;
        memberships: {
            status: string;
            plan: { name: string };
        }[];
    };
}

interface AdminAttendanceClientProps {
    initialRecords: AttendanceRecord[];
}

export default function AdminAttendanceClient({ initialRecords }: AdminAttendanceClientProps) {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));

    const filteredRecords = useMemo(() => {
        return initialRecords.filter(record => {
            const matchesSearch = record.user.name.toLowerCase().includes(search.toLowerCase()) || 
                                 (record.user.phone && record.user.phone.includes(search));
            const recordDate = format(new Date(record.date), 'yyyy-MM-dd');
            const matchesDate = !dateFilter || recordDate === dateFilter;
            return matchesSearch && matchesDate;
        });
    }, [search, dateFilter, initialRecords]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ background: '#f59e0b', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', width: 'fit-content', marginBottom: '12px' }}>LOGS</div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#111' }}>Member Check-ins</h1>
                    <p style={{ color: '#666', marginTop: '4px', fontWeight: 500 }}>Track real-time attendance and access verification.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                        <Download size={18} /> Export List
                    </button>
                </div>
            </header>

            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', background: 'rgba(0,0,0,0.02)', padding: '24px', borderRadius: '24px' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', top: '14px', left: '16px', color: '#94a3b8' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search member name or phone..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.9375rem', fontWeight: 500, outline: 'none' }} 
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <Calendar style={{ position: 'absolute', top: '14px', left: '16px', color: '#94a3b8' }} size={18} />
                    <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.9375rem', fontWeight: 500, outline: 'none' }} 
                    />
                </div>
            </div>

            {/* Table View */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Details</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Check-in Timing</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membership Plan</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length > 0 ? filteredRecords.map((record) => {
                                const activeSub = record.user.memberships.find(m => m.status === 'ACTIVE');
                                return (
                                    <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }} className="row-hover">
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                    {record.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#111' }}>{record.user.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{record.user.phone || 'No phone'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111' }}>
                                                <Clock size={16} color="#94a3b8" />
                                                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{format(new Date(record.date), 'hh:mm a')}</span>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{format(new Date(record.date), 'do MMM yyyy')}</p>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(79, 70, 229, 0.05)', color: '#4f46e5', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                {activeSub?.plan.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            {activeSub ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.75rem', fontWeight: 800 }}>
                                                    <ShieldCheck size={16} /> VERIFIED
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 800 }}>
                                                    <ShieldAlert size={16} /> EXPIRED
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
                                        <Filter size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                                        <p style={{ fontWeight: 600 }}>No attendance records found for this criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .row-hover:hover {
                    background: #f8fafc;
                }
            `}</style>
        </div>
    );
}
