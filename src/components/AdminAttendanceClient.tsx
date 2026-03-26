"use client"

import React, { useState, useMemo } from 'react';
import { Search, Calendar, User, Clock, ShieldCheck, ShieldAlert, Filter, Download, Zap, Sparkles } from 'lucide-react';
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

    const handleExport = () => {
        if (filteredRecords.length === 0) return;

        const headers = ["Member Name", "Phone", "Check-in Date", "Check-in Time", "Plan", "Status"];
        const rows = filteredRecords.map(record => {
            const activeSub = record.user.memberships.find(m => m.status === 'ACTIVE');
            return [
                record.user.name,
                record.user.phone || 'N/A',
                format(new Date(record.date), 'yyyy-MM-dd'),
                format(new Date(record.date), 'hh:mm a'),
                activeSub?.plan.name || 'N/A',
                activeSub ? 'VERIFIED' : 'EXPIRED'
            ];
        });

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_export_${dateFilter || 'all'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', color: '#fff' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                <div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', width: 'fit-content', marginBottom: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>LOGS</div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                        Attendance <Sparkles className="text-amber-500" size={48} />
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px', fontSize: '1.125rem', fontWeight: 500 }}>Track real-time attendance and access verification.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleExport}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 24px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, fontSize: '0.875rem', cursor: 'pointer' }}
                        className="scale-hover"
                    >
                        <Download size={20} /> Export List
                    </button>
                </div>
            </header>

            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '18px', color: 'rgba(255,255,255,0.3)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search member name or phone..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} 
                        className="focus:border-amber-500 transition-all"
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <Calendar style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '18px', color: 'rgba(255,255,255,0.3)' }} size={18} />
                    <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ width: '100%', padding: '18px 20px 18px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none' }} 
                        className="focus:border-amber-500 transition-all"
                    />
                </div>
            </div>

            {/* Table View */}
            <div className="glass-card-dark" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '24px', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Member Details</th>
                                <th style={{ padding: '24px', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Check-in Timing</th>
                                <th style={{ padding: '24px', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Membership Plan</th>
                                <th style={{ padding: '24px', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Access Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length > 0 ? filteredRecords.map((record) => {
                                const activeSub = record.user.memberships.find(m => m.status === 'ACTIVE');
                                return (
                                    <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }} className="row-hover">
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    {record.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 900, fontSize: '1rem', color: '#fff' }}>{record.user.name}</p>
                                                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{record.user.phone || 'No phone'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                                <Clock size={18} className="text-amber-500" />
                                                <span style={{ fontWeight: 900, fontSize: '1rem' }}>{format(new Date(record.date), 'hh:mm a')}</span>
                                            </div>
                                            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginTop: '4px' }}>{format(new Date(record.date), 'do MMM yyyy')}</p>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '8px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {activeSub?.plan.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            {activeSub ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2dd4bf', fontSize: '0.8125rem', fontWeight: 900 }}>
                                                    <ShieldCheck size={20} /> VERIFIED
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontSize: '0.8125rem', fontWeight: 900 }}>
                                                    <ShieldAlert size={20} /> EXPIRED
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} style={{ padding: '120px', textAlign: 'center', color: 'rgba(255,255,255,0.1)' }}>
                                        <Filter size={64} style={{ opacity: 0.1, marginBottom: '24px' }} />
                                        <p style={{ fontWeight: 800, fontSize: '1.25rem' }}>No synchronized logs found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .row-hover:hover {
                    background: rgba(255,255,255,0.02);
                }
            `}</style>
        </div>
    );
}
