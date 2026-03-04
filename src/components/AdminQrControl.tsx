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
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="card" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', position: 'relative', padding: '32px' }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} color="var(--text-secondary)" />
                        </button>

                        <div style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Gym Desk QR</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Print this QR code and place it at your gym's front desk for members to scan.</p>
                        </div>

                        <div style={{
                            background: 'white',
                            padding: '24px',
                            borderRadius: '16px',
                            display: 'inline-block',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            marginBottom: '24px'
                        }}>
                            <QRCode value={gymId} size={250} />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => window.print()}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                <Printer size={18} style={{ marginRight: '8px' }} />
                                Print QR
                            </button>
                        </div>

                        <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Gym ID: <code style={{ background: 'var(--bg-color)', padding: '2px 6px', borderRadius: '4px' }}>{gymId}</code>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
