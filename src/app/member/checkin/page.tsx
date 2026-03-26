"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle, XCircle, ArrowLeft, Zap, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function MemberCheckinPage() {
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReader = useRef<BrowserMultiFormatReader | null>(null);

    useEffect(() => {
        // Initialize ZXing reader
        codeReader.current = new BrowserMultiFormatReader();
        
        return () => {
            // Cleanup: Stop all video streams when leaving
            if (codeReader.current) {
                codeReader.current.reset();
            }
        };
    }, []);

    const startScanner = async () => {
        setScanStatus('scanning');
        setMessage('');

        try {
            if (!codeReader.current) return;

            // Start decoding from the first available camera
            await codeReader.current.decodeFromVideoDevice(
                null, // Use default/first camera
                videoRef.current!,
                (result, error) => {
                    // Critical: only process if we are actively scanning AND video is visible
                    if (result && videoRef.current && videoRef.current.readyState >= 3) {
                        const decodedText = result.getText();
                        if (!decodedText) return;
                        
                        console.log("Scanned QR:", decodedText);
                        
                        // Immediately stop further scan calls while processing
                        codeReader.current?.reset();
                        
                        handleScanResult(decodedText);
                    }
                    if (error && !(error.name === 'NotFoundException')) {
                        console.error("Scanner error:", error);
                    }
                }
            );
        } catch (err) {
            console.error("Failed to start camera:", err);
            setScanStatus('error');
            setMessage("Camera access denied or not found. Please check your permissions.");
        }
    };

    const handleScanResult = async (qrData: string) => {
        setScanStatus('scanning'); // Keep 'verifying' UI state
        
        try {
            // Expecting JSON or simple ID from QR
            let gymId = qrData;
            try {
                const parsed = JSON.parse(qrData);
                if (parsed.gymId) gymId = parsed.gymId;
            } catch (e) {
                // Not JSON, assume it's the raw ID
            }

            const res = await fetch('/api/v1/attendance/punch-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    gymId: gymId,
                    userId: 'current'
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

    const resetScanner = () => {
        if (codeReader.current) {
            codeReader.current.reset();
        }
        setScanStatus('idle');
        setMessage('');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <Link href="/member/dashboard" style={{ color: 'var(--text-primary)', background: 'rgba(var(--text-primary-rgb, 255, 255, 255), 0.1)', padding: '10px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Access Scanner</h1>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Entrance</p>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
                
                <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                    {/* Scanner Frame */}
                    <div style={{ position: 'absolute', top: -10, left: -10, width: '40px', height: '40px', borderTop: '4px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: '4px 0 0 0', zIndex: 10 }} />
                    <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', borderTop: '4px solid #f59e0b', borderRight: '4px solid #f59e0b', borderRadius: '0 4px 0 0', zIndex: 10 }} />
                    <div style={{ position: 'absolute', bottom: -10, left: -10, width: '40px', height: '40px', borderBottom: '4px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: '0 0 0 4px', zIndex: 10 }} />
                    <div style={{ position: 'absolute', bottom: -10, right: -10, width: '40px', height: '40px', borderBottom: '4px solid #f59e0b', borderRight: '4px solid #f59e0b', borderRadius: '0 0 4px 0', zIndex: 10 }} />
                    
                    <div className="card" style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: '#000', // Keep viewport dark for contrast
                        borderRadius: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid var(--border-color)'
                    }}>
                        {/* Camera Viewport */}
                        <video 
                            ref={videoRef}
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                display: scanStatus === 'scanning' ? 'block' : 'none'
                            }} 
                        />

                        {/* Overlays */}
                        {scanStatus === 'idle' && (
                            <div onClick={startScanner} style={{ cursor: 'pointer', textAlign: 'center', zIndex: 5 }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}>
                                    <Camera size={32} />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '0.875rem', color: '#fff' }}>TAP TO ACTIVATE</p>
                            </div>
                        )}

                        {scanStatus === 'success' && (
                            <div style={{ textAlign: 'center', animation: 'scaleUp 0.3s ease', zIndex: 5 }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <CheckCircle size={40} />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '1rem', color: '#10b981' }}>VERIFIED</p>
                            </div>
                        )}

                        {scanStatus === 'error' && (
                            <div style={{ textAlign: 'center', animation: 'shake 0.4s ease', zIndex: 5 }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <XCircle size={40} />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: '1rem', color: '#ef4444' }}>DENIED</p>
                            </div>
                        )}

                        {/* Scanning Line Animation */}
                        {scanStatus === 'scanning' && (
                            <div style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '100%', 
                                height: '2px', 
                                background: 'linear-gradient(to right, transparent, #f59e0b, transparent)', 
                                boxShadow: '0 0 15px #f59e0b',
                                animation: 'scanMove 2s linear infinite',
                                zIndex: 6
                            }} />
                        )}
                    </div>
                </div>

                <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                    {scanStatus === 'idle' && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 }}>
                            Ensure the gym's check-in QR code is well-lit and centered in the frame.
                        </p>
                    )}
                    {scanStatus === 'scanning' && (
                        <p style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                            LOOKING FOR QR...
                        </p>
                    )}
                    {(scanStatus === 'success' || scanStatus === 'error') && (
                        <div style={{ animation: 'fadeInVisible 0.5s ease' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.5, color: scanStatus === 'error' ? '#ef4444' : 'var(--text-primary)' }}>{message}</p>
                            <button 
                                onClick={resetScanner}
                                style={{ marginTop: '24px', background: 'var(--text-primary)', color: 'var(--surface-color)', border: 'none', padding: '14px 32px', borderRadius: '16px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '24px auto 0' }}
                            >
                                <RefreshCw size={18} /> TRY AGAIN
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <footer style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', opacity: 0.3 }}>
                    <Sparkles size={14} />
                    <span style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em' }}>PRECISION ACCESS ENGINE</span>
                </div>
            </footer>

            <style jsx>{`
                @keyframes scanMove {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
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
