"use client"

import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MemberCheckinPage() {
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const simulateScan = async () => {
        setScanStatus('scanning');
        
        try {
            // Simplified punch-in for demo/simulator
            const res = await fetch('/api/v1/attendance/punch-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    gymId: 'gym_01_pulsefit', // This would normally come from the QR code
                    userId: 'current' // Handled by session on backend
                })
            });

            const data = await res.json();

            if (res.ok) {
                setScanStatus('success');
                setMessage(data.message || "Welcome back! Your attendance is logged.");
            } else {
                setScanStatus('error');
                setMessage(data.error || "Could not verify your access.");
            }
        } catch (e) {
            setScanStatus('error');
            setMessage("Network error. Please try again.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <Link href="/member/dashboard" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '14px' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Access Scanner</h1>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scan Gym QR Code</p>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
                
                <div style={{ position: 'relative', width: '280px', height: '280px' }}>
                    {/* Scanner Frame */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '4px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: '4px 0 0 0' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '4px solid #f59e0b', borderRight: '4px solid #f59e0b', borderRadius: '0 4px 0 0' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '4px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: '0 0 0 4px' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '4px solid #f59e0b', borderRight: '4px solid #f59e0b', borderRadius: '0 0 4px 0' }} />
                    
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {scanStatus === 'idle' && (
                            <div onClick={simulateScan} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Camera size={32} />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '0.875rem' }}>TAP TO SCAN</p>
                            </div>
                        )}

                        {scanStatus === 'scanning' && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '60px', height: '60px', border: '4px solid rgba(245, 158, 11, 0.2)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                                <p style={{ fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.05em' }}>VERIFYING...</p>
                            </div>
                        )}

                        {scanStatus === 'success' && (
                            <div style={{ textAlign: 'center', animation: 'scaleUp 0.3s ease' }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <CheckCircle size={40} />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '1rem', color: '#10b981' }}>SUCCESS!</p>
                            </div>
                        )}

                        {scanStatus === 'error' && (
                            <div style={{ textAlign: 'center', animation: 'shake 0.4s ease' }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <XCircle size={40} />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '1rem', color: '#ef4444' }}>DENIED</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: 'center', maxWidth: '280px' }}>
                    {scanStatus === 'idle' && (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500 }}>
                            Point your camera at the PulseFit desk QR code to log your workout.
                        </p>
                    )}
                    {(scanStatus === 'success' || scanStatus === 'error') && (
                        <div style={{ animation: 'fadeInVisible 0.5s ease' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.5 }}>{message}</p>
                            <button 
                                onClick={() => setScanStatus('idle')}
                                style={{ marginTop: '24px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer' }}
                            >
                                TRY AGAIN
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <footer style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)' }}>
                    <Sparkles size={14} />
                    <span style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em' }}>POWERED BY PULSEFIT AI</span>
                </div>
            </footer>

            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes fadeInVisible { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `}</style>
        </div>
    );
}
