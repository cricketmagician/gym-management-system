"use client"

import React, { useState } from 'react';
import QRCode from "react-qr-code";
import { X } from 'lucide-react';

interface QrModalProps {
    memberId: string;
    memberName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function QrCodeModal({ memberId, memberName, isOpen, onClose }: QrModalProps) {
    if (!isOpen) return null;

    // The QR value is just the member ID (in a real system, it would be an encrypted JWT/Token)
    const qrValue = JSON.stringify({ userId: memberId });

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <X size={24} color="var(--text-secondary)" />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Member QR Pass</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{memberName}</p>

                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block' }}>
                    <QRCode value={qrValue} size={200} />
                </div>

                <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Scan this code at the front desk to check-in.
                </p>
            </div>
        </div>
    );
}
