'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Camera, Clock, Calendar, ShieldCheck, X } from 'lucide-react';
import AttendanceScanner from './AttendanceScanner';

interface AttendanceRecord {
    id: string;
    timestamp: string;
}

interface MemberDashboardProps {
    user: {
        id: string;
        name: string;
        gymId: string;
    };
    membership: {
        status: string;
        endDate: string;
        planName: string;
    } | null;
    attendance: AttendanceRecord[];
}

export default function MemberDashboard({ user, membership, attendance: initialAttendance }: MemberDashboardProps) {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
    const [scanStatus, setScanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [showScanner, setShowScanner] = useState(false);
    const [message, setMessage] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleScanResult = async (scannedData: string) => {
        // The scanned data should be the gymId
        if (scannedData !== user.gymId) {
            setScanStatus('error');
            setMessage('Invalid QR code. Please scan the gym desk QR.');
            setShowScanner(false);
            return;
        }

        setShowScanner(false);
        setScanStatus('loading');

        try {
            const res = await fetch('/api/v1/attendance/punch-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gymId: user.gymId, userId: user.id })
            });

            const data = await res.json();

            if (res.ok) {
                setScanStatus('success');
                setMessage(data.message || 'Welcome to PulseFit!');
                setAttendance([data.record, ...attendance]);
            } else {
                setScanStatus('error');
                setMessage(data.error || 'Failed to check in');
            }
        } catch (err) {
            setScanStatus('error');
            setMessage('Network error during scan');
        }

        setTimeout(() => setScanStatus('idle'), 5000);
    };

    const daysLeft = membership?.endDate
        ? Math.ceil((new Date(membership.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Welcome, {user.name}</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Here's your fitness status for today.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Membership Status Card */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Membership Plan</h2>
                        <span className={`badge ${membership?.status.toLowerCase() || 'inactive'}`}>
                            {membership?.status || 'No Plan'}
                        </span>
                    </div>

                    {membership ? (
                        <>
                            <div>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-primary)' }}>{membership.planName}</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                                    Valid until {mounted ? new Date(membership.endDate).toLocaleDateString() : '...'}
                                </p>
                            </div>

                            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    background: daysLeft > 10 ? 'var(--status-active-bg)' : 'var(--status-expiring-bg)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: daysLeft > 10 ? 'var(--status-active-text)' : 'var(--status-expiring-text)'
                                }}>
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '1.125rem' }}>{daysLeft} Days Left</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Keep up the momentum!</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>You don't have an active membership yet.</p>
                    )}
                </div>

                {/* QR Punch-In Card */}
                <div className="card" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
                    background: scanStatus === 'success' ? 'var(--status-active-bg)' :
                        scanStatus === 'error' ? 'var(--status-expired-bg)' : 'var(--surface-color)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                }}>
                    {scanStatus === 'idle' || scanStatus === 'loading' ? (
                        <>
                            <div
                                onClick={scanStatus === 'idle' ? () => setShowScanner(true) : undefined}
                                style={{
                                    width: '120px', height: '120px', borderRadius: '24px',
                                    background: 'var(--brand-primary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: scanStatus === 'idle' ? 'pointer' : 'default',
                                    boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)',
                                    opacity: scanStatus === 'loading' ? 0.7 : 1
                                }}
                            >
                                <Camera size={48} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                                    {scanStatus === 'loading' ? 'Processing...' : 'Punch In'}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                                    Scan Gym QR to mark attendance
                                </p>
                            </div>
                        </>
                    ) : scanStatus === 'success' ? (
                        <div style={{ textAlign: 'center', color: 'var(--status-active-text)' }}>
                            <CheckCircle size={64} style={{ marginBottom: '16px' }} />
                            <h3 style={{ fontWeight: 700, fontSize: '1.5rem' }}>Verified</h3>
                            <p style={{ marginTop: '8px' }}>{message}</p>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--status-expired-text)' }}>
                            <XCircle size={64} style={{ marginBottom: '16px' }} />
                            <h3 style={{ fontWeight: 700, fontSize: '1.5rem' }}>Failed</h3>
                            <p style={{ marginTop: '8px' }}>{message}</p>
                        </div>
                    )}
                </div>
            </div>

            {showScanner && (
                <AttendanceScanner
                    onScan={handleScanResult}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Attendance History */}
            <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Your Recent Visits</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length > 0 ? attendance.map((record) => {
                                const date = new Date(record.timestamp);
                                return (
                                    <tr key={record.id}>
                                        <td style={{ fontWeight: 500 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Calendar size={16} color="var(--text-secondary)" />
                                                {mounted ? date.toLocaleDateString() : '...'}
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>
                                            {mounted ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span className="badge active" style={{ fontSize: '0.7rem' }}>
                                                <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                                                Verified
                                            </span>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                        No attendance records found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
