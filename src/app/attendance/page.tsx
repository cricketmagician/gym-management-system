"use client"

import React, { useState } from 'react';
import { Camera, CheckCircle, XCircle, Smartphone } from 'lucide-react';

export default function AttendancePage() {
    const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [message, setMessage] = useState('');

    // Simulated scan function that a Member's mobile app would execute
    const simulateMemberScanningGymQR = async () => {
        setScanStatus('idle');
        setMessage('');

        try {
            // In reality, the member app authenticates as the user.
            // For this simulator, we just hardcode the first user in the DB (or pass a selected user)
            // But since this is a global demo page, let's just assume we're scanning as usr_1 for now,
            // or better yet, make an API request guessing they are logged in if we tied it to next-auth.
            // We'll hardcode the first user just to show the database write working.

            const res = await fetch('/api/v1/attendance/punch-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Mocking that the gym QR told us 'gym_01_pulsefit' is the location
                // and the member logged into the phone app is a specific real user from the DB.
                body: JSON.stringify({ gymId: 'gym_01_pulsefit', userId: 'USER_ID_PLACEHOLDER' })
            });

            const data = await res.json();

            if (res.ok) {
                setScanStatus('success');
                setMessage(data.message);
            } else {
                setScanStatus('error');
                setMessage(data.error);
            }
        } catch (e: any) {
            setScanStatus('error');
            setMessage('Network error during scan');
        }

        // Reset after 4 seconds
        setTimeout(() => {
            setScanStatus('idle');
            setMessage('');
        }, 4000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Member App Simulator</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>This page simulates what a member sees when they open your Gym's mobile app to scan the front desk QR code.</p>
            </header>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Mobile Phone Simulation Container */}
                <div style={{
                    width: '375px', height: '667px',
                    border: '8px solid #1f2937', borderRadius: '32px',
                    background: 'var(--bg-color)', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', position: 'relative',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    {/* Phone Header */}
                    <div style={{ background: '#1f2937', color: 'white', padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                        PulseFit Member App
                    </div>

                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: '32px' }}>

                        {scanStatus === 'idle' && (
                            <>
                                <div style={{ textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Ready to Workout?</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Scan the QR code at the front desk to log your attendance.</p>
                                </div>

                                <div style={{
                                    width: '200px', height: '200px',
                                    border: '2px dashed var(--brand-primary)', borderRadius: '16px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    background: 'var(--surface-color)', color: 'var(--brand-primary)', cursor: 'pointer'
                                }} onClick={simulateMemberScanningGymQR}>
                                    <Camera size={48} style={{ marginBottom: '12px' }} />
                                    <p style={{ fontWeight: 600 }}>Tap to Scan</p>
                                </div>
                            </>
                        )}

                        {scanStatus === 'error' && (
                            <div style={{ textAlign: 'center', color: 'var(--status-expired-text)', animation: 'fadeIn 0.3s' }}>
                                <XCircle size={80} style={{ marginBottom: '16px', margin: '0 auto' }} />
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Access Denied</h2>
                                <p style={{ color: 'var(--status-expired-text)' }}>{message}</p>
                            </div>
                        )}

                        {scanStatus === 'success' && (
                            <div style={{ textAlign: 'center', color: 'var(--status-active-text)', animation: 'fadeIn 0.3s' }}>
                                <CheckCircle size={80} style={{ marginBottom: '16px', margin: '0 auto' }} />
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>You're Checked In!</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Alice. Have a great workout.</p>
                                <div style={{ background: 'var(--status-active-bg)', padding: '12px', borderRadius: '8px', marginTop: '24px', fontSize: '0.875rem', fontWeight: 600 }}>
                                    2 of 30 visits this month
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Phone Home Bar line */}
                    <div style={{ width: '40%', height: '4px', background: '#e5e7eb', borderRadius: '4px', position: 'absolute', bottom: '12px', left: '30%' }}></div>
                </div>
            </div>
        </div>
    );
}
