'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export default function CheckinScannerPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [result, setResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const codeReader = new BrowserQRCodeReader();
        let currentStream: MediaStream | null = null;

        if (isScanning && !result) {
            codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, error) => {
                if (result) {
                    console.log("Scanned QR:", result.getText());
                    handleCheckin(result.getText());
                    // Stop scanning once something is found
                    codeReader.reset();
                }
            });
        }

        return () => {
            codeReader.reset();
        };
    }, [isScanning, result]);

    const handleCheckin = async (gymId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/members/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gymId })
            });

            const data = await response.json();
            if (response.ok) {
                setResult({ status: 'success', message: data.message || "Check-in successful!" });
            } else {
                setResult({ status: 'error', message: data.error || "Failed to check in. Try again." });
            }
        } catch (error) {
            setResult({ status: 'error', message: "An error occurred. Check your connection." });
        } finally {
            setIsLoading(false);
            setIsScanning(false);
        }
    };

    const resetScanner = () => {
        setResult(null);
        setIsScanning(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: '80vh', position: 'relative' }}>
            <header>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Gym Check-in</h1>
                <p style={{ color: '#666', fontSize: '0.9375rem' }}>Scan the QR code at the desk to mark your attendance.</p>
            </header>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                {isScanning && !result ? (
                    <>
                        <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {/* Scanning Overlay UI */}
                        <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '220px', height: '220px', border: '2px solid #2dd4bf', borderRadius: '24px', position: 'relative', boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}>
                                {/* Corner Accents */}
                                <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '24px', height: '24px', borderTop: '4px solid #fff', borderLeft: '4px solid #fff', borderTopLeftRadius: '24px' }}></div>
                                <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '24px', height: '24px', borderTop: '4px solid #fff', borderRight: '4px solid #fff', borderTopRightRadius: '24px' }}></div>
                                <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '24px', height: '24px', borderBottom: '4px solid #fff', borderLeft: '4px solid #fff', borderBottomLeftRadius: '24px' }}></div>
                                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderBottom: '4px solid #fff', borderRight: '4px solid #fff', borderBottomRightRadius: '24px' }}></div>
                                
                                <div className="scan-line" style={{ height: '2px', background: 'linear-gradient(to right, transparent, #2dd4bf, transparent)', position: 'absolute', width: '100%', top: '0' }}></div>
                            </div>
                        </div>
                    </>
                ) : null}

                {/* Loading State */}
                {isLoading && (
                    <div style={{ position: 'absolute', inset: '0', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#fff' }}>
                        <Loader2 className="animate-spin" size={48} color="#2dd4bf" />
                        <p style={{ fontWeight: 700 }}>Verifying Check-in...</p>
                    </div>
                )}

                {/* Results UI */}
                {result && (
                    <div style={{ position: 'absolute', inset: '0', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: result.status === 'success' ? 'rgba(45, 212, 191, 0.1)' : 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                            {result.status === 'success' ? <CheckCircle2 size={40} color="#2dd4bf" /> : <AlertCircle size={40} color="#ef4444" />}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>{result.status === 'success' ? "Verified!" : "Check-in Failed"}</h2>
                        <p style={{ color: '#666', marginBottom: '32px' }}>{result.message}</p>
                        
                        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                            <button onClick={() => router.push('/member/dashboard')} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: '#000', color: '#fff', fontWeight: 700, border: 'none' }}>Back to Home</button>
                            {result.status === 'error' && (
                                <button onClick={resetScanner} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'rgba(0,0,0,0.05)', color: '#000', fontWeight: 700, border: 'none' }}>Retry</button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'start', gap: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '12px' }}>
                    <AlertCircle size={20} color="#2dd4bf" />
                </div>
                <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '4px' }}>Scanning Guide</p>
                    <p style={{ fontSize: '0.8125rem', color: '#666', lineHeight: '1.4' }}>Align the desk QR code within the frame above. The scanner will automatically detect and verify your check-in.</p>
                </div>
            </div>

            <style jsx>{`
                .scan-line {
                    animation: scan 2s linear infinite;
                }
                @keyframes scan {
                    from { top: 0; }
                    to { top: 100%; }
                }
            `}</style>
        </div>
    );
}
