'use client';

import React, { useState } from 'react';
import { QrCode, X, Printer, Download } from 'lucide-react';
import QRCode from 'react-qr-code';

interface AdminQrControlProps {
    gymId: string;
}

export default function AdminQrControl({ gymId }: AdminQrControlProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn"
                style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <QrCode size={18} />
                Gym Desk QR
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(40px)', zIndex: 3000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="glass-card-dark" style={{ 
                        maxWidth: '480px', width: '100%', textAlign: 'center', 
                        position: 'relative', padding: '48px 32px',
                        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(10, 10, 10, 0.8)'
                    }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ 
                                position: 'absolute', top: '24px', right: '24px', 
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                                cursor: 'pointer', borderRadius: '14px', padding: '10px'
                            }}
                            className="scale-hover"
                        >
                            <X size={20} color="#fff" />
                        </button>

                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ 
                                width: '60px', height: '60px', background: 'rgba(245,158,11,0.1)', 
                                borderRadius: '18px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', margin: '0 auto 20px', color: '#f59e0b',
                                boxShadow: '0 0 30px rgba(245,158,11,0.1)' 
                            }}>
                                <QrCode size={32} strokeWidth={2.5} />
                            </div>
                            <h2 style={{ fontSize: '1.875rem', fontWeight: 950, marginBottom: '12px', color: '#fff', letterSpacing: '-0.04em' }}>Check-in Registry</h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', fontWeight: 600, maxWidth: '280px', margin: '0 auto' }}>Display this high-fidelity entry pass at your front desk.</p>
                        </div>

                        <div style={{
                            background: '#fff',
                            padding: '32px',
                            borderRadius: '32px',
                            display: 'inline-block',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                            marginBottom: '32px',
                            position: 'relative'
                        }}>
                             <div style={{ position: 'absolute', inset: '-2px', borderRadius: '34px', background: 'linear-gradient(135deg, #f59e0b 0%, transparency 100%)', zIndex: -1, opacity: 0.5 }}></div>
                            <QRCode value={gymId} size={220} />
                        </div>

                        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                            <button
                                onClick={() => window.print()}
                                style={{ 
                                    padding: '18px', background: '#fff', color: '#000', 
                                    borderRadius: '18px', fontWeight: 950, border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    fontSize: '1.1rem'
                                }}
                                className="scale-hover"
                            >
                                <Printer size={22} strokeWidth={2.5} />
                                Generate Print Copy
                            </button>
                            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Registry ID: <span style={{ color: '#f59e0b', marginLeft: '6px' }}>{gymId}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <style jsx>{`
                        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
                </div>
            )}
        </>
    );
}
