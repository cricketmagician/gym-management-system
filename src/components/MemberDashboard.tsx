'use client';

import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Camera, Clock, Calendar,
    ShieldCheck, X, List, User as UserIcon, Apple,
    ChevronRight, Home, Activity, Trophy, Weight
} from 'lucide-react';
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

    // Progress Calculation for Circular Progress (Mocking 70% for now)
    const progress = 70;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }} className="member-dashboard">
            {/* Header with Greeting and Profile Pic */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {getTimeOfDay()}, <span style={{ fontWeight: 800 }}>{user.name.split(' ')[0]}</span>
                    </h1>
                    <div className="gym-access-status" style={{
                        marginTop: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: 'var(--gym-active-bg)',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--gym-active-text)'
                    }}>
                        Gym Access • Active
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '2px solid white',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        <UserIcon size={24} color="white" />
                    </div>
                </div>
            </header>

            {/* Premium Membership Card */}
            <div className="premium-card" style={{
                background: 'white',
                position: 'relative',
                padding: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <p style={{ color: 'var(--gold-primary)', fontSize: '1rem', fontWeight: 700 }}>{membership?.planName || 'Silver'} Membership</p>
                        <p style={{ color: 'var(--status-active-text)', fontSize: '1.25rem', fontWeight: 600, marginTop: '2px' }}>Active</p>
                    </div>

                    <div style={{ marginTop: '4px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Expires {mounted && membership ? new Date(membership.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '24 Jun'}
                        </p>
                    </div>

                    <div className="gold-badge" style={{ marginTop: '8px', cursor: 'pointer' }}>
                        <span style={{ fontSize: '1rem' }}>🪙</span> Gold Member <ChevronRight size={14} />
                    </div>
                </div>

                <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                        {/* Background Circle */}
                        <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                        {/* Progress Circle Layer 1 (Mock) */}
                        <circle
                            cx="70" cy="70" r={radius}
                            fill="transparent"
                            stroke="url(#gradient-blue)"
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference * 0.3}
                            strokeLinecap="round"
                            className="progress-ring__circle"
                        />
                        {/* Progress Circle Layer 2 (Mock) */}
                        <circle
                            cx="70" cy="70" r={radius - 16}
                            fill="transparent"
                            stroke="#FFEDD5"
                            strokeWidth="10"
                        />
                        <circle
                            cx="70" cy="70" r={radius - 16}
                            fill="transparent"
                            stroke="#FB923C"
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * (radius - 16)}
                            strokeDashoffset={2 * Math.PI * (radius - 16) * 0.4}
                            strokeLinecap="round"
                            className="progress-ring__circle"
                        />
                        <defs>
                            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#38BDF8" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{progress}%</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>45%</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="action-grid">
                <a href="#" className="action-item">
                    <div className="action-icon" style={{ background: 'var(--gradient-blue)' }}><List size={24} /></div>
                    <span className="action-label">Workout Plan</span>
                </a>
                <a href="#" className="action-item">
                    <div className="action-icon" style={{ background: '#7E22CE' }}><UserIcon size={24} /></div>
                    <span className="action-label">Trainer</span>
                </a>
                <a href="#" className="action-item">
                    <div className="action-icon" style={{ background: '#22C55E' }}><Apple size={24} /></div>
                    <span className="action-label">Diet Plan</span>
                </a>
                <a href="#" className="action-item" onClick={() => setShowScanner(true)}>
                    <div className="action-icon" style={{ background: '#EAB308' }}><Calendar size={24} /></div>
                    <span className="action-label">Attendance</span>
                </a>
            </div>

            {/* Suggested Workout & Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px' }}>
                <div className="premium-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '1.25rem' }}>🏋️</span>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Suggested Workout</h3>
                        <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Weight</p>
                            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>72<span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span></p>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3B82F6' }}>-3 kg <span style={{ color: 'var(--text-secondary)' }}>this month</span></p>
                        </div>
                        <div style={{ width: '100px', height: '50px', background: 'linear-gradient(to top, #EFF6FF, transparent)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                            {/* Simple Sparkline Mock */}
                            <svg width="100" height="50" viewBox="0 0 100 50">
                                <path
                                    d="M0 40 Q 25 35, 50 30 T 100 10"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <circle cx="100" cy="10" r="4" fill="#3B82F6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="premium-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', color: '#F97316', gap: '4px', alignItems: 'center' }}>
                        <Activity size={18} />
                        <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>7 Days</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', opacity: 0.3 }}>
                        {[1, 2, 3, 4, 5, 6, 7].map(i => <Weight key={i} size={14} />)}
                    </div>
                    <div>
                        <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>33 <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>this month</span></p>
                    </div>
                </div>
            </div>

            {showScanner && (
                <AttendanceScanner
                    onScan={handleScanResult}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <a href="#" className="nav-item active">
                    <Home size={24} />
                    <span>Home</span>
                </a>
                <a href="#" className="nav-item">
                    <Trophy size={24} />
                    <span>Workouts</span>
                </a>
                <a href="#" className="nav-item">
                    <ShieldCheck size={24} />
                    <span>Progress</span>
                </a>
                <a href="#" className="nav-item">
                    <UserIcon size={24} />
                    <span>Profile</span>
                </a>
            </nav>

            {/* Attendance Punch-In Floating Message (if success) */}
            {scanStatus !== 'idle' && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2000,
                    background: scanStatus === 'success' ? 'var(--status-active-bg)' : 'var(--status-expired-bg)',
                    color: scanStatus === 'success' ? 'var(--status-active-text)' : 'var(--status-expired-text)',
                    padding: '12px 24px',
                    borderRadius: '999px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    {scanStatus === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {message}
                </div>
            )}

            <style jsx>{`
                @keyframes slideDown {
                    from { transform: translate(-50%, -100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
