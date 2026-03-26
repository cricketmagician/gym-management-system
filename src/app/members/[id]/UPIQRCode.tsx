'use client';

import React from 'react';
import QRCode from 'react-qr-code';

interface UPIQRCodeProps {
    upiId: string;
    gymName: string;
}

export default function UPIQRCode({ upiId, gymName }: UPIQRCodeProps) {
    if (!upiId) return null;

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(gymName)}&cu=INR`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ padding: '12px', background: '#fff', borderRadius: '12px' }}>
                <QRCode 
                    value={upiLink} 
                    size={140}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
            </div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scan to Pay with Any UPI App</p>
        </div>
    );
}
