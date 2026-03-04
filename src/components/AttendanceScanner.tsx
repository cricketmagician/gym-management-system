'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { X, Camera, RefreshCw } from 'lucide-react';

interface AttendanceScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

export default function AttendanceScanner({ onScan, onClose }: AttendanceScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const codeReader = new BrowserQRCodeReader();

        async function startScanning() {
            try {
                const videoInputDevices = await codeReader.listVideoInputDevices();
                if (videoInputDevices.length === 0) {
                    setError('No camera found');
                    setIsLoading(false);
                    return;
                }

                // Default to back camera if available
                const selectedDeviceId = videoInputDevices.find((device: any) =>
                    device.label.toLowerCase().includes('back')
                )?.deviceId || videoInputDevices[0].deviceId;

                const controls = await codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current!,
                    (result, err) => {
                        if (result) {
                            onScan(result.getText());
                        }
                    }
                );

                controlsRef.current = controls;
                setIsLoading(false);
            } catch (err) {
                console.error('Scanner Error:', err);
                setError('Could not access camera (Check permissions)');
                setIsLoading(false);
            }
        }

        startScanning();

        return () => {
            if (controlsRef.current) {
                controlsRef.current.stop();
            }
            // Explicitly stop all video tracks to kill the camera light
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [onScan]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', padding: '20px'
        }}>
            <header style={{
                width: '100%', maxWidth: '400px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '20px', color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={20} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Scan Gym QR</h2>
                </div>
                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>
            </header>

            <div style={{
                position: 'relative', width: '100%', maxWidth: '400px',
                aspectRatio: '1', borderRadius: '24px', overflow: 'hidden',
                background: '#000', border: '2px solid var(--brand-primary)'
            }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <RefreshCw className="animate-spin" size={32} />
                    </div>
                )}

                {error ? (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', color: 'white', textAlign: 'center', padding: '20px'
                    }}>
                        <X size={48} color="var(--status-expired-text)" style={{ marginBottom: '12px' }} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}

                {/* Scanning Frame Overlay */}
                {!error && !isLoading && (
                    <div style={{
                        position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%',
                        border: '2px solid var(--brand-primary)', borderRadius: '12px',
                        boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{
                            position: 'absolute', width: '100%', height: '2px',
                            background: 'var(--brand-primary)', top: '0%',
                            animation: 'scanLine 2s linear infinite',
                            boxShadow: '0 0 8px var(--brand-primary)'
                        }} />
                    </div>
                )}
            </div>

            <p style={{ marginTop: '24px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: '0.875rem' }}>
                Point your camera at the PulseFit QR code <br /> located at the front desk.
            </p>

            <style jsx global>{`
                @keyframes scanLine {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
